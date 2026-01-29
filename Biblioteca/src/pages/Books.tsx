import type { BookData } from '../types/Book';
import {static_books} from '../data/getBooks';
import { useNavigate } from 'react-router-dom';
import { BookCard } from '../components/BookCard';

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
                        {displayBooks.map((book) => (
                            <BookCard
                            key={book.slug}
                            book={book}
                            onClick={() => {
                                if (book.slug) {
                                navigate(`/books/${book.slug}`);
                                }
                            }}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>

    )

}