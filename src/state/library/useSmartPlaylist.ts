/** "Smart create": builds a playlist from a sentence using the user's country and music source. */
import { useCallback } from "react";
import { generatePlaylist } from "../../services/music/generatePlaylist";
import { usePrefs } from "../prefs";

/** Returns an async function that turns a description into a playlist. */
export function useSmartPlaylist() {
  const { country, source } = usePrefs();
  return useCallback((prompt: string) => generatePlaylist(prompt, country, source), [country, source]);
}
