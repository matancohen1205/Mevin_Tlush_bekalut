/** Avatar, name, handle, bio and counters shared by the own-profile and other-user pages. */
import type { ReactNode } from "react";
import { locale, tr } from "../../i18n";
import type { Profile } from "../../types";
import { Avatar } from "../common/Avatar";

export interface ProfileStats {
  followers: number;
  following: number;
  playlists: number;
}

/** One number with its label. */
function Stat({ value, label }: { value: number; label: string }) {
  return <div className="stat"><strong>{value.toLocaleString(locale())}</strong><span className="muted">{label}</span></div>;
}

/** `children` is the action button(s) under the counters. `translateText` localises seeded names/bios. */
export function ProfileHeader({ profile, stats, translateText = false, children }: { profile: Profile; stats: ProfileStats; translateText?: boolean; children?: ReactNode }) {
  const text = (s: string) => (translateText ? tr(s) : s);
  return (
    <section className="profile-head">
      <Avatar user={profile} size={84} />
      <h2>{text(profile.name)}</h2>
      <span className="muted" dir="ltr">@{profile.handle}{profile.isPrivate && " · 🔒"}</span>
      {profile.bio && <p>{text(profile.bio)}</p>}
      <div className="stats">
        <Stat value={stats.followers} label={tr("עוקבים")} />
        <Stat value={stats.following} label={tr("עוקב")} />
        <Stat value={stats.playlists} label={tr("פלייליסטים")} />
      </div>
      {children}
    </section>
  );
}
