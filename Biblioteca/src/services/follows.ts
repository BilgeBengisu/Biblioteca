import { supabase } from "../supabase-client";

// supabase manipulations for follow functionalities

export type FollowCounts = {
  followers: number;
  following: number;
};

export async function getFollowCounts(profileId: string): Promise<FollowCounts> {
  // followers = people who follow this user
  const { count: followersCount, error: followersError } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("followed_id", profileId);

  if (followersError) throw followersError;

  // following = people this user follows
  const { count: followingCount, error: followingError } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", profileId);

  if (followingError) throw followingError;

  return {
    followers: followersCount ?? 0,
    following: followingCount ?? 0,
  };
}

export async function isFollowing(viewerId: string, profileId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", viewerId)
    .eq("followed_id", profileId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function followUser(viewerId: string, profileId: string) {
  const { error } = await supabase.from("follows").insert({
    follower_id: viewerId,
    followed_id: profileId,
  });
  if (error) throw error;
}

export async function unfollowUser(viewerId: string, profileId: string) {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", viewerId)
    .eq("followed_id", profileId);

  if (error) throw error;
}
