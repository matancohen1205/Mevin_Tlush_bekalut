/** "For you": recommendations from the genres picked during onboarding. */
import { useRecommended } from "../../state/catalog";
import { usePrefs } from "../../state/prefs";
import { tr, useLang } from "../../i18n";
import { TrackCarousel } from "./TrackCarousel";

/** Hidden when the user picked no genres. */
export function ForYouSection({ country }: { country: string }) {
  useLang();
  const { genres, source } = usePrefs();
  const result = useRecommended(genres, country, source);
  if (!genres.length) return null;
  return (
    <section className="section">
      <div className="section-head"><h2>{tr("בשבילך")}</h2></div>
      <TrackCarousel tracks={result?.tracks ?? null} />
    </section>
  );
}
