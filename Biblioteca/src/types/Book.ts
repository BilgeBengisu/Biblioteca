export interface BooksData {
  books?: Book[];
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