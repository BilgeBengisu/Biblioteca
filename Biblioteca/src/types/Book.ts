export interface BooksData {
  books?: BookData[];
  books_trending?: {
    ids?: number[];
    error?: string | null;
  };
}

export interface BookData {
  id: string;
  slug: string;
  title: string;
  image?: {
    color?: string;
    url?: string;
  };
  contributions?: Array<{
    author?: {
      name?: string;
      bio?: string | null;
    };
  }>;
  rating?: number | null;
  description?: string;
}

export type BookSnapshot = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  slug?: string;
};

export type UserBookStatus = "want_to_read" | "reading" | "finished";

export type BookStatusSelectProps = {
  bookId: number | null;
  bookSnapshot: BookSnapshot | null;
  userId?: string;
};