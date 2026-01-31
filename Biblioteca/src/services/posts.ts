import { mockPosts } from "../data/mockPosts";
import default_avatar  from "../assets/default-avatar.svg";
import { supabase } from "../supabase-client";
import type { Post } from "../types/Post";


// defining the input type for creating a post
// this is a union type since the required fields differ based on post type
// this secures type safety when using createPost()
type CreatePostInput =
  | {
      type: "text";
      content: string;
      userBookId?: null;
    }
  | {
      type: "status";
      content: string;
      userBookId: string;
    }
  | {
      type: "review";
      content: string;
      userBookId: string;
    };

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

export const createPost = async (
    input: CreatePostInput
    ): Promise<Post> => {
    const { type, content } = input; // "text" | "status" | "review"

    // Get the currently logged-in user
    // TODO: maybe this could be optimized by passing the user throughout the app once
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new Error("Not authenticated");

    // insert into the posts table
    const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        type,
        user_id: user.id,
        content,
        user_book_id: type === "text" ? null : input.userBookId,
      },
    ])
    .select(
      `
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
    `
    )
    .single();

    if (error) throw error;

    return mapPost(data);
};

export async function deletePost(postId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId); // users can only delete their own posts

  if (error) throw error;
}

