import { useState, useEffect } from "react";
import type { Post } from "../types/Post";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/posts";
import { SEARCH_BOOKS } from "../queries/queries";
import type { BookData } from "../types/Book";
import { apolloClient } from "../contexts/ApolloClient.tsx";
import { BookSearchInput, type SearchBook } from "./BookSearchInput";
import { upsertUserBook } from "../services/userBooks";

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

  return (
    <form className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm space-y-3" 
    onSubmit={handleSubmit}
    >
      {/* Post type selector */}
      <div className="flex gap-2">
        {[
          { label: "Escribir algo", value: "text" },
          { label: "Compartir estado", value: "status" },
          { label: "Reseña", value: "review" },
        ].map(({ label, value }) => (
          <button
            key={value}
            type="button"
            className={`px-3 py-1 rounded-full border ${
              type === value ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-neutral-800"
            }`}
            onClick={() => {
              setError(null);
              setType(value as "text" | "status" | "review");

              // Keep state tidy when switching post types
              if (value === "text") {
                setSelectedBook(null);
                setRating(0);
              }
              if (value === "status") {
                setRating(0);
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Book selector for status/review */}
      {(type === "status" || type === "review") && (
        <BookSearchInput
          value={selectedBook}
          onChange={setSelectedBook}
        />
      )}

      {/* Include status selector for status update posts */}
      {(type === "status") && (
      <div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Quiero leer", value: "want_to_read" },
            { label: "Leyendo", value: "reading" },
            { label: "Leído", value: "finished" },
          ].map((s) => (
            <button
              key={s.value}
              type="button"
              className={`px-3 py-1 rounded-full border ${
                status === s.value ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-neutral-800"
              }`}
              onClick={() => setStatus(s.value as typeof status)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Rating selector for review posts */}
      {type === "review" && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-300">Calificación:</span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} estrellas`}
                className={`text-2xl leading-none px-1 ${
                  rating >= n ? "text-yellow-500" : "text-neutral-300 dark:text-neutral-600"
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
              className="text-xs underline text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200"
              onClick={() => setRating(0)}
            >
              borrar
            </button>
          )}
        </div>
      )}

      {/* Content textarea */}
      <div>
        <textarea
          className="w-full border rounded p-2 dark:bg-neutral-800 dark:text-white"
          placeholder={"¿Qué te gustaría compartir?"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={type === "text" ? 3 : 2}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? "Publicando..." : "Publicar"}
      </button>
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
    </form>
  );
};
