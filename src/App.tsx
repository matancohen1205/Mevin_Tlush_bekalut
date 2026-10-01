import { useEffect, useState } from "react";
import { BottomNav, type Tab } from "./components/BottomNav";
import { FullPlayer } from "./components/FullPlayer";
import { Icon } from "./components/Icon";
import { MiniPlayer } from "./components/MiniPlayer";
import { he } from "./i18n/he";
import { Onboarding } from "./components/Onboarding";
import { Sheets } from "./components/Sheets";
import { Search } from "./pages/Search";
import { PrefsProvider } from "./state/prefs";
import { UiProvider } from "./state/ui";
import { Home } from "./pages/Home";
import { Library } from "./pages/Library";
import { Soon } from "./pages/Soon";
import { LibraryProvider } from "./state/library";
import { PlayerProvider } from "./state/player";

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

export function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [theme, toggleTheme] = useTheme();
  const themeBtn = (
    <button className="icon-btn" onClick={toggleTheme} aria-label={theme === "dark" ? "מצב בהיר" : "מצב כהה"}>
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </button>
  );

  return (
    <PrefsProvider><UiProvider><LibraryProvider>
      <PlayerProvider>
        <div className="app">
          {tab === "home" && <Home themeBtn={themeBtn} />}
          {tab === "search" && <Search />}
          {tab === "library" && <Library />}
          {(tab === "community" || tab === "profile") && <Soon title={he.nav[tab]} themeBtn={themeBtn} />}
          <MiniPlayer />
          <BottomNav tab={tab} onChange={setTab} />
          <FullPlayer />
          <Sheets />
          <Onboarding />
        </div>
      </PlayerProvider>
    </LibraryProvider></UiProvider></PrefsProvider>
  );
}
