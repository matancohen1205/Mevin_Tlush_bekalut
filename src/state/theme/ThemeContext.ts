/** Light/dark theme state. */
import { createContext, useContext } from "react";

export type Theme = "light" | "dark";

export interface ThemeApi {
  theme: Theme;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeApi | null>(null);

/** Access the theme from any component under ThemeProvider. */
export function useTheme(): ThemeApi {
  const api = useContext(ThemeContext);
  if (!api) throw new Error("useTheme outside ThemeProvider");
  return api;
}
