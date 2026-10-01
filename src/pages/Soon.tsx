import { he } from "../i18n/he";

export function Soon({ title, themeBtn }: { title: string; themeBtn: React.ReactNode }) {
  return (
    <main className="page">
      <div className="topbar"><h1 className="page-title">{title}</h1>{themeBtn}</div>
      <div className="empty"><div className="big">🌊</div><p>{he.soon(title)}</p></div>
    </main>
  );
}
