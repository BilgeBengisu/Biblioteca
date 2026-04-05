import { supabase } from "../supabase-client";
import type { Comment, CreateCommentInput } from "../types/Comment";

const commentSelect = `
  id,
  post_id,
  user_id,
  content,
  parent_id,
  created_at,
  updated_at,
  profiles (
    id,
    username,
    avatar_url
  )
`;

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select(commentSelect)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  const comments = (data ?? []).map(mapComment);
  if (comments.length === 0) return comments;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) console.error(userError);

  const commentIds = comments.map((c) => c.id);

  const [{ data: allLikesData, error: likesError }, { data: myLikesData, error: myLikesError }] =
    await Promise.all([
      supabase.from("comment_likes").select("comment_id").in("comment_id", commentIds),
      user?.id
        ? supabase.from("comment_likes").select("comment_id").in("comment_id", commentIds).eq("user_id", user.id)
        : Promise.resolve({ data: [] as { comment_id: string }[], error: null }),
    ]);

  if (likesError) { console.error(likesError); return comments; }
  if (myLikesError) console.error(myLikesError);

  const likeCounts = new Map<string, number>();
  for (const { comment_id } of allLikesData ?? []) {
    likeCounts.set(comment_id, (likeCounts.get(comment_id) ?? 0) + 1);
  }

  const likedByMe = new Set((myLikesData ?? []).map((r) => r.comment_id));

  return comments.map((comment) => ({
    ...comment,
    like_count: likeCounts.get(comment.id) ?? 0,
    liked_by_me: likedByMe.has(comment.id),
  }));
}

export async function getCommentCountByPostId(postId: string): Promise<number> {
  const { count, error } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;
}

export async function createComment(input: CreateCommentInput): Promise<Comment> {
  const { postId, content, parentId = null } = input;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Not authenticated");

  const rowToInsert = {
    post_id: postId,
    user_id: user.id,
    content,
    parent_id: parentId,
  };

  const { data, error } = await supabase
    .from("comments")
    .insert([rowToInsert])
    .select(commentSelect)
    .single();

  if (error) throw error;

  return {
    ...mapComment(data),
    like_count: 0,
    liked_by_me: false,
  };
}

export async function deleteComment(commentId: string, userId?: string): Promise<string[]> {
  // Collect all descendant IDs via BFS so we can delete them before the root,
  // avoiding orphaned rows if the DB has no ON DELETE CASCADE on parent_id.
  const descendantIds: string[] = [];
  let currentLevel = [commentId];

  while (currentLevel.length > 0) {
    const { data } = await supabase
      .from("comments")
      .select("id")
      .in("parent_id", currentLevel);
    if (!data || data.length === 0) break;
    const nextLevel = (data as { id: string }[]).map((r) => r.id);
    descendantIds.push(...nextLevel);
    currentLevel = nextLevel;
  }

  if (descendantIds.length > 0) {
    const { error: descError } = await supabase
      .from("comments")
      .delete()
      .in("id", descendantIds);
    if (descError) throw descError;
  }

  let query = supabase.from("comments").delete().eq("id", commentId);
  if (userId) query = query.eq("user_id", userId);
  const { error } = await query;
  if (error) throw error;

  return [...descendantIds, commentId];
}

export async function likeComment(commentId: string, userId: string) {
  const { error } = await supabase
    .from("comment_likes")
    .insert({ comment_id: commentId, user_id: userId });

  if (error) throw error;
}

export async function unlikeComment(commentId: string, userId: string) {
  const { error } = await supabase
    .from("comment_likes")
    .delete()
    .eq("comment_id", commentId)
    .eq("user_id", userId);

  if (error) throw error;
}

// mapping functions
function mapComment(row: any): Comment {
  return {
    id: row.id,
    post_id: row.post_id,
    user_id: row.user_id,
    content: row.content ?? "",
    parent_id: row.parent_id ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: row.profiles
      ? {
          id: row.profiles.id ?? "",
          username: row.profiles.username ?? "Usuario",
          avatarUrl: row.profiles.avatar_url ?? null,
        }
      : undefined,
  };
}
