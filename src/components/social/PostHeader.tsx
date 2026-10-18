/** Author line of a post (avatar, name, handle, age) with the "more" menu button. */
import { relativeTime } from "../../domain/time";
import { locale, tr, useLang } from "../../i18n";
import { useUi } from "../../state/ui";
import type { Post, Profile } from "../../types";
import { Avatar } from "../common/Avatar";
import { Icon } from "../common/Icon";

/** Header row; tapping the author opens their profile (not for the user's own posts). */
export function PostHeader({ post, author }: { post: Post; author: Profile }) {
  useLang();
  const { setRoute, setSheet } = useUi();
  return (
    <header className="post-head">
      <button className="who" onClick={() => post.authorId !== "me" && setRoute({ kind: "user", id: post.authorId })}>
        <Avatar user={author} />
        <span><strong>{tr(author.name)}</strong><span className="muted"> @{author.handle} · {relativeTime(post.createdAt, locale())}</span></span>
      </button>
      <button className="icon-btn" onClick={() => setSheet({ kind: "more", postId: post.id, userId: post.authorId })} aria-label={tr("עוד פעולות")}><Icon name="more" /></button>
    </header>
  );
}
