import { useState, useEffect } from "react";
import { SEARCH_BOOKS } from "../queries/queries";
import { apolloClient } from "../contexts/ApolloClient.tsx";

export type SearchBook = {
  id: string;
  title: string;
  author?: string;
  coverUrl?: string;
};

type BookSearchInputProps = {
  onBookSelect: (book: SearchBook | null) => void; // callback when a book is selected
  initialBook?: SearchBook | null;
};

export const BookSearchInput = ({ onBookSelect, initialBook = null }: BookSearchInputProps) => {
  const [query, setQuery] = useState(initialBook?.title || "");
  const [searchResults, setSearchResults] = useState<SearchBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<SearchBook | null>(initialBook);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setSelectedBook(initialBook);
    setQuery(initialBook?.title ?? "");
  }, [initialBook]);

  async function fetchBooks(query: string): Promise<SearchBook[]> {
    if (!query.trim()) return [];

    setIsSearching(true);
    try {
      const response = await apolloClient.query({
        query: SEARCH_BOOKS,
        variables: { query: query, perPage: 5, page: 1 },
        fetchPolicy: "no-cache",
      });

      const results = response?.data?.search?.results?.hits?.map((hit: any) => hit.document).filter(Boolean) as SearchBook[] || [];

      return results.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.contributions?.[0]?.author?.name || "Unknown",
        coverUrl: book.image?.url,
      }));
    } catch (err) {
      console.error("Error fetching books:", err);
      return [];
    } finally {
      setIsSearching(false);
    }
  }

  const handleChange = async (value: string) => {
    setQuery(value);
    setSelectedBook(null);
    onBookSelect(null);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    const results = await fetchBooks(value);
    setSearchResults(results);
  };

  const handleSelect = (book: SearchBook) => {
    setSelectedBook(book);
    setQuery(book.title);
    setSearchResults([]);
    onBookSelect(book);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Libro</label>
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Busca un libro..."
        className="w-full border rounded p-2 dark:bg-neutral-800 dark:text-white"
      />

      {isSearching && (
        <div className="text-sm opacity-70 mt-1">Buscando…</div>
      )}

      <div className="relative">
        {searchResults.length > 0 && (
            <ul className="border mt-1 max-h-48 overflow-y-auto bg-white dark:bg-neutral-900 rounded">
            {searchResults.map((book) => (
                <li
                key={book.id}
                className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700"
                onClick={() => handleSelect(book)}
                >
                {book.title} {book.author && `- ${book.author}`}
                </li>
            ))}
            </ul>
        )}
        {query.trim() && !isSearching && searchResults.length === 0 && (
                <div className="text-sm opacity-70 mt-1">No results.</div>
        )}
      </div>
    
    </div>
  );
};
