import { Link } from "react-router-dom";
import type { PostBook } from "../types/Post";

export const BookInlineCard = ({
  book,
  rightSlot,
  className = "", // to allow custom styling for different use cases
}: {
  book: PostBook;
  rightSlot?: React.ReactNode; // TODO: rating, status badge, etc.
  className?: string;
}) => {
  return (
    <Link
      to={book.slug ? `/books/${book.slug}` : "#"}
      className={`flex items-center gap-3 hover:opacity-80 ${className}`}
      onClick={(e) => {
        if (!book.slug) e.preventDefault();
      }}
    >
      {book.coverUrl ? (
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-20 h-28 object-cover rounded shadow-sm"
          loading="lazy"
        />
      ) : (
        <div className="w-20 h-28 rounded bg-neutral-100 dark:bg-neutral-800" />
      )}

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate">{book.title}</h3>

        {book.author ? (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">por {book.author}</p>
        ) : null}

        {rightSlot ? <div className="mt-2">{rightSlot}</div> : null}
      </div>
    </Link>
  );
};
