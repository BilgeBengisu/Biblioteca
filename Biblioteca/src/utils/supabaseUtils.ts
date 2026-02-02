import { supabase } from "../supabase-client";

export function toAbsoluteSupabaseUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, "");
  return `${base}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
