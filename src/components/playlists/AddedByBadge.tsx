/** Small "added by …" label on tracks of a collaborative playlist. */
import { tr, useLang } from "../../i18n";
import { useSocial } from "../../state/social";

/** Renders nothing when nobody is recorded (the owner's own songs are not labelled). */
export function AddedByBadge({ userId }: { userId: string | undefined }) {
  useLang();
  const { profileOf } = useSocial();
  const person = userId && userId !== "me" ? profileOf(userId) : undefined;
  if (!person) return null;
  return <span className="added-by">{tr("נוסף על ידי {name}", { name: tr(person.name) })}</span>;
}
