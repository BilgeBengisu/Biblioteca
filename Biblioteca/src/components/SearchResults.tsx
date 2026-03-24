import { useLocation, useNavigate } from "react-router-dom";
import type { SearchState, SearchType, BookResult, UserResult } from "../types/Search";
import type { BookData } from "../types/Book";
import { BookCard } from "./BookCard";
import { BookCardSkeleton } from "./BookCardSkeleton";
import { UserCard } from "./UserCard";

export function SearchResults({ state, scope }: { state: SearchState; scope: SearchType }) {
  const navigate = useNavigate();
  const location = useLocation();

  // no need to search, no input yet
  if (state.status === "idle") {
    return null;
  }

  if (state.status === "loading") {
    if (scope !== "books") return;
    return (
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i}><BookCardSkeleton /></li>
        ))}
      </ul>
    );
  }

  if (state.status === "error") {
    return <p style={{ color: "crimson" }}>{state.message}</p>;
  }

  // success
  if (state.scope === "books") {
    const items = state.items as BookResult[];
    if (items.length === 0) return <p>No hay resultados.</p>;

    return (
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map((b) => (
          <li key={b.id}>
            <BookCard
              book={mapSearchBookToCard(b)}
              onClick={
                b.slug
                  ? () => {
                      navigate(`/books/${b.slug}`, {
                        state: {
                          from: `${location.pathname}${location.search}`,
                        },
                      });
                    }
                  : undefined
              }
            />
          </li>
        ))}
      </ul>
    );
  }

  // users
  const users = state.items as UserResult[];
  if (users.length === 0) return <p>No hay resultados.</p>;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {users.map((u) => (
        <li key={u.id}>
          <UserCard user={u} />
        </li>
      ))}
    </ul>
  );
}

function mapSearchBookToCard(book: BookResult): BookData {
  return {
    id: String(book.id),
    slug: book.slug ?? String(book.id),
    title: book.title,
    image: book.coverUrl ? { url: book.coverUrl } : undefined,
    contributions: book.author
      ? [{ author: { name: book.author } }]
      : undefined,
    rating: book.rating ?? null,
  };
}
