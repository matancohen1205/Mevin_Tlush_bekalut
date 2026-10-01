import { he } from "../i18n/he";

export function Soon({ title }: { title: string }) {
  return (
    <main className="page">
      <h1 className="page-title">{title}</h1>
      <div className="empty"><div className="big">🌊</div><p>{he.soon(title)}</p></div>
    </main>
  );
}
