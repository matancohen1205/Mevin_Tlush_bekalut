/** Chooses the initial theme (saved choice, else the OS setting), applies it to <html> and remembers changes. */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { readString, writeString } from "../../services/storage/localStore";
import { ThemeContext, type Theme } from "./ThemeContext";

const KEY = "wavely.theme";
const BROWSER_BAR_COLOR = { light: "#F4FAFF", dark: "#0B1E33" } as const;

/** Saved theme if valid, otherwise the operating system preference. */
function initialTheme(): Theme {
  const saved = readString(KEY);
  if (saved === "light" || saved === "dark") return saved;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Provides the theme to the tree. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BROWSER_BAR_COLOR[theme]);
    writeString(KEY, theme);
  }, [theme]);

  const api = useMemo(() => ({ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }), [theme]);
  return <ThemeContext.Provider value={api}>{children}</ThemeContext.Provider>;
}
