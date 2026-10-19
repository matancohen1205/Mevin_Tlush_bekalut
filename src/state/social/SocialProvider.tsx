/** Community state: applies the pure transitions from domain/socialState, persists, and runs the demo reactions. */
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { initialFollowStatus, togglePostLike } from "../../domain/social";
import { acceptIfPending, addNotification, addPost, blockUser, markAllRead, removeFollow, removePost, setFollow, unblockUser, updatePost, updateProfile, withComment, type NewNotif } from "../../domain/socialState";
import type { SocialSnapshot } from "../../types";
import { SocialContext, type SocialApi } from "./SocialContext";
import { scheduleReactions } from "./simulatedReactions";
import { createQueries } from "./socialQueries";
import { freshSocial, loadSocial, saveSocial } from "./socialStorage";
import { useTimers } from "../../hooks/useTimers";

const FOLLOW_ACCEPT_DELAY_MS = 3000;
/** Short random id for posts, comments and notifications. */
const newId = (): string => Math.random().toString(36).slice(2, 9);

/** Provides the community to the tree. */
export function SocialProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<SocialSnapshot>(loadSocial);
  const later = useTimers();
  useEffect(() => saveSocial(s), [s]);

  /** Adds a notification for the current user. */
  const notify = useCallback((n: NewNotif) => setS((d) => addNotification(d, n, newId(), Date.now())), []);

  const api = useMemo<SocialApi>(() => {
    const queries = createQueries(s);
    const edit = (change: (d: SocialSnapshot) => SocialSnapshot) => setS(change);

    return {
      ...s,
      ...queries,
      updateMe: (patch) => edit((d) => updateProfile(d, patch)),
      toggleFollow: (id) => {
        if (s.following[id]) return edit((d) => removeFollow(d, id));
        const status = initialFollowStatus(queries.profileOf(id));
        edit((d) => setFollow(d, id, status));
        if (status === "pending")
          later(FOLLOW_ACCEPT_DELAY_MS, () => { edit((d) => acceptIfPending(d, id)); notify({ type: "accepted", actorId: id }); });
      },
      block: (id) => edit((d) => blockUser(d, id)),
      unblock: (id) => edit((d) => unblockUser(d, id)),
      createPost: (post) => {
        const postId = newId();
        edit((d) => addPost(d, post, postId, Date.now()));
        scheduleReactions({
          postId, blocked: s.blocked, later, notify, newId,
          addLike: (userId) => edit((d) => updatePost(d, postId, (p) => ({ ...p, likes: [...p.likes, userId] }))),
          addComment: (comment) => edit((d) => updatePost(d, postId, (p) => withComment(p, comment))),
        });
      },
      deletePost: (id) => edit((d) => removePost(d, id)),
      toggleLike: (postId) => edit((d) => updatePost(d, postId, (p) => togglePostLike(p))),
      addComment: (postId, body) => edit((d) => updatePost(d, postId, (p) => withComment(p, { id: newId(), authorId: "me", body, createdAt: Date.now() }))),
      markRead: () => edit(markAllRead),
      notify,
      reset: () => setS(freshSocial()),
    };
  }, [s, later, notify]);

  return <SocialContext.Provider value={api}>{children}</SocialContext.Provider>;
}
