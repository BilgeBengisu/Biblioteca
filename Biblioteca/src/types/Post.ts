export type PostContentType = "book_update" | "review";
export type ReadingStatus = "started_reading" | "currently_reading" | "finished";

export interface PostAuthor {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface PostBook {
  id: number;
  title: string;
  author: string;
  coverUrl: string | null;
}

export interface Post {
  id: string;
  createdAt: string;

  author: PostAuthor;

  content: string | null; // review text or custom text
  contentType: PostContentType;

  status?: ReadingStatus;
  rating?: number;

  book?: PostBook;
}
