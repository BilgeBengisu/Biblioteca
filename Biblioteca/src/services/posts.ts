import type { Post } from "../types/Post";
import { mockPosts } from "../data/mockPosts";
import { supabase } from "../supabase-client";
import default_avatar  from "../assets/default-avatar.svg";

export async function getPosts(): Promise<Post[]> {
    // joining posts table with profiles and books in the query
    const { data, error } = await supabase
        .from("posts")
        .select(`
        *,
        profiles (
            id,
            username,
            avatar_url
        ),
        books (
            id,
            title,
            cover_url,
            slug,
            created_at
        )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }

    return data.map(mapPost);
}


// mapping database row to Post type
// this step is to convert the database to my UI objects
function mapPost(row: any): Post {
  return {
    id: row.id,
    author: {
      id: row.profiles.id,
      username: row.profiles.username,
      avatarUrl: row.profiles.avatar_url,
    },
    type: row.type,
    content: row.content,
    status: row.status ?? undefined,
    book: row.books
      ? {
          id: row.books.id,
          title: row.books.title,
          coverUrl: row.books.cover_url,
          slug: row.books.slug ?? undefined, // <- include slug here
          created_at: row.books.created_at,
        }
      : undefined,
    rating: row.rating ?? undefined,
    created_at: row.created_at,
  };
}
