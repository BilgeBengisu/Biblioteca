import type { Post } from "../types/Post";
import { mockPosts } from "../data/mockPosts";
import { supabase } from "../supabase-client";

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      created_at,
      content_type,
      action_type,
      rating,
      review_text,
      book_id,
      book_data,
      user_id,
      profiles (
        id,
        username,
        picture_url
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data.map(mapPostRow);
}


// mapping database row to Post type
// this step is to convert the database to my UI objects
function mapPostRow(row: any): Post {
  return {
    id: row.id,
    createdAt: row.created_at,

    author: {
      id: row.profiles.id,
      username: row.profiles.username,
      avatarUrl: row.profiles.picture_url,
    },

    contentType: row.content_type,
    content: row.review_text ?? null,

    rating: row.rating ?? undefined,
    status: row.action_type ?? undefined,

    book: row.book_data
      ? {
          id: row.book_id,
          title: row.book_data.title,
          author: row.book_data.author,
          coverUrl: row.book_data.cover_url ?? null,
        }
      : undefined,
  };
}
