/** Button that switches between the light and dark theme. */
import { tr, useLang } from "../../i18n";
import { useTheme } from "../../state/theme";
import { Icon } from "./Icon";

/** Sun/moon toggle. */
export function ThemeToggle() {
  useLang();
  const { theme, toggle } = useTheme();
  return (
    <button className="icon-btn" onClick={toggle} aria-label={theme === "dark" ? tr("מצב בהיר") : tr("מצב כהה")}>
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </button>
  );
}
