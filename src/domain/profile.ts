/** Pure validation rules for the profile form. */

/** Keeps only the characters allowed in a handle (letters, digits, dot, underscore). */
export const sanitizeHandle = (raw: string): string => raw.trim().replace(/[^a-zA-Z0-9._]/g, "");

/** A profile can be saved when it has a name and a non-empty handle. */
export const isProfileValid = (name: string, handle: string): boolean => name.trim().length > 0 && sanitizeHandle(handle).length > 0;
