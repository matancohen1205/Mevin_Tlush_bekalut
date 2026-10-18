/** Community screen: feed tabs, follow suggestions and posts. */
import { useState } from "react";
import { Icon } from "../components/common/Icon";
import { FeedList } from "../components/social/FeedList";
import { NotificationBell } from "../components/social/NotificationBell";
import { PeopleSuggestions } from "../components/social/PeopleSuggestions";
import type { FeedTab } from "../domain/social";
import { useFeed } from "../state/social";
import { useUi } from "../state/ui";
import { tr, useLang } from "../i18n";

/** Page composition only; feed selection comes from useFeed. */
export function Community() {
  useLang();
  const { setSheet } = useUi();
  const [tab, setTab] = useState<FeedTab>("following");
  const { posts, suggestions } = useFeed(tab);

  return (
    <main id="main" tabIndex={-1} className="page">
      <div className="topbar">
        <h1 className="page-title">{tr("קהילה")}</h1>
        <div className="topbar-actions">
          <NotificationBell />
          <button className="btn primary" onClick={() => setSheet({ kind: "compose" })}><Icon name="plus" size={18} /> {tr("שתף")}</button>
        </div>
      </div>
      <div className="seg" role="tablist" style={{ marginTop: 16 }}>
        <button role="tab" aria-selected={tab === "following"} onClick={() => setTab("following")}>{tr("עוקבים")}</button>
        <button role="tab" aria-selected={tab === "discover"} onClick={() => setTab("discover")}>{tr("גלו")}</button>
      </div>
      {tab === "following" && <PeopleSuggestions people={suggestions} />}
      <section className="section"><FeedList posts={posts} /></section>
    </main>
  );
}
