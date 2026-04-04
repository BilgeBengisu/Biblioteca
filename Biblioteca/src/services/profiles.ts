// read profile service: getProfileById
// update profile service: updateProfileById

import { supabase } from "../supabase-client";
import type { ProfileRow, UserBookRow, ReadingGoalRow} from "../types/Profile";

export async function getProfileById(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .limit(1)
    .maybeSingle(); // in case profile does not exist

  if (error) {
    throw new Error(error.message);
  }

  return data as ProfileRow;
}

// to get username for profile routes
export async function getProfileByUsername(username: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as ProfileRow;
}

// get reading goal for a specific year
export async function getReadingGoal(userId: string, year: number): Promise<ReadingGoalRow | null> {
  const { data, error } = await supabase
    .from("reading_goals")
    .select("*")
    .eq("user_id", userId)
    .eq("year", year)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as ReadingGoalRow;
}

// create or update reading goal for a year
export async function upsertReadingGoal(
  userId: string,
  year: number,
  target: number
): Promise<ReadingGoalRow> {
  const { data, error } = await supabase
    .from("reading_goals")
    .upsert({ user_id: userId, year, target }, { onConflict: "user_id,year" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ReadingGoalRow;
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return !data;
}

export async function updateProfileById(
  userId: string,
  updates: {
    username?: ProfileRow["username"];
    bio?: ProfileRow["bio"];
    avatar_url?: ProfileRow["avatar_url"];
  }
): Promise<ProfileRow> {
  const updatePayload: {
    username?: ProfileRow["username"];
    bio?: ProfileRow["bio"];
    avatar_url?: ProfileRow["avatar_url"];
  } = {};

  if (updates.username !== undefined) updatePayload.username = updates.username;
  if (updates.bio !== undefined) updatePayload.bio = updates.bio;

  if (updates.avatar_url !== undefined) { // avatar is optional
    updatePayload.avatar_url = updates.avatar_url;
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...updatePayload }, { onConflict: "id" })
    .select("id, username, bio, avatar_url, created_at, updated_at")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getFinishedBooksCount(userId: string, year: number): Promise<number> {
  const start = `${year}-01-01`;
  const end = `${year + 1}-01-01`;

  const { count, error } = await supabase
    .from("user_books")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "finished")
    .gte("finished_at", start)
    .lt("finished_at", end);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getUserBooksByUserId(userId: string): Promise<UserBookRow[]> {
  const { data, error } = await supabase
    .from("user_books")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as UserBookRow[];
}
