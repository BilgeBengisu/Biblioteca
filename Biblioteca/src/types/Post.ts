export type PostContentType = "book_update" | "review";
export type ReadingStatus = "started_reading" | "currently_reading" | "finished";

export interface PostAuthor {
  id: string;
  username: string;
  avatarUrl: string | null;
}

// from DB
export interface PostRow {
  id: string;
  user_id: string;
  content: string;
  status: string | null;
  book_id: number | null;
  created_at: string;
}

export interface PostBook {
  id: number;
  title: string;
  author: string;
  coverUrl: string | null;
  slug?: string | null;
}

export type PostType = "text" | "status" | "review";

export type Post = {
  id: string;
  type: "text" | "status" | "review";
  content: string | null;
  created_at: string;

  rating?: number | null; // review snapshot for post - shouldn't come from user_books
  status?: "want_to_read" | "reading" | "finished" | null; // status snapshot for post - shouldn't come from user_books and reflect the status at posting time

  // book info (from user_books.book_data snapshot)
  userBook?: {
    id: string;
    bookId: number;
    bookData: {
      title: string;
      author: string | null;
      coverUrl: string | null;
      slug?: string | null;
    };
  } | null;

  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
}


