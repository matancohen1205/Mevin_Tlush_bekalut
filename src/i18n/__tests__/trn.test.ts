import { afterAll, describe, expect, it } from "vitest";
import { setCurrentLanguage, tr, trn } from "../translate";

afterAll(() => setCurrentLanguage("en"));

describe("count-aware translation", () => {
  it("uses singular and plural in English", () => {
    setCurrentLanguage("en");
    expect(trn("{n} שירים", 1)).toBe("1 song");
    expect(trn("{n} שירים", 3)).toBe("3 songs");
    expect(trn("{n} משתפי פעולה", 1)).toBe("1 collaborator");
  });
  it("uses the Hebrew singular for one and the numbered form otherwise", () => {
    setCurrentLanguage("he");
    expect(trn("{n} שירים", 1)).toBe("שיר אחד");
    expect(trn("{n} שירים", 4)).toBe("4 שירים");
  });
  it("fills placeholders and falls back to the Hebrew key when untranslated", () => {
    setCurrentLanguage("en");
    expect(tr("נוסף ל״{title}״", { title: "X" })).toBe("Added to “X”");
    expect(tr("טקסט שלא מתורגם")).toBe("טקסט שלא מתורגם");
  });
});
