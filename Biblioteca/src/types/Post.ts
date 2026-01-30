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
}

export type PostType = "text" | "status" | "review";

export interface Post {
  id: string;
  author: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  type: "text" | "status" | "review";
  content?: string;
  status?: "want_to_read" | "reading" | "finished";
  book?: {
    id: number;
    title: string;
    coverUrl?: string;
  };
  created_at: string;
}


