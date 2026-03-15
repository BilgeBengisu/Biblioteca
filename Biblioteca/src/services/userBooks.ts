// find or create user_book and return its UUID
// this is to be used when creating posts related to books
// this approach allows us to reduce api calls and keep user-book relationship consistent

import { supabase } from "../supabase-client";
import type { SearchBook } from "../components/BookSearchInput";
import type { UserBookStatus } from "../types/Book";

export async function getUserBookByBookId(params: {
  bookId: number;
  userId?: string;
}) {
  let userId = params.userId;

  if (!userId) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    userId = user?.id ?? undefined;
  }

  if (!userId) return null;

  const { data, error } = await supabase
    .from("user_books")
    .select("id, status, rating, book_data")
    .eq("user_id", userId)
    .eq("book_id", params.bookId)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function deleteUserBookByBookId(params: {
  bookId: number;
  userId?: string;
}) {
  let userId = params.userId;

  if (!userId) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    userId = user?.id ?? undefined;
  }

  if (!userId) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("user_books")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", params.bookId);

  if (error) throw error;
}

export async function upsertUserBook(params: {
  book: SearchBook;
  status?: UserBookStatus | null;
  rating?: number | null;
}) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Not authenticated");

  const bookId = Number(params.book.id);
  if (!Number.isInteger(bookId)) throw new Error(`Book id must be an integer: ${params.book.id}`);

  // this is to store a book snapshot for books that the app displays often (such as on posts page)
  // so we don't have to query the books api every time
  const snapshot = {
    id: bookId,
    title: params.book.title,
    author: params.book.author ?? null,
    coverUrl: params.book.coverUrl ?? null,
    slug: params.book.slug ?? null,
  };

  // fields that are always updated
  const payload: Record<string, any> = {
    user_id: user.id,
    book_id: bookId,
    book_data: snapshot,
    updated_at: new Date().toISOString(),
  };

  // fields that are conditionally updated and shouldn't overwrite existing data otherwise
  if (params.status !== undefined) {
    payload.status = params.status;
    if (params.status === "reading") {
      payload.started_at = new Date().toISOString();
      payload.finished_at = null;
    } else if (params.status === "finished") {
      payload.finished_at = new Date().toISOString();
    } else if (params.status === "want_to_read") {
      payload.started_at = null;
      payload.finished_at = null;
    }
  }
  if (params.rating !== undefined) payload.rating = params.rating;

  const { data, error } = await supabase
    .from("user_books")
    .upsert(payload, { onConflict: "user_id,book_id" })
    .select("id, status, rating, book_data")
    .single();

  if (error) throw error;
  return data;
}
