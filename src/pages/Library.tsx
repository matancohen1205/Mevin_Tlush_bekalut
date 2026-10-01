import { useLibrary } from "../state/library";
import { he } from "../i18n/he";
import { TrackRow } from "../components/Track";

export function Library() {
  const { liked } = useLibrary();
  return (
    <main className="page">
      <h1 className="page-title">{he.library.title}</h1>
      <section className="section">
        <div className="section-head"><h2>{he.library.liked}</h2><span className="muted">{liked.length}</span></div>
        {liked.length ? (
          <div className="rows">{liked.map((t) => <TrackRow key={t.id} track={t} queue={liked} />)}</div>
        ) : (
          <div className="empty"><div className="big">💙</div><p>{he.library.empty}</p></div>
        )}
      </section>
    </main>
  );
}
