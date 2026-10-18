/** Like, comment, save-playlist and share buttons under a post. */
import { usePostSharing, useSocial } from "../../state/social";
import { useUi } from "../../state/ui";
import type { Post, Profile } from "../../types";
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";

/** Action row; "save" only appears on playlist posts. */
export function PostActions({ post, author }: { post: Post; author: Profile }) {
  useLang();
  const { toggleLike } = useSocial();
  const { setSheet } = useUi();
  const { copyLink, savePlaylist } = usePostSharing();
  const liked = post.likes.includes("me");
  return (
    <footer className="post-actions">
      <button className={`act ${liked ? "on" : ""}`} onClick={() => toggleLike(post.id)} aria-pressed={liked} aria-label={tr("לייק")}><Icon name="heart" size={20} fill={liked} /> {post.likes.length || ""}</button>
      <button className="act" onClick={() => setSheet({ kind: "comments", postId: post.id })} aria-label={tr("תגובות")}><Icon name="comment" size={20} /> {post.comments.length || ""}</button>
      {post.playlist && <button className="act" onClick={() => savePlaylist(post, tr(author.name))}><Icon name="plus" size={20} /> {tr("שמור")}</button>}
      <button className="act" onClick={() => copyLink(post)} aria-label={tr("שתף קישור")}><Icon name="share" size={20} /></button>
    </footer>
  );
}
