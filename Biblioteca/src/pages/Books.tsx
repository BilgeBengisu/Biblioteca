import { useLocation, useNavigate } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { useState } from 'react';
import { BookCardSkeleton } from '../components/BookCardSkeleton';
import { useBookSort } from '../hooks/useBookSort';
import type { SortOption } from '../hooks/useBookSort';

const SKELETON_COUNT = 10;

export const Books = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [sortOrder, setSortOrder] = useState<SortOption>('tendencias');

    const { books, loading, error } = useBookSort(sortOrder);

    if (error) {
        console.error(error);
        return (
            <div className="text-center py-12 text-red-500">
                Error al cargar libros.
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-10 space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Explora Libros</h1>
            </div>
            <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-neutral-600">Ordenar:</span>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOption)}
                    className="text-sm px-3 py-1 rounded-full border border-neutral-300 text-neutral-600 bg-white focus:outline-none"
                >
                    <option value="tendencias">Tendencias</option>
                    <option value="aleatorio">Aleatorio</option>
                    <option value="popular">Popular</option>
                </select>
            </div>

            {loading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                        <BookCardSkeleton key={index} />
                    ))}
                </div>
            )}

            {!loading && books.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-neutral-500">No hay libros disponibles.</p>
                </div>
            )}

            {!loading && books.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {books.map((book) => (
                        <BookCard
                            key={book.slug}
                            book={book}
                            onClick={() =>
                                navigate(`/books/${book.slug}`, {
                                    state: {
                                        from: `${location.pathname}${location.search}`,
                                    },
                                })
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
