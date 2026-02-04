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

// used by the posts and profile page (a userId is passed to display the posts by the profile that is being viewed)
export async function getPosts(
  options: { userId?: string; feed?: "all" | "following"; viewerId?: string } = {}
): Promise<Post[]> {
  const { userId, feed = "all", viewerId } = options;

  // joining posts table with profiles and books in the query
  let query = supabase
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

  // Profile page case: show posts by a specific user
  if (userId) {
    query = query.eq("user_id", userId);
  } else if (feed === "following") {
    // Posts page "Following" feed case (includes me)
    // viewerId is optional so existing calls don't break;
    // but following feed needs it to work.
    if (!viewerId) {
      // no viewer => can't compute following feed; return empty 
      return [];
    }

    // fetch ids I follow
    const { data: followsData, error: followsError } = await supabase
      .from("follows")
      .select("followed_id")
      .eq("follower_id", viewerId);

    if (followsError) {
      console.error(followsError);
      return [];
    }

    // include me in the feed
    const followingIds = Array.from(
      new Set([viewerId, ...(followsData?.map((r) => r.followed_id) ?? [])])
    );

    // filter posts
    query = query.in("user_id", followingIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  const posts = data.map(mapPost);

  if (posts.length === 0) return posts;

  // Keep your existing like enrichment logic as-is.
  // (Optional improvement below: pass viewerId to avoid calling auth.getUser.)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error(userError);
  }

  const postIds = posts.map((post) => post.id);

  const { data: likesData, error: likesError } = await supabase
    .from("post_likes")
    .select("post_id, user_id")
    .in("post_id", postIds);

  if (likesError) {
    console.error(likesError);
    return posts;
  }

  const likeCounts = new Map<string, number>();
  const likedByMe = new Set<string>();

  for (const like of likesData) {
    likeCounts.set(like.post_id, (likeCounts.get(like.post_id) ?? 0) + 1);
    if (user?.id && like.user_id === user.id) likedByMe.add(like.post_id);
  }

  return posts.map((post) => ({
    ...post,
    like_count: likeCounts.get(post.id) ?? 0,
    liked_by_me: user?.id ? likedByMe.has(post.id) : false,
  }));
}



// mapping database row to Post type
// this step is to convert the database to my UI objects
function mapPost(row: any): Post {
  const ub = row.user_books ?? null;
  const bd = ub?.book_data ?? null;

  return {
    id: row.id,
    type: row.type,
    content: row.content ?? null,
    created_at: row.created_at,

    // snapshot fields must come from posts to reflect the state at posting time
    rating: row.rating ?? null,
    status: row.status ?? null, // make sure your Post type includes status if you use it

    author: {
      id: row.profiles?.id ?? "",
      username: row.profiles?.username ?? "Usuario",
      avatarUrl: row.profiles?.avatar_url ?? null,
    },

    // book snapshot comes from user_books.book_data via posts.user_book_id
    userBook: ub
      ? {
          id: ub.id,
          bookId: ub.book_id,
          bookData: {
            title: bd?.title ?? "",
            author: bd?.author ?? null,
            coverUrl: bd?.coverUrl ?? null,
            slug: bd?.slug ?? null,
          },
        }
      : null,
  };
}

// this creates the post but also returns the full Post object with author and book data populated mapped for the UI
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

    // row to insert to posts table
    const rowToInsert = {
        type,
        user_id: user.id,
        content: content ?? null,
        user_book_id: type === "text" ? null : input.userBookId,
        status:
        type === "status"
            ? input.status
            : type === "review"
            ? (input.status ?? null) // in case status is missing for review, will be null if not provided (it is finished by default)
            : null,
        rating: type === "review" ? (input.rating ?? null) : null, // snapshot rating on post
    };

    // insert into the posts table
    const { data, error } = await supabase
    .from("posts")
    .insert([rowToInsert])
    .select(`
        id,
        type,
        content,
        status,
        rating,
        created_at,
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

// likes services
export async function likePost(postId: string, userId: string) {
  const { error } = await supabase
    .from("post_likes")
    .insert({ post_id: postId, user_id: userId });

  if (error) throw error;
}

export async function unlikePost(postId: string, userId: string) {
  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (error) throw error;
}
