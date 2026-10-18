/** Home screen: banner, source switch, country chips, recommendations, moods and charts. */
import { useState } from "react";
import { ChartsSection } from "../components/home/ChartsSection";
import { CountryChips } from "../components/home/CountryChips";
import { ForYouSection } from "../components/home/ForYouSection";
import { HeroBanner } from "../components/home/HeroBanner";
import { MoodSection } from "../components/home/MoodSection";
import { SourceSwitch } from "../components/home/SourceSwitch";
import { Logo } from "../components/common/Logo";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { COUNTRIES } from "../services/music";
import { useCharts } from "../state/catalog";
import { usePrefs } from "../state/prefs";
import { tr, useLang } from "../i18n";

/** Page composition only; data comes from catalog hooks. */
export function Home() {
  useLang();
  const prefs = usePrefs();
  const [country, setCountry] = useState(prefs.country);
  const charts = useCharts(country, prefs.source);
  const countryName = COUNTRIES.find((c) => c.code === country)?.name ?? "";
  const heading = prefs.source === "audius" ? tr("פופולרי עכשיו ב-Audius") : tr("הכי מושמעים · {country}", { country: tr(countryName) });

  return (
    <main id="main" tabIndex={-1} className="page">
      <header className="topbar">
        <div className="logo" lang="en"><Logo /> Wavely</div>
        <ThemeToggle />
      </header>
      <HeroBanner tracks={charts?.tracks ?? []} />
      <SourceSwitch />
      {charts?.offline && <div className="banner" role="status">{tr("אין חיבור למקור המוזיקה – מוצגים שירי דמה שנוצרו במחשב.")}</div>}
      {prefs.source === "itunes" && <section className="section" aria-label={tr("מדינות")}><CountryChips value={country} onChange={setCountry} /></section>}
      <ForYouSection country={country} />
      <MoodSection country={country} />
      <ChartsSection tracks={charts?.tracks ?? null} heading={heading} />
    </main>
  );
}
