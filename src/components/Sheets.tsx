import { useState } from "react";
import { generatePlaylist } from "../services/aiPlaylist";
import { useLibrary } from "../state/library";
import { usePrefs } from "../state/prefs";
import { useUi } from "../state/ui";
import { Icon } from "./Icon";
import { CommentsSheet, ComposeSheet, EditProfileSheet, MoreSheet, Modal } from "./SocialSheets";
import { tr, useLang } from "../i18n";

const IDEAS = ["נסיעה בלילה עם רוק רגוע", "אימון אנרגטי בקיץ", "ריכוז ולימודים", "ערב רומנטי עם ג׳אז"];

export function Sheets() {
  const { sheet, toast } = useUi();
  return (
    <>
      {sheet?.kind === "add" && <AddSheet track={sheet.track} />}
      {sheet?.kind === "new" && <NewSheet />}
      {sheet?.kind === "comments" && <CommentsSheet postId={sheet.postId} />}
      {sheet?.kind === "compose" && <ComposeSheet />}
      {sheet?.kind === "editProfile" && <EditProfileSheet />}
      {sheet?.kind === "more" && <MoreSheet postId={sheet.postId} userId={sheet.userId} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

function AddSheet({ track }: { track: import("../types").Track }) {
  useLang();
  const { playlists, addToPlaylist, createPlaylist } = useLibrary();
  const { setSheet, showToast } = useUi();
  const [name, setName] = useState("");
  const add = (id: string, title: string) => {
    addToPlaylist(id, track);
    showToast(tr("נוסף ל״{title}״", { title }));
    setSheet(null);
  };
  return (
    <Modal title={tr("הוספה לפלייליסט")}>
      <p className="muted" style={{ marginBottom: 12 }}>{track.title} · {track.artist}</p>
      <div className="rows">
        {playlists.map((p) => {
          const has = p.tracks.some((t) => t.id === track.id);
          return (
            <button key={p.id} className="row" disabled={has} onClick={() => add(p.id, p.title)}>
              <span className="meta"><div className="t">{p.title}</div><div className="a">{tr("{n} שירים", { n: p.tracks.length })}</div></span>
              {has && <Icon name="check" />}
            </button>
          );
        })}
      </div>
      <form className="inline-form" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { const id = createPlaylist(name); add(id, name.trim()); } }}>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={tr("פלייליסט חדש…")} aria-label={tr("שם פלייליסט חדש")} />
        <button className="btn primary" disabled={!name.trim()}>{tr("צור והוסף")}</button>
      </form>
    </Modal>
  );
}

function NewSheet() {
  useLang();
  const { createPlaylist } = useLibrary();
  const { country, source } = usePrefs();
  const { setSheet, showToast } = useUi();
  const [mode, setMode] = useState<"manual" | "ai">("ai");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [vis, setVis] = useState<"public" | "private">("private");
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);

  const make = async () => {
    if (mode === "manual") {
      createPlaylist(title, { description: desc, visibility: vis });
      showToast("הפלייליסט נוצר");
      return setSheet(null);
    }
    setBusy(true);
    const g = await generatePlaylist(prompt, country, source);
    createPlaylist(title || g.title, { description: tr("נוצר מהתיאור: {prompt}", { prompt }), visibility: vis, tracks: g.tracks });
    showToast(tr("נוצר פלייליסט עם {n} שירים", { n: g.tracks.length }));
    setSheet(null);
  };

  return (
    <Modal title={tr("פלייליסט חדש")}>
      <div className="seg" role="tablist">
        <button role="tab" aria-selected={mode === "ai"} onClick={() => setMode("ai")}><Icon name="sparkle" size={16} /> {tr("יצירה חכמה")}</button>
        <button role="tab" aria-selected={mode === "manual"} onClick={() => setMode("manual")}>{tr("ידני")}</button>
      </div>

      {mode === "ai" ? (
        <>
          <label className="lbl" htmlFor="pr">{tr("תארו את הפלייליסט שאתם רוצים")}</label>
          <textarea id="pr" className="input" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={tr("למשל: פלייליסט לנסיעה בלילה עם רוק רגוע")} />
          <div className="chip-row">{IDEAS.map((i) => <button key={i} className="chip" onClick={() => setPrompt(tr(i))}>{tr(i)}</button>)}</div>
        </>
      ) : (
        <>
          <label className="lbl" htmlFor="pt">{tr("שם")}</label>
          <input id="pt" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={tr("הפלייליסט שלי")} />
          <label className="lbl" htmlFor="pd">{tr("תיאור")}</label>
          <textarea id="pd" className="input" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </>
      )}

      <div className="seg" role="radiogroup" aria-label={tr("פרטיות")} style={{ marginTop: 12 }}>
        <button role="radio" aria-checked={vis === "private"} aria-selected={vis === "private"} onClick={() => setVis("private")}><Icon name="lock" size={16} /> {tr("פרטי")}</button>
        <button role="radio" aria-checked={vis === "public"} aria-selected={vis === "public"} onClick={() => setVis("public")}><Icon name="globe" size={16} /> {tr("ציבורי")}</button>
      </div>

      <button className="btn primary wide" disabled={busy || (mode === "ai" && !prompt.trim())} onClick={make}>
        {busy ? tr("מרכיב פלייליסט…") : mode === "ai" ? tr("צור פלייליסט") : tr("צור")}
      </button>
    </Modal>
  );
}
