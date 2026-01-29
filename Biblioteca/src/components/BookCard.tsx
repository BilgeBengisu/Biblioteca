// BookCard component for Books page

import type { BookData } from "../types/Book";
import { StarRating } from "./StarRating";

type BookCardProps = {
  book: BookData;
  onClick?: () => void;
};

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const authorName =
    book.contributions?.[0]?.author?.name ?? "Autor desconocido";

  const rating = book.rating ? Math.round(book.rating) : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onClick?.();
        }
      }}
      className="cursor-pointer group focus:outline-none"
    >
      {/* Cover */}
      <div className="aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 shadow-md group-hover:shadow-xl transition-shadow">
        <img
          src={book.image?.url || "../public/default-book-cover.png"}
          alt={book.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-500 transition-colors">
        {book.title}
      </h3>

      {/* Author */}
      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1">
        {authorName}
      </p>

      {/* Rating */}
      <StarRating rating={book.rating ?? 0} />
    </div>
  );
};
