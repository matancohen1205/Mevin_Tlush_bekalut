/** Seeded notifications for the demo community. */
import type { Notif } from "../../types";

const H = 3_600_000;

/** Notifications shown the first time the app opens. */
export function seedNotifs(now: number): Notif[] {
  return [
    { id: "n1", type: "follow", actorId: "noa", createdAt: now - 1 * H, read: false },
    { id: "n2", type: "like", actorId: "omer", postId: "p1", createdAt: now - 3 * H, read: false },
    { id: "n3", type: "follow", actorId: "yuki", createdAt: now - 20 * H, read: true },
  ];
}
