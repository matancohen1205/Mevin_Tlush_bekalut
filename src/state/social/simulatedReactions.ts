/** Demo-only: makes seeded community members like and comment on the user's new post, so notifications can be tried. */
import { SEED_USERS } from "../../data/seed";
import { tr } from "../../i18n";
import type { Comment, Notif } from "../../types";

const REPLIES = ["איזה שיר! 🔥", "שמרתי לספרייה", "מושלם לנסיעה", "תודה על השיתוף 💙", "מכיר? זה אחד האהובים עליי"];
const LIKE_AFTER_MS = 2500;
const COMMENT_AFTER_MS = 6000;

export interface ReactionHooks {
  postId: string;
  blocked: readonly string[];
  later: (ms: number, fn: () => void) => void;
  addLike: (userId: string) => void;
  addComment: (comment: Comment) => void;
  notify: (n: Omit<Notif, "id" | "createdAt" | "read">) => void;
  newId: () => string;
}

/** Picks a random item. */
const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

/** Schedules one like and one comment from random public, unblocked members. */
export function scheduleReactions(h: ReactionHooks): void {
  const candidates = SEED_USERS.filter((u) => !u.isPrivate && !h.blocked.includes(u.id));
  if (!candidates.length) return;
  const liker = pick(candidates);
  const commenter = pick(candidates);

  h.later(LIKE_AFTER_MS, () => {
    h.addLike(liker.id);
    h.notify({ type: "like", actorId: liker.id, postId: h.postId });
  });
  h.later(COMMENT_AFTER_MS, () => {
    h.addComment({ id: h.newId(), authorId: commenter.id, body: tr(pick(REPLIES)), createdAt: Date.now() });
    h.notify({ type: "comment", actorId: commenter.id, postId: h.postId });
  });
}
