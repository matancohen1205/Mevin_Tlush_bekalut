import { useState } from "react";
import { generatePlaylist } from "../services/aiPlaylist";
import { useLibrary } from "../state/library";
import { usePrefs } from "../state/prefs";
import { useUi } from "../state/ui";
import { Icon } from "./Icon";
import { CommentsSheet, ComposeSheet, EditProfileSheet, MoreSheet, Modal } from "./SocialSheets";

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
  const { playlists, addToPlaylist, createPlaylist } = useLibrary();
  const { setSheet, showToast } = useUi();
  const [name, setName] = useState("");
  const add = (id: string, title: string) => {
    addToPlaylist(id, track);
    showToast(`נוסף ל״${title}״`);
    setSheet(null);
  };
  return (
    <Modal title="הוספה לפלייליסט">
      <p className="muted" style={{ marginBottom: 12 }}>{track.title} · {track.artist}</p>
      <div className="rows">
        {playlists.map((p) => {
          const has = p.tracks.some((t) => t.id === track.id);
          return (
            <button key={p.id} className="row" disabled={has} onClick={() => add(p.id, p.title)}>
              <span className="meta"><div className="t">{p.title}</div><div className="a">{p.tracks.length} שירים</div></span>
              {has && <Icon name="check" />}
            </button>
          );
        })}
      </div>
      <form className="inline-form" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { const id = createPlaylist(name); add(id, name.trim()); } }}>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="פלייליסט חדש…" aria-label="שם פלייליסט חדש" />
        <button className="btn primary" disabled={!name.trim()}>צור והוסף</button>
      </form>
    </Modal>
  );
}

function NewSheet() {
  const { createPlaylist } = useLibrary();
  const { country } = usePrefs();
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
    const g = await generatePlaylist(prompt, country);
    createPlaylist(title || g.title, { description: `נוצר מהתיאור: ${prompt}`, visibility: vis, tracks: g.tracks });
    showToast(`נוצר פלייליסט עם ${g.tracks.length} שירים`);
    setSheet(null);
  };

  return (
    <Modal title="פלייליסט חדש">
      <div className="seg" role="tablist">
        <button role="tab" aria-selected={mode === "ai"} onClick={() => setMode("ai")}><Icon name="sparkle" size={16} /> יצירה חכמה</button>
        <button role="tab" aria-selected={mode === "manual"} onClick={() => setMode("manual")}>ידני</button>
      </div>

      {mode === "ai" ? (
        <>
          <label className="lbl" htmlFor="pr">תארו את הפלייליסט שאתם רוצים</label>
          <textarea id="pr" className="input" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="למשל: פלייליסט לנסיעה בלילה עם רוק רגוע" />
          <div className="chip-row">{IDEAS.map((i) => <button key={i} className="chip" onClick={() => setPrompt(i)}>{i}</button>)}</div>
        </>
      ) : (
        <>
          <label className="lbl" htmlFor="pt">שם</label>
          <input id="pt" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="הפלייליסט שלי" />
          <label className="lbl" htmlFor="pd">תיאור</label>
          <textarea id="pd" className="input" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </>
      )}

      <div className="seg" role="radiogroup" aria-label="פרטיות" style={{ marginTop: 12 }}>
        <button role="radio" aria-checked={vis === "private"} aria-selected={vis === "private"} onClick={() => setVis("private")}><Icon name="lock" size={16} /> פרטי</button>
        <button role="radio" aria-checked={vis === "public"} aria-selected={vis === "public"} onClick={() => setVis("public")}><Icon name="globe" size={16} /> ציבורי</button>
      </div>

      <button className="btn primary wide" disabled={busy || (mode === "ai" && !prompt.trim())} onClick={make}>
        {busy ? "מרכיב פלייליסט…" : mode === "ai" ? "צור פלייליסט" : "צור"}
      </button>
    </Modal>
  );
}
