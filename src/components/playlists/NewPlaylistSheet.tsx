/** "New playlist" dialog: smart create (from a sentence) or manual. */
import { useState } from "react";
import { tr, useLang } from "../../i18n";
import { useCreatePlaylist, type PlaylistForm } from "../../state/library";
import { Icon } from "../common/Icon";
import { Modal } from "../layout/Modal";
import { ManualCreateFields } from "./ManualCreateFields";
import { SmartCreateFields } from "./SmartCreateFields";
import { VisibilityToggle } from "./VisibilityToggle";

const EMPTY: PlaylistForm = { mode: "smart", title: "", description: "", visibility: "private", prompt: "" };

/** Form shell; the actual creation logic lives in useCreatePlaylist. */
export function NewPlaylistSheet() {
  useLang();
  const create = useCreatePlaylist();
  const [form, setForm] = useState<PlaylistForm>(EMPTY);
  const [busy, setBusy] = useState(false);
  /** Updates some form fields. */
  const set = (patch: Partial<PlaylistForm>) => setForm((f) => ({ ...f, ...patch }));
  const smart = form.mode === "smart";

  /** Submits the form; smart create can take a moment, so the button shows progress. */
  const submit = async () => { setBusy(true); await create(form); };

  return (
    <Modal title={tr("פלייליסט חדש")}>
      <div className="seg" role="tablist">
        <button role="tab" aria-selected={smart} onClick={() => set({ mode: "smart" })}><Icon name="sparkle" size={16} /> {tr("יצירה חכמה")}</button>
        <button role="tab" aria-selected={!smart} onClick={() => set({ mode: "manual" })}>{tr("ידני")}</button>
      </div>
      {smart
        ? <SmartCreateFields prompt={form.prompt} onChange={(prompt) => set({ prompt })} />
        : <ManualCreateFields title={form.title} description={form.description} onTitle={(title) => set({ title })} onDescription={(description) => set({ description })} />}
      <VisibilityToggle value={form.visibility} onChange={(visibility) => set({ visibility })} />
      <button className="btn primary wide" disabled={busy || (smart && !form.prompt.trim())} onClick={submit}>
        {busy ? tr("מרכיב פלייליסט…") : smart ? tr("צור פלייליסט") : tr("צור")}
      </button>
    </Modal>
  );
}
