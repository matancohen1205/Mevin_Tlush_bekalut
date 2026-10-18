/** Top banner of the home page with the "play hits" button. */
import { usePlayer } from "../../state/player";
import type { Track } from "../../types";
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";

/** Welcome banner; the button plays the given charts from the top. */
export function HeroBanner({ tracks }: { tracks: Track[] }) {
  useLang();
  const { play } = usePlayer();
  return (
    <section className="hero section" aria-labelledby="hero-t">
      <h1 id="hero-t">{tr("המוזיקה של העולם, במקום אחד")}</h1>
      <p>{tr("גלו להיטים מכל מדינה, שמרו אהובים ובנו פלייליסטים.")}</p>
      <button className="btn" disabled={!tracks.length} onClick={() => play(tracks[0], tracks)}>
        <Icon name="play" size={18} /> {tr("נגן להיטים")}
      </button>
    </section>
  );
}
