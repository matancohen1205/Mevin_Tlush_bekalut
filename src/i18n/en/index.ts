/** Merges the per-area English dictionaries into one lookup table. */
import { account } from "./account";
import { catalog } from "./catalog";
import { common } from "./common";
import { community } from "./community";
import { discover } from "./discover";
import { player } from "./player";
import { playlists } from "./playlists";
import { seed } from "./seed";
import { settings } from "./settings";

export const en: Record<string, string> = {
  ...account,
  ...catalog,
  ...common,
  ...community,
  ...discover,
  ...player,
  ...playlists,
  ...seed,
  ...settings,
};
