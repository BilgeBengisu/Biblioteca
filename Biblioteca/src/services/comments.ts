import { supabase } from "../supabase-client";
import type { Comment, CreateCommentInput, UpdateCommentInput } from "../types/Comment";

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

  return (data ?? []).map(mapComment);
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

  return mapComment(data);
}

export async function updateComment(input: UpdateCommentInput): Promise<Comment> {
  const { id, content, userId } = input;

  let query = supabase
    .from("comments")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query.select(commentSelect).single();

  if (error) throw error;

  return mapComment(data);
}

export async function deleteComment(commentId: string, userId?: string): Promise<void> {
  let query = supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (userId) query = query.eq("user_id", userId);

  const { error } = await query;

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
