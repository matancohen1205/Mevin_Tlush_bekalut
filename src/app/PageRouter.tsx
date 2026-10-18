/** Chooses which page to show: a sub-page route (user profile, notifications) wins over the selected tab. */
import type { ReactElement } from "react";
import type { Tab } from "../components/layout/BottomNav";
import { Community } from "../pages/Community";
import { Home } from "../pages/Home";
import { Library } from "../pages/Library";
import { Notifications } from "../pages/Notifications";
import { Profile } from "../pages/Profile";
import { Search } from "../pages/Search";
import { UserProfile } from "../pages/UserProfile";
import { useUi } from "../state/ui";

const TAB_PAGES: Record<Tab, () => ReactElement> = {
  home: Home,
  search: Search,
  library: Library,
  community: Community,
  profile: Profile,
};

/** Renders the current page. */
export function PageRouter({ tab }: { tab: Tab }) {
  const { route } = useUi();
  if (route?.kind === "user") return <UserProfile id={route.id} />;
  if (route?.kind === "notifs") return <Notifications />;
  const Page = TAB_PAGES[tab];
  return <Page />;
}
