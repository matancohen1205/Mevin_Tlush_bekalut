/** Another member's profile: follow button, playlists and posts (or a lock for private profiles). */
import { Icon } from "../components/common/Icon";
import { FollowButton } from "../components/profile/FollowButton";
import { PlaylistShelf } from "../components/profile/PlaylistShelf";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { FeedList } from "../components/social/FeedList";
import { useSocial } from "../state/social";
import { useUi } from "../state/ui";
import { tr, useLang } from "../i18n";

/** Page composition only; visibility rules come from the social state. */
export function UserProfile({ id }: { id: string }) {
  useLang();
  const social = useSocial();
  const { setRoute, setSheet } = useUi();
  const user = social.profileOf(id);
  if (!user) return null;
  const playlists = social.playlistsOf(id);
  const blocked = social.blocked.includes(id);

  return (
    <main id="main" tabIndex={-1} className="page">
      <div className="topbar">
        <button className="icon-btn" onClick={() => setRoute(null)} aria-label={tr("חזור")}><Icon name="back" /></button>
        <button className="icon-btn" onClick={() => setSheet({ kind: "more", userId: id })} aria-label={tr("עוד פעולות")}><Icon name="more" /></button>
      </div>
      <ProfileHeader translateText profile={user} stats={{ followers: social.followersCount(id), following: social.followingCount(id), playlists: playlists.length }}>
        {blocked
          ? <button className="btn primary" onClick={() => social.unblock(id)}>{tr("בטל חסימה")}</button>
          : <FollowButton status={social.following[id]} onToggle={() => social.toggleFollow(id)} />}
      </ProfileHeader>

      {blocked ? null : !social.canSee(id) ? (
        <div className="empty"><div className="big">🔒</div><p>{tr("הפרופיל פרטי. עקבו כדי לראות את השיתופים והפלייליסטים.")}</p></div>
      ) : (
        <>
          {playlists.length > 0 && <section className="section"><div className="section-head"><h2>{tr("פלייליסטים")}</h2></div><PlaylistShelf translateTitles playlists={playlists} /></section>}
          <section className="section">
            <div className="section-head"><h2>{tr("שיתופים")}</h2></div>
            <FeedList posts={social.posts.filter((p) => p.authorId === id)} emptyText={tr("עוד אין שיתופים.")} />
          </section>
        </>
      )}
    </main>
  );
}
