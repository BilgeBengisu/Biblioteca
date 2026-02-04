// provides services for the Search page for book and user lookup
import { supabase } from "../supabase-client";
import { apolloClient } from "../contexts/ApolloClient";
import { SEARCH_BOOKS } from "../queries/queries";
import type { BookResult, UserResult } from "../types/Search";

export async function searchBooks(query: string, signal?: AbortSignal): Promise<BookResult[]> {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  if (!query.trim()) return [];

  const response = await apolloClient.query({
    query: SEARCH_BOOKS,
    variables: { query: query.trim(), perPage: 20, page: 1 },
    fetchPolicy: "no-cache",
  });

  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  const hits =
    response?.data?.search?.results?.hits
      ?.map((hit: any) => hit.document)
      .filter(Boolean) ?? [];

  return hits.map((book: any) => ({
    id: Number(book.id),
    title: book.title,
    author: book.contributions?.[0]?.author?.name ?? null,
    coverUrl: book.image?.url ?? null,
    slug: book.slug ?? null,
  }));
}


export async function searchUsers(query: string, signal?: AbortSignal): Promise<UserResult[]> {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .ilike("username", `%${query}%`)
    .limit(20);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    username: row.username,
    avatarUrl: row.avatar_url,
  }));
}
