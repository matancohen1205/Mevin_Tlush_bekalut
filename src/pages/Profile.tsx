/** The user's own profile: summary, favourite artists, public playlists, own posts and settings. */
import { useMemo } from "react";
import { Icon } from "../components/common/Icon";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { PlaylistShelf } from "../components/profile/PlaylistShelf";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { SettingsSection } from "../components/settings/SettingsSection";
import { FeedList } from "../components/social/FeedList";
import { topArtists } from "../domain/social";
import { useLibrary } from "../state/library";
import { useSocial } from "../state/social";
import { useUi } from "../state/ui";
import { tr, useLang } from "../i18n";

/** Page composition only. */
export function Profile() {
  useLang();
  const social = useSocial();
  const { liked, playlists } = useLibrary();
  const { setSheet } = useUi();
  const artists = useMemo(() => topArtists(liked), [liked]);
  const publicPlaylists = playlists.filter((p) => p.visibility === "public");
  const myPosts = social.posts.filter((p) => p.authorId === "me");

  return (
    <main id="main" tabIndex={-1} className="page">
      <div className="topbar"><h1 className="page-title">{tr("פרופיל")}</h1><ThemeToggle /></div>
      <ProfileHeader profile={social.me} stats={{ followers: social.followersCount("me"), following: social.followingCount("me"), playlists: playlists.length }}>
        <button className="chip" onClick={() => setSheet({ kind: "editProfile" })}><Icon name="edit" size={14} /> {tr("עריכת פרופיל")}</button>
      </ProfileHeader>

      {artists.length > 0 && (
        <section className="section"><div className="section-head"><h2>{tr("אמנים אהובים")}</h2></div>
          <div className="chip-row">{artists.map((a) => <span key={a} className="chip">{a}</span>)}</div></section>
      )}
      <section className="section">
        <div className="section-head"><h2>{tr("פלייליסטים ציבוריים")}</h2></div>
        {publicPlaylists.length ? <PlaylistShelf playlists={publicPlaylists} /> : <p className="muted">{tr("פלייליסט שתגדירו כציבורי יופיע כאן.")}</p>}
      </section>
      <section className="section">
        <div className="section-head"><h2>{tr("השיתופים שלי")}</h2></div>
        {myPosts.length ? <FeedList posts={myPosts} /> : <p className="muted">{tr("עוד לא שיתפתם כלום.")}</p>}
      </section>
      <SettingsSection />
    </main>
  );
}
