import type { BookData } from '../types/Book';
import {static_books} from '../data/getBooks';
import { useNavigate } from 'react-router-dom';

export const Books: React.FC = () => {
    const displayBooks: BookData[] = static_books.data.books || [];
    const navigate = useNavigate();

    return (
        <div>
            <h1>Libros</h1>

            <div>
                {displayBooks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-neutral-500">
                            No hay libros disponibles.
                        </p>
                    </div>
                ) : (
                    // Book Grid, here the fetched books are being mapped to grid items
                    // using the book slug, we map the books their detailed book view page to be viewed upon clicking.
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {displayBooks.map((book, index) => (
                                    <div
                                        key={`${book.title}-${index}`}
                                        className="cursor-pointer group"
                                        onClick={() => {
                                            if (book.slug) {
                                                navigate(`/books/${book.slug}`);
                                            }
                                        }}
                                    >
                                        <div className="aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 shadow-md group-hover:shadow-xl transition-shadow">
                                            <img 
                                                src={book.image?.url || "/default-book-cover.png"} 
                                                alt={book.title} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-500 transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1">
                                            {book.contributions?.[0]?.author?.name || "Autor desconocido"}
                                        </p>
                                        {book.rating && (
                                            <div className="text-xs text-yellow-500 mt-1">
                                                {'★'.repeat(Math.round(book.rating))}
                                                {'☆'.repeat(5 - Math.round(book.rating))}
                                                {book.rating.toFixed(1)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                    </div>
                )}

            </div>
        </div>

    )

}