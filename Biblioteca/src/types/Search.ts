export type SearchType= "books" | "users";

export type BookResult = {
  id: number;
  title: string;
  author?: string | null;
  coverUrl?: string | null;
  slug?: string | null;
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
