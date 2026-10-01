import { useEffect, useState } from "react";
import { BottomNav, type Tab } from "./components/BottomNav";
import { FullPlayer } from "./components/FullPlayer";
import { Icon } from "./components/Icon";
import { MiniPlayer } from "./components/MiniPlayer";
import { Onboarding } from "./components/Onboarding";
import { Sheets } from "./components/Sheets";
import { Community } from "./pages/Community";
import { Home } from "./pages/Home";
import { Library } from "./pages/Library";
import { Notifications } from "./pages/Notifications";
import { Profile } from "./pages/Profile";
import { Search } from "./pages/Search";
import { UserProfile } from "./pages/UserProfile";
import { AuthScreen } from "./components/AuthScreen";
import { AuthProvider, useAuth } from "./state/auth";
import { LibraryProvider } from "./state/library";
import { PlayerProvider } from "./state/player";
import { PrefsProvider } from "./state/prefs";
import { SocialProvider, useSocial } from "./state/social";
import { UiProvider, useUi } from "./state/ui";
import { I18nProvider, tr, useLang } from "./i18n";

type Theme = "light" | "dark";

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("wavely.theme") as Theme | null;
      if (saved) return saved;
    } catch { /* ignore */ }
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0B1E33" : "#F4FAFF");
    try { localStorage.setItem("wavely.theme", theme); } catch { /* ignore */ }
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}

function Shell() {
  useLang();
  const [tab, setTab] = useState<Tab>("home");
  const [theme, toggleTheme] = useTheme();
  const { route, setRoute } = useUi();
  const { unread } = useSocial();
  const auth = useAuth();
  if (auth.enabled && auth.loading) return null;
  if (auth.enabled && !auth.userId && !auth.guest) return <AuthScreen />;
  const themeBtn = (
    <button className="icon-btn" onClick={toggleTheme} aria-label={theme === "dark" ? tr("מצב בהיר") : tr("מצב כהה")}>
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </button>
  );

  return (
    <div className="app">
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>{tr("דלג לתוכן")}</a>
      {route?.kind === "user" ? <UserProfile id={route.id} />
        : route?.kind === "notifs" ? <Notifications />
        : tab === "home" ? <Home themeBtn={themeBtn} />
        : tab === "search" ? <Search />
        : tab === "library" ? <Library />
        : tab === "community" ? <Community />
        : <Profile themeBtn={themeBtn} />}
      <MiniPlayer />
      <BottomNav tab={tab} badge={{ community: unread }} onChange={(t) => { setRoute(null); setTab(t); }} />
      <FullPlayer />
      <Sheets />
      <Onboarding />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
    <I18nProvider>
    <PrefsProvider>
      <UiProvider>
        <LibraryProvider>
          <SocialProvider>
            <PlayerProvider>
              <Shell />
            </PlayerProvider>
          </SocialProvider>
        </LibraryProvider>
      </UiProvider>
    </PrefsProvider>
    </I18nProvider>
    </AuthProvider>
  );
}
