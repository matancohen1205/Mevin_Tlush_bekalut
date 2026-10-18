/** Dialog for editing the user's name, handle and bio. */
import { useState } from "react";
import { isProfileValid, sanitizeHandle } from "../../domain/profile";
import { tr, useLang } from "../../i18n";
import { useSocial } from "../../state/social";
import { useUi } from "../../state/ui";
import { Modal } from "../layout/Modal";

/** Profile form; validation rules come from domain/profile. */
export function EditProfileSheet() {
  useLang();
  const { me, updateMe } = useSocial();
  const { setSheet, showToast } = useUi();
  const [name, setName] = useState(me.name);
  const [handle, setHandle] = useState(me.handle);
  const [bio, setBio] = useState(me.bio);

  /** Saves the profile and closes the dialog. */
  const save = () => {
    updateMe({ name: name.trim(), handle: sanitizeHandle(handle), bio: bio.trim() });
    showToast("הפרופיל עודכן");
    setSheet(null);
  };

  return (
    <Modal title={tr("עריכת פרופיל")}>
      <label className="lbl" htmlFor="pn">{tr("שם")}</label>
      <input id="pn" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} />
      <label className="lbl" htmlFor="ph">{tr("שם משתמש (אותיות באנגלית, ספרות, נקודה וקו תחתון)")}</label>
      <input id="ph" className="input" dir="ltr" value={handle} onChange={(e) => setHandle(e.target.value)} maxLength={20} />
      <label className="lbl" htmlFor="pb">{tr("ביו")}</label>
      <textarea id="pb" className="input" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={140} />
      <button className="btn primary wide" disabled={!isProfileValid(name, handle)} onClick={save}>{tr("שמור")}</button>
    </Modal>
  );
}
