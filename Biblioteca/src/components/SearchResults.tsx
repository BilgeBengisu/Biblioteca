import { useNavigate } from "react-router-dom";
import type { SearchState, BookResult, UserResult } from "../types/Search";
import type { BookData } from "../types/Book";
import { BookCard } from "./BookCard";
import { UserCard } from "./UserCard";

export function SearchResults({ state }: { state: SearchState }) {
  const navigate = useNavigate();

  // no need to search, no input yet
  if (state.status === "idle") {
    return null;
  }

  if (state.status === "loading") {
    return <p>Cargando…</p>;
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
                      navigate(`/books/${b.slug}`);
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
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {users.map((u) => {
        return (
          <li key={u.id}>
            <UserCard user={u} />
          </li>
        );
      })}
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
    rating: null,
  };
}
