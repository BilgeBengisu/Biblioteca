export type SearchType= "books" | "users";

// Shape of a single book document returned by the Hardcover search API
export type HardcoverBookDocument = {
  id: string;
  title: string;
  slug?: string | null;
  rating?: number | null;
  image?: { url?: string | null; color?: string | null } | null;
  contributions?: Array<{
    author?: { name?: string | null; bio?: string | null } | null;
  } | null> | null;
};

export type SearchBooksVariables = {
  query: string;
  perPage?: number;
  page?: number;
};

export type SearchResponse<TDocument = unknown> = {
  search?: {
    results?: {
      hits?: Array<{ document?: TDocument | null } | null> | null;
    } | null;
  } | null;
};

export type BookResult = {
  id: number;
  title: string;
  author?: string | null;
  coverUrl?: string | null;
  slug?: string | null;
  rating?: number | null;
};

export type UserResult = {
  id: string;
  username: string | null;
  avatarUrl: string | null;
};

export type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; scope: SearchType; items: BookResult[] | UserResult[] };
