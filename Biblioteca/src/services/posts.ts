import { mockPosts } from "../data/mockPosts";
import default_avatar  from "../assets/default-avatar.svg";
import { supabase } from "../supabase-client";
import type { Post } from "../types/Post";

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
            author,
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
          author: row.books.author,
          coverUrl: row.books.cover_url,
          slug: row.books.slug ?? undefined, // <- include slug here
          created_at: row.books.created_at,
        }
      : undefined,
    rating: row.rating ?? undefined,
    created_at: row.created_at,
  };
}

export const createPost = async ({
  type,
  content,
  bookId,
}: {
  type: "text" | "status" | "review";
  content?: string;
  bookId?: number | null;
}): Promise<Post> => {
  // Get the currently logged-in user
  // this could be optimized by passing the user throughout the app once
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        type,
        content: content || null,
        book_id: bookId || null,
        user_id: user.id,
      },
    ])
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
        author,
        cover_url,
        slug,
        created_at
      )
    `)
    .single();

  if (error) throw error;

  // Map the joined users object to "author" for PostCard
  // Map to Post type
  const newPost: Post = {
    id: data.id,
    author: {
      id: data.profiles.id,
      username: data.profiles.username,
      avatarUrl: data.profiles.avatar_url,
    },
    type: data.type,
    content: data.content,
    status: data.status ?? undefined,
    book: data.books
      ? {
          id: data.books.id,
          title: data.books.title,
          author: data.books.author,
          coverUrl: data.books.cover_url,
          slug: data.books.slug ?? undefined,
          created_at: data.books.created_at,
        }
    : undefined,
    rating: data.rating ?? undefined,
    created_at: data.created_at,
  };

  return newPost;
};

export async function deletePost(postId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId); // users can only delete their own posts

  if (error) throw error;
}

