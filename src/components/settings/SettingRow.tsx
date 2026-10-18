/** Layout of one settings line: title and hint on one side, a control on the other. */
import type { ReactNode } from "react";

/** `as="label"` makes the whole row clickable (for switches). */
export function SettingRow({ title, hint, children, as: Tag = "div" }: { title: string; hint?: ReactNode; children?: ReactNode; as?: "div" | "label" }) {
  return (
    <Tag className="switch-row">
      <span><strong>{title}</strong>{hint !== undefined && <span className="muted">{hint}</span>}</span>
      {children}
    </Tag>
  );
}
