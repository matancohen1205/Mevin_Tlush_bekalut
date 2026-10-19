/**
 * Translation core. Hebrew is the source language: the Hebrew text itself is the key,
 * and en/ maps it to English. A missing translation falls back to the Hebrew text,
 * so a gap never breaks the UI. `{name}` placeholders are filled from the second argument.
 */
import { readString, writeString } from "../services/storage/localStore";
import { en } from "./en";

export type Lang = "he" | "en";
const STORAGE_KEY = "wavely.lang";

/** Saved language, else Hebrew for Hebrew browsers and English for everyone else. */
export function detectLanguage(): Lang {
  const saved = readString(STORAGE_KEY);
  if (saved === "he" || saved === "en") return saved;
  return navigator.language?.toLowerCase().startsWith("he") ? "he" : "en";
}

let current: Lang = detectLanguage();

/** Sets the language used by `tr` and remembers it. */
export function setCurrentLanguage(lang: Lang): void {
  current = lang;
  writeString(STORAGE_KEY, lang);
}

/** The language `tr` currently translates to. */
export const currentLanguage = (): Lang => current;

/** Translates a Hebrew source text (usable outside React). */
export function tr(key: string, vars?: Record<string, string | number>): string {
  let text = current === "en" ? en[key] ?? key : key;
  if (vars) text = text.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
  return text;
}

/** Hebrew singular forms for count-based texts ("{n} שירים" → "שיר אחד"). */
const HEBREW_ONE: Record<string, string> = {
  "{n} שירים": "שיר אחד",
  "{n} משתפי פעולה": "משתף/ת פעולה אחד/ת",
};

/** Count-aware translation: uses the singular form for n = 1 (English: the `key|one` entry), else the normal text with {n}. */
export function trn(key: string, n: number): string {
  if (n === 1) {
    if (current === "he") return HEBREW_ONE[key] ?? tr(key, { n });
    const one = en[`${key}|one`];
    if (one) return one;
  }
  return tr(key, { n });
}

/** BCP-47 locale for number/date formatting in the current language. */
export const locale = (): string => (current === "he" ? "he-IL" : "en-US");
