/** Inline SVG icon from the shared icon set. */
import { ICON_PATHS, type IconName } from "./iconPaths";


interface Props {
  name: IconName;
  size?: number;
  fill?: boolean;
}

/** `fill` draws a solid icon (hearts, play/pause are always solid); `size` is in pixels. */
export function Icon({ name, size = 24, fill = false }: Props) {
  const solid = fill || name === "play" || name === "pause";
  return (
    <svg className={name === "back" ? "dir-flip" : undefined} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill={solid ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}
