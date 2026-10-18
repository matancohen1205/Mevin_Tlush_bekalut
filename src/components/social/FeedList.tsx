/** A vertical list of posts, or a friendly empty message. */
import type { Post } from "../../types";
import { tr, useLang } from "../../i18n";
import { PostCard } from "./PostCard";

/** `emptyText` is the translated message shown when there are no posts. */
export function FeedList({ posts, emptyText }: { posts: Post[]; emptyText?: string }) {
  useLang();
  if (posts.length) return <div className="feed">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>;
  return <div className="empty"><div className="big">🌊</div><p>{emptyText ?? tr("עוד אין מה להציג. עקבו אחרי אנשים או שתפו שיר ראשון.")}</p></div>;
}
