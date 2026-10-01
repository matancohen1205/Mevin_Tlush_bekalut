export function Waveform({ playing }: { playing: boolean }) {
  return (
    <span className="wave" data-playing={playing} aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  );
}
