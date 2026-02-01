import { mockPosts } from "../data/mockPosts";
import default_book_cover  from "../assets/default-book-cover.png";
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
      status: "want_to_read" | "reading" | "finished";
    }
  | {
      type: "review";
      content: string;
      userBookId: string;
      rating?: number; // review posts can have ratings
      // optional: we may or may not want to store status for review posts
      status?: "want_to_read" | "reading" | "finished";
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
        user_books (
            id,
            book_id,
            book_data
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
  const ub = row.user_books ?? null;
  const bd = ub?.book_data ?? null;

  return {
    id: row.id,
    author: {
      id: row.profiles.id,
      username: row.profiles.username,
      avatarUrl: row.profiles.avatar_url,
    },
    type: row.type,
    content: row.content,

    // For status posts, the status should come from posts table and not from user_books
    status: row.status ?? undefined,

    // Book is derived from cached snapshot in user_books.book_data
    book: bd
      ? {
          // keep your Post.book shape, but fill from snapshot
          // id should prefer book_data's id, fallback to user_books.book_id
          id: String(bd.id ?? ub?.book_id ?? ""),
          title: bd.title ?? null,
          author: bd.author ?? null,
          coverUrl: bd.coverUrl ?? null,
          slug: bd.slug ?? null,
          created_at: row.created_at,
        }
      : undefined,

    // Rating should come from user_books (not posts)
    rating: ub?.rating ?? undefined,

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
        status: type === "status" ? input.status : input.type === "review" ? input.status ?? null : null,
        rating: type === "review" ? input.rating : null,
        },
    ])
    .select(`
        *,
        profiles (
            id,
            username,
            avatar_url
        ),
        user_books (
            id,
            book_id,
            book_data
        )
    `)
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

