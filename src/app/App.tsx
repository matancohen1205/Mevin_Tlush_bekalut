/** Application root: providers, then the auth gate, then the shell. */
import { AppProviders } from "./AppProviders";
import { AuthGate } from "./AuthGate";
import { Shell } from "./Shell";

/** The whole app. */
export function App() {
  return (
    <AppProviders>
      <AuthGate>
        <Shell />
      </AuthGate>
    </AppProviders>
  );
}
