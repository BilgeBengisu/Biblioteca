// find or create user_book and return its UUID
// this is to be used when creating posts related to books
// this approach allows us to reduce api calls and keep user-book relationship consistent

import { supabase } from "../supabase-client";
import type { SearchBook } from "../components/BookSearchInput";

export type UserBookStatus = "want_to_read" | "reading" | "finished";

export async function upsertUserBook(params: {
  book: SearchBook;
  status: UserBookStatus;
  rating?: number | null;
}) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Not authenticated");

  const bookId = Number(params.book.id);
  if (!Number.isInteger(bookId)) throw new Error(`Book id must be an integer: ${params.book.id}`);

  const snapshot = {
    id: bookId,
    title: params.book.title,
    author: params.book.author ?? null,
    coverUrl: params.book.coverUrl ?? null,
    slug: params.book.slug ?? null,
  };

  const payload: any = {
    user_id: user.id,
    book_id: bookId,
    status: params.status,
    book_data: snapshot,
    updated_at: new Date().toISOString(),
  };

  // only write rating if provided (so status posts don’t overwrite rating)
  if (params.rating !== undefined) payload.rating = params.rating;

  const { data, error } = await supabase
    .from("user_books")
    .upsert(payload, { onConflict: "user_id,book_id" })
    .select("id, status, rating, book_data")
    .single();

  if (error) throw error;
  return data;
}

