/** A feed post: header, caption, attached song/playlist and actions. */
import { tr, useLang } from "../../i18n";
import { useSocial } from "../../state/social";
import type { Post } from "../../types";
import { Waveform } from "../common/Waveform";
import { PlaylistAttachment } from "./PlaylistAttachment";
import { PostActions } from "./PostActions";
import { PostHeader } from "./PostHeader";
import { TrackAttachment } from "./TrackAttachment";

/** Composition of the post parts. */
export function PostCard({ post }: { post: Post }) {
  useLang();
  const author = useSocial().profileOf(post.authorId);
  if (!author) return null;
  const nowPlaying = post.kind === "now_playing";
  return (
    <article className="post">
      <PostHeader post={post} author={author} />
      {nowPlaying && <div className="np"><Waveform playing /> {tr("מתנגן עכשיו אצל {name}", { name: tr(author.name) })}</div>}
      {post.caption && !nowPlaying && <p className="caption">{tr(post.caption)}</p>}
      {post.track && <TrackAttachment track={post.track} />}
      {post.playlist && <PlaylistAttachment playlist={post.playlist} />}
      <PostActions post={post} author={author} />
    </article>
  );
}
