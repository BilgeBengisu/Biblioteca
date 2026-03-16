export type ProfileRow = {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type UserBookStatus = "want_to_read" | "reading" | "finished";

// get rows from user_books table by user id
export type UserBookRow = {
  id: string;
  user_id: string;
  book_id: number;
  status: UserBookStatus;
  rating: number | null;
  started_at: string | null;
  finished_at: string | null;
  review_text: string | null;
  created_at: string;
  updated_at: string;
  book_data: any | null; // we can type this later
};

export type ReadingGoalRow = {
  id: number;
  user_id: string;
  year: number;
  target: number;
  created_at: string;
  updated_at: string | null;
};

export type ProfileTab = "library" | "posts";