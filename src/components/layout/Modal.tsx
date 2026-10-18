/** Bottom-sheet dialog frame: dim overlay, title, close button, focus trap and Escape-to-close. */
import type { ReactNode } from "react";
import { useDialog } from "../../hooks/useDialog";
import { tr, useLang } from "../../i18n";
import { useUi } from "../../state/ui";
import { Icon } from "../common/Icon";

/** Wraps dialog content; clicking the overlay or the close button dismisses it. */
export function Modal({ title, children }: { title: string; children: ReactNode }) {
  useLang();
  const { setSheet } = useUi();
  const ref = useDialog<HTMLDivElement>(() => setSheet(null));
  return (
    <div className="overlay" onClick={() => setSheet(null)}>
      <div ref={ref} tabIndex={-1} className="sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={() => setSheet(null)} aria-label={tr("סגור")}><Icon name="close" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
