import { useState, useEffect } from "react";
import { SEARCH_BOOKS } from "../queries/queries";
import { apolloClient } from "../contexts/ApolloClient.tsx";

export type SearchBook = {
  id: string;
  title: string;
  author?: string;
  coverUrl?: string;
  slug?: string;
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
  const [hasSearched, setHasSearched] = useState(false);

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
        slug: book.slug, 
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
  };

  useEffect(() => {
    if (!query.trim()) {
        setSearchResults([]);
        setHasSearched(false);
        return;
    }

    // if user selected a book and the input matches it, don't search again
    if (selectedBook && query.trim() === selectedBook.title.trim()) {
        setSearchResults([]);
        setHasSearched(false);
        return;
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(async () => {
        setHasSearched(true);
        const results = await fetchBooks(query);
        if (!cancelled) setSearchResults(results);
    }, 300);

    return () => {
        cancelled = true;
        window.clearTimeout(timeoutId);
    };
  }, [query]);


  const handleSelect = (book: SearchBook) => {
    setSelectedBook(book);
    setQuery(book.title);
    setSearchResults([]);
    setHasSearched(false);
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
            <ul className="absolute z-10 w-full border mt-1 max-h-48 overflow-y-auto bg-white dark:bg-neutral-900 rounded">
            {searchResults.map((book) => (
                <li
                    key={book.id}
                    className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700 flex items-center gap-3"
                    onClick={() => handleSelect(book)}
                    >
                    <img
                        src={book.coverUrl || "/default-book-cover.png"}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded"
                        loading="lazy"
                    />

                    <div className="min-w-0">
                        <div className="font-medium truncate">{book.title}</div>
                        {book.author && (
                        <div className="text-sm opacity-70 truncate">{book.author}</div>
                        )}
                    </div>
                </li>
            ))}
            </ul>
        )}
        {hasSearched && query.trim() && !isSearching && searchResults.length === 0 && !selectedBook && (
                <div className="text-sm opacity-70 mt-1">No resultados.</div>
        )}
      </div>
    
    </div>
  );
};
