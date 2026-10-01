-- Wavely schema. Run once in Supabase → SQL Editor → New query → Run.
-- Safe to re-run: every object uses "if not exists" / "or replace" / drop-then-create for policies.

------------------------------------------------------------------ tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text not null unique check (handle ~ '^[a-zA-Z0-9._]{3,20}$'),
  display_name text not null default '',
  bio text not null default '' check (char_length(bio) <= 140),
  hue int not null default 205,
  is_private boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.liked_tracks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  track_id text not null,
  track jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  description text not null default '' check (char_length(description) <= 300),
  visibility text not null default 'private' check (visibility in ('public', 'private')),
  created_at timestamptz not null default now()
);

create table if not exists public.playlist_tracks (
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  track_id text not null,
  track jsonb not null,
  position int not null,
  added_at timestamptz not null default now(),
  primary key (playlist_id, track_id)
);

create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  followee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'accepted' check (status in ('accepted', 'pending')),
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  check (follower_id <> followee_id)
);

create table if not exists public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('track', 'playlist', 'now_playing')),
  caption text not null default '' check (char_length(caption) <= 500),
  track jsonb,
  playlist jsonb,
  created_at timestamptz not null default now()
);
create index if not exists posts_created_idx on public.posts (created_at desc);

create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('follow', 'like', 'comment', 'accepted')),
  actor_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications (user_id, created_at desc);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('user', 'post')),
  target_id text not null,
  reason text not null,
  created_at timestamptz not null default now()
);

------------------------------------------------------------------ helpers
create or replace function public.is_blocked_pair(a uuid, b uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.blocks
    where (blocker_id = a and blocked_id = b) or (blocker_id = b and blocked_id = a)
  );
$$;

-- Can the signed-in user see content of `target`? (self, or public & not blocked, or accepted follower)
create or replace function public.can_view_user(target uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select target = auth.uid()
    or (
      not public.is_blocked_pair(auth.uid(), target)
      and (
        not coalesce((select is_private from public.profiles where id = target), true)
        or exists (select 1 from public.follows
                   where follower_id = auth.uid() and followee_id = target and status = 'accepted')
      )
    );
$$;

-- Create a profile row automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare base text;
begin
  base := left(regexp_replace(split_part(coalesce(new.email, 'user'), '@', 1), '[^a-zA-Z0-9._]', '', 'g'), 12);
  if char_length(base) < 3 then base := 'user'; end if;
  insert into public.profiles (id, handle, display_name, hue)
  values (
    new.id,
    base || '_' || (floor(random() * 9000 + 1000))::int,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(coalesce(new.email, 'משתמש'), '@', 1)),
    (floor(random() * 40) + 185)::int
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

------------------------------------------------------------------ row level security
alter table public.profiles        enable row level security;
alter table public.liked_tracks    enable row level security;
alter table public.playlists       enable row level security;
alter table public.playlist_tracks enable row level security;
alter table public.follows         enable row level security;
alter table public.blocks          enable row level security;
alter table public.posts           enable row level security;
alter table public.post_likes      enable row level security;
alter table public.comments        enable row level security;
alter table public.notifications   enable row level security;
alter table public.reports         enable row level security;

-- profiles: visible to signed-in users (private profiles hide content, not existence); edit own
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (not public.is_blocked_pair(auth.uid(), id));
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- liked tracks: private to the owner
drop policy if exists liked_all on public.liked_tracks;
create policy liked_all on public.liked_tracks for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- playlists: owner, or public + viewer allowed to see the owner
drop policy if exists playlists_select on public.playlists;
create policy playlists_select on public.playlists for select to authenticated
  using (owner_id = auth.uid() or (visibility = 'public' and public.can_view_user(owner_id)));
drop policy if exists playlists_write on public.playlists;
create policy playlists_write on public.playlists for all to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists pltracks_select on public.playlist_tracks;
create policy pltracks_select on public.playlist_tracks for select to authenticated
  using (exists (select 1 from public.playlists p where p.id = playlist_id));
drop policy if exists pltracks_write on public.playlist_tracks;
create policy pltracks_write on public.playlist_tracks for all to authenticated
  using (exists (select 1 from public.playlists p where p.id = playlist_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.playlists p where p.id = playlist_id and p.owner_id = auth.uid()));

-- follows: private profiles can only be followed through a pending request
drop policy if exists follows_select on public.follows;
create policy follows_select on public.follows for select to authenticated
  using (follower_id = auth.uid() or followee_id = auth.uid() or status = 'accepted');
drop policy if exists follows_insert on public.follows;
create policy follows_insert on public.follows for insert to authenticated
  with check (
    follower_id = auth.uid()
    and not public.is_blocked_pair(follower_id, followee_id)
    and (status = 'pending' or not exists (select 1 from public.profiles where id = followee_id and is_private))
  );
drop policy if exists follows_accept on public.follows;
create policy follows_accept on public.follows for update to authenticated
  using (followee_id = auth.uid()) with check (followee_id = auth.uid());
drop policy if exists follows_delete on public.follows;
create policy follows_delete on public.follows for delete to authenticated
  using (follower_id = auth.uid() or followee_id = auth.uid());

-- blocks: owner only
drop policy if exists blocks_all on public.blocks;
create policy blocks_all on public.blocks for all to authenticated
  using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

-- posts / likes / comments
drop policy if exists posts_select on public.posts;
create policy posts_select on public.posts for select to authenticated using (public.can_view_user(author_id));
drop policy if exists posts_insert on public.posts;
create policy posts_insert on public.posts for insert to authenticated with check (author_id = auth.uid());
drop policy if exists posts_delete on public.posts;
create policy posts_delete on public.posts for delete to authenticated using (author_id = auth.uid());

drop policy if exists likes_select on public.post_likes;
create policy likes_select on public.post_likes for select to authenticated
  using (exists (select 1 from public.posts p where p.id = post_id));
drop policy if exists likes_insert on public.post_likes;
create policy likes_insert on public.post_likes for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.posts p where p.id = post_id));
drop policy if exists likes_delete on public.post_likes;
create policy likes_delete on public.post_likes for delete to authenticated using (user_id = auth.uid());

drop policy if exists comments_select on public.comments;
create policy comments_select on public.comments for select to authenticated
  using (exists (select 1 from public.posts p where p.id = post_id));
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert to authenticated
  with check (author_id = auth.uid() and exists (select 1 from public.posts p where p.id = post_id));
drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments for delete to authenticated using (author_id = auth.uid());

-- notifications: you read your own; anyone may notify someone else as themselves
drop policy if exists notif_select on public.notifications;
create policy notif_select on public.notifications for select to authenticated using (user_id = auth.uid());
drop policy if exists notif_insert on public.notifications;
create policy notif_insert on public.notifications for insert to authenticated
  with check (actor_id = auth.uid() and not public.is_blocked_pair(actor_id, user_id));
drop policy if exists notif_update on public.notifications;
create policy notif_update on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists notif_delete on public.notifications;
create policy notif_delete on public.notifications for delete to authenticated using (user_id = auth.uid());

-- reports: write-only for users (reviewed from the dashboard)
drop policy if exists reports_insert on public.reports;
create policy reports_insert on public.reports for insert to authenticated with check (reporter_id = auth.uid());

-- realtime notifications
do $$ begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null; end $$;
