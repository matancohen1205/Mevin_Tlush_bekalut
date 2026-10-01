import type { Post } from "../types";
import { useLibrary } from "../state/library";
import { usePlayer } from "../state/player";
import { useSocial } from "../state/social";
import { useUi } from "../state/ui";
import { Avatar, timeAgo } from "./Avatar";
import { Icon } from "./Icon";
import { Waveform } from "./Waveform";

export function PostCard({ post }: { post: Post }) {
  const soc = useSocial();
  const { play, current, playing } = usePlayer();
  const lib = useLibrary();
  const { setRoute, setSheet, showToast } = useUi();
  const author = soc.profileOf(post.authorId)!;
  const liked = post.likes.includes("me");
  const t = post.track;
  const active = !!t && current?.id === t.id;

  const copy = async () => {
    const text = `${post.playlist?.title ?? `${t?.title} – ${t?.artist}`} · Wavely`;
    try { await navigator.clipboard.writeText(text); showToast("הקישור הועתק"); } catch { showToast(text); }
  };
  const save = () => {
    const pl = post.playlist!;
    lib.createPlaylist(pl.title, { description: `מאת ${author.name}`, tracks: pl.tracks });
    showToast("הפלייליסט נשמר בספרייה");
  };

  return (
    <article className="post">
      <header className="post-head">
        <button className="who" onClick={() => post.authorId !== "me" && setRoute({ kind: "user", id: post.authorId })}>
          <Avatar user={author} />
          <span><strong>{author.name}</strong><span className="muted"> @{author.handle} · {timeAgo(post.createdAt)}</span></span>
        </button>
        <button className="icon-btn" onClick={() => setSheet({ kind: "more", postId: post.id, userId: post.authorId })} aria-label="עוד פעולות"><Icon name="more" /></button>
      </header>

      {post.kind === "now_playing" && <div className="np"><Waveform playing /> מתנגן עכשיו אצל {author.name}</div>}
      {post.caption && post.kind !== "now_playing" && <p className="caption">{post.caption}</p>}

      {t && (
        <button className="attach" onClick={() => play(t, [t])} aria-label={`נגן ${t.title}`}>
          <img src={t.artwork} alt="" loading="lazy" />
          <span className="meta"><span className="t">{t.title}</span><span className="a">{t.artist}</span></span>
          <span className="play-fab sm">{active && playing ? <Waveform playing /> : <Icon name="play" size={18} />}</span>
        </button>
      )}

      {post.playlist && (
        <div className="attach pl">
          <div className="mosaic" style={{ width: 64, height: 64 }}>{post.playlist.tracks.slice(0, 4).map((x, i) => <img key={i} src={x.artwork} alt="" />)}</div>
          <span className="meta"><span className="t">{post.playlist.title}</span><span className="a">{post.playlist.tracks.length} שירים</span></span>
          <button className="play-fab sm" onClick={() => play(post.playlist!.tracks[0], post.playlist!.tracks)} aria-label="נגן את הפלייליסט"><Icon name="play" size={18} /></button>
        </div>
      )}

      <footer className="post-actions">
        <button className={`act ${liked ? "on" : ""}`} onClick={() => soc.toggleLike(post.id)} aria-pressed={liked} aria-label="לייק"><Icon name="heart" size={20} fill={liked} /> {post.likes.length || ""}</button>
        <button className="act" onClick={() => setSheet({ kind: "comments", postId: post.id })} aria-label="תגובות"><Icon name="comment" size={20} /> {post.comments.length || ""}</button>
        {post.playlist && <button className="act" onClick={save}><Icon name="plus" size={20} /> שמור</button>}
        <button className="act" onClick={copy} aria-label="שתף קישור"><Icon name="share" size={20} /></button>
      </footer>
    </article>
  );
}
