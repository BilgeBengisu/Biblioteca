import { useState } from "react";
import type { Post } from "../types/Post";
import { createPost } from "../services/posts";
import { BookSearchInput, type SearchBook } from "./BookSearchInput";
import { upsertUserBook } from "../services/userBooks";
import { Pencil, BookMarked, Star, BookOpen, Bookmark, CheckCheck } from "lucide-react";

type NewPostFormProps = {
  onPostCreated: (post: Post) => void; // callback to add the new post to feed
};

// post reference uses a user-book relationship
export const NewPostForm = ({ onPostCreated }: NewPostFormProps) => {
  const [type, setType] = useState<"text" | "status" | "review">("text");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBook, setSelectedBook] = useState<SearchBook | null>(null);
  const [status, setStatus] = useState<"want_to_read" | "reading" | "finished">("reading");
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);

  const trimmed = content.trim();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // text posts must have content
    if (type === "text" && !trimmed) {
      setError("Escribe algo para publicar.");
      return;
    }

    // status/review must have book association
    if ((type === "status" || type === "review") && !selectedBook) {
      setError("Selecciona un libro.");
      return;
    }

    // status is required for status posts
    if (type === "status" && !status) {
      setError("Selecciona un estado.");
      return;
    }

    // rating or text content is required for review posts
    if (type === "review" && !trimmed && rating <= 0) {
      setError("Escribe una reseña o asigna una calificación.");
      return;
    }

    setIsSubmitting(true);
    // upserting user-book relationship if needed
    try {
      let userBookIdForPost: string | null = null;

      // ensure userBookId is set for status/review posts
      if (type === "status" && selectedBook) {
        const userBook = await upsertUserBook({ book: selectedBook, status });
        userBookIdForPost = userBook.id;
      }

      if (type === "review" && selectedBook) {
        const userBook = await upsertUserBook({
          book: selectedBook,
          status: "finished",                // reviews imply finished
          rating: rating > 0 ? rating : null // current rating snapshot
        });
        userBookIdForPost = userBook.id;
      }

      if ((type === "status" || type === "review") && !userBookIdForPost) {
        setError("No se pudo asociar el libro. Intenta de nuevo.");
        return;
      }

      const newPost = await createPost({
        type,
        content: type === "text" ? trimmed : (trimmed || ""),
        userBookId: type === "text" ? null : userBookIdForPost!,
        ...(type === "status" ? { status } : {}),
        ...(type === "review" ? { rating: rating > 0 ? rating : null } : {}), // keep rating on post database too as a snapshot
      } as any);

      onPostCreated(newPost); // callback to add post to feed only after successful creation

      // reset
      setContent("");
      setSelectedBook(null);
      setRating(0);
      setType("text");
    } catch (err) {
      console.error("Error creating post:", err);
      setError("No se pudo publicar. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const isValid =
      (type === "text" && trimmed.length > 0) ||
      (type === "status" && !!selectedBook) ||
      (type === "review" && !!selectedBook && (trimmed.length > 0 || rating > 0));

  const postTypes = [
    { label: "Escribir algo", value: "text", icon: <Pencil size={14} /> },
    { label: "Estado", value: "status", icon: <BookMarked size={14} /> },
    { label: "Reseña", value: "review", icon: <Star size={14} /> },
  ];

  const statusOptions = [
    { label: "Quiero leer", value: "want_to_read", icon: <Bookmark size={13} /> },
    { label: "Leyendo", value: "reading", icon: <BookOpen size={13} /> },
    { label: "Terminado", value: "finished", icon: <CheckCheck size={13} /> },
  ];

  return (
    <form
      className="bg-white border border-neutral-200 p-4 rounded-2xl shadow-sm space-y-3"
      onSubmit={handleSubmit}
    >
      {/* Post type selector */}
      <div className="flex gap-1.5">
        {postTypes.map(({ label, value, icon }) => (
          <button
            key={value}
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
              type === value
                ? "bg-red-600 text-white"
                : "text-neutral-500 hover:bg-red-50 hover:text-red-600"
            }`}
            onClick={() => {
              setError(null);
              setType(value as "text" | "status" | "review");
              if (value === "text") { setSelectedBook(null); setRating(0); }
              if (value === "status") { setRating(0); }
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Book selector for status/review */}
      {(type === "status" || type === "review") && (
        <BookSearchInput value={selectedBook} onChange={setSelectedBook} />
      )}

      {/* Status selector for status update posts */}
      {type === "status" && (
        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map(({ label, value: sVal, icon }) => (
            <button
              key={sVal}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
                status === sVal
                  ? "bg-red-600 text-white"
                  : "text-neutral-500 hover:bg-red-50 hover:text-red-600"
              }`}
              onClick={() => setStatus(sVal as typeof status)}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Rating selector for review posts */}
      {type === "review" && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-500 pl-3">Calificación</span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} estrellas`}
                className={`text-xl leading-none px-0.5 transition-colors duration-100 ${
                  rating >= n ? "text-yellow-300" : "text-neutral-300"
                }`}
                onClick={() => setRating(n)}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <button
              type="button"
              className="text-xs text-neutral-400 hover:text-red-600 underline transition-colors"
              onClick={() => setRating(0)}
            >
              borrar
            </button>
          )}
        </div>
      )}

      {/* Content textarea */}
      <textarea
        className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none transition"
        placeholder="¿Qué te gustaría compartir?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={type === "text" ? 3 : 2}
      />

      {/* Submit */}
      <div className="flex items-center justify-between">
        {error ? (
          <div className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600">
            {error}
          </div>
        ) : <span />}
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 transition-colors duration-150"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </form>
  );
};
