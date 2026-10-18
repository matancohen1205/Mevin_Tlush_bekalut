/** Provider nesting order for the whole app (outermost first). Each provider only depends on the ones above it. */
import type { ReactNode } from "react";
import { I18nProvider } from "../i18n";
import { AuthProvider } from "../state/auth";
import { LibraryProvider } from "../state/library";
import { PlayerProvider } from "../state/player";
import { PrefsProvider } from "../state/prefs";
import { SocialProvider } from "../state/social";
import { ThemeProvider } from "../state/theme";
import { UiProvider } from "../state/ui";

/** Wraps the app in every context it needs. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <I18nProvider>
        <ThemeProvider>
          <PrefsProvider>
            <UiProvider>
              <LibraryProvider>
                <SocialProvider>
                  <PlayerProvider>{children}</PlayerProvider>
                </SocialProvider>
              </LibraryProvider>
            </UiProvider>
          </PrefsProvider>
        </ThemeProvider>
      </I18nProvider>
    </AuthProvider>
  );
}
