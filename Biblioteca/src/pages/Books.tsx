import type { BookData, BooksData } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { useQuery } from '@apollo/client/react';
import { GET_BOOKS } from '../queries/queries';
import { useState } from 'react';
import { BookCardSkeleton } from '../components/BookCardSkeleton';

const SKELETON_COUNT = 10; // number of book skeletons to show

export const Books: React.FC = () => {
    const navigate = useNavigate();

    const { data, loading, error } = useQuery<BooksData>(GET_BOOKS);

    const [minRating, setMinRating] = useState(0);

    if (error) {
        return (
            <div className="text-center py-12 text-red-500">
                Error al cargar libros.
            </div>
        );
    }

    const books: BookData[] = data?.books ?? [];

    // filtering the books after they are fetched based on minimum rating
    const filteredBooks = books.filter(
        (book) => (book.rating ?? 0) >= minRating
    );

    return (
        <div>
            <h1>Libros</h1>
            <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-neutral-600">Minimum rating:</span>

            {[0, 3, 4].map((value) => (
                <button
                key={value}
                onClick={() => setMinRating(value)}
                className={`text-sm px-3 py-1 rounded-full border ${
                    minRating === value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-neutral-300 text-neutral-600"
                }`}
                >
                {value === 0 ? "All" : `${value}+ ★`}
                </button>
            ))}
            </div>

            <div>
                {!loading && filteredBooks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-neutral-500">
                            No hay libros disponibles.
                        </p>
                    </div>
                ) : (
                    // Book Grid, here the fetched books are being mapped to grid items
                    // using the book slug, we map the books their detailed book view page to be viewed upon clicking.
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {loading
                        ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                            <BookCardSkeleton key={index} />
                        ))
                        : filteredBooks.map((book) => (
                            <BookCard
                                key={book.slug}
                                book={book}
                                onClick={() => navigate(`/books/${book.slug}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>

    )

}
