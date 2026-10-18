/** App layout: skip link, current page, players, navigation and global dialogs. */
import { useState } from "react";
import { SkipLink } from "../components/common/SkipLink";
import { BottomNav, type Tab } from "../components/layout/BottomNav";
import { SheetHost } from "../components/layout/SheetHost";
import { Onboarding } from "../components/onboarding/Onboarding";
import { FullPlayer } from "../components/player/FullPlayer";
import { MiniPlayer } from "../components/player/MiniPlayer";
import { useLang } from "../i18n";
import { useSocial } from "../state/social";
import { useUi } from "../state/ui";
import { PageRouter } from "./PageRouter";

/** Holds the selected tab; switching tabs closes any open sub-page. */
export function Shell() {
  useLang();
  const [tab, setTab] = useState<Tab>("home");
  const { setRoute } = useUi();
  const { unread } = useSocial();

  return (
    <div className="app">
      <SkipLink />
      <PageRouter tab={tab} />
      <MiniPlayer />
      <BottomNav tab={tab} badge={{ community: unread }} onChange={(t) => { setRoute(null); setTab(t); }} />
      <FullPlayer />
      <SheetHost />
      <Onboarding />
    </div>
  );
}
