/** Dialog listing a post's comments with a box to add one. */
import { useState } from "react";
import { relativeTime } from "../../domain/time";
import { locale, tr, useLang } from "../../i18n";
import { useSocial } from "../../state/social";
import { Avatar } from "../common/Avatar";
import { Modal } from "../layout/Modal";

/** Comment thread for `postId`. */
export function CommentsSheet({ postId }: { postId: string }) {
  useLang();
  const social = useSocial();
  const [body, setBody] = useState("");
  const post = social.posts.find((p) => p.id === postId);
  if (!post) return null;

  /** Posts the typed comment. */
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    social.addComment(postId, body.trim());
    setBody("");
  };

  return (
    <Modal title={tr("תגובות")}>
      <div className="comments">
        {post.comments.length === 0 && <p className="muted">{tr("עוד אין תגובות. אפשר להיות הראשונים.")}</p>}
        {post.comments.map((c) => {
          const author = social.profileOf(c.authorId);
          return author && (
            <div key={c.id} className="comment">
              <Avatar user={author} size={34} />
              <div><strong>{tr(author.name)}</strong> <span className="muted">{relativeTime(c.createdAt, locale())}</span><p>{tr(c.body)}</p></div>
            </div>
          );
        })}
      </div>
      <form className="inline-form" onSubmit={submit}>
        <input className="input" value={body} onChange={(e) => setBody(e.target.value)} placeholder={tr("כתבו תגובה…")} aria-label={tr("תגובה")} />
        <button className="btn primary" disabled={!body.trim()}>{tr("שלח")}</button>
      </form>
    </Modal>
  );
}
