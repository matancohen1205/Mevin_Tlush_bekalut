/** Supabase authentication calls. Nothing here touches React. */
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

/** True when Supabase keys were provided at build time. */
export const isCloudEnabled = (): boolean => !!supabase;

/** Fetches the persisted session, if any. */
export async function fetchSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Subscribes to sign-in/out changes; returns the unsubscribe function. */
export function onSessionChange(callback: (session: Session | null) => void): () => void {
  if (!supabase) return () => undefined;
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

/** Email + password sign-in; returns the provider's error message or null. */
export async function signInWithPassword(email: string, password: string): Promise<string | null> {
  const { error } = await supabase!.auth.signInWithPassword({ email, password });
  return error?.message ?? null;
}

/** Creates an account; `needsConfirm` is true when a verification email was sent instead of a session. */
export async function signUpWithPassword(email: string, password: string, name: string): Promise<{ error: string | null; needsConfirm: boolean }> {
  const { data, error } = await supabase!.auth.signUp({ email, password, options: { data: { name } } });
  return { error: error?.message ?? null, needsConfirm: !error && !data.session };
}

/** Ends the session. */
export async function signOutRequest(): Promise<void> {
  await supabase?.auth.signOut();
}
