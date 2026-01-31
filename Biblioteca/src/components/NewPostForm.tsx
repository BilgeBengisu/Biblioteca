import { useState } from "react";
import type { Post } from "../types/Post";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/posts";
import { SEARCH_BOOKS } from "../queries/queries";
import type { BookData } from "../types/Book";
import { apolloClient } from "../contexts/ApolloClient.tsx";
import { BookSearchInput, type SearchBook } from "./BookSearchInput";

type NewPostFormProps = {
  onPostCreated: (post: Post) => void; // callback to add the new post to feed
};

// post reference uses a user-book relationship
export const NewPostForm = ({ onPostCreated }: NewPostFormProps) => {
  const [type, setType] = useState<"text" | "status" | "review">("text");
  const [content, setContent] = useState("");
  const [userBookId, setUserBookId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBook, setSelectedBook] = useState<SearchBook | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;

    if ((type === "status" || type === "review") && !userBookId) return;

    setIsSubmitting(true);
    try {
      const newPost = await createPost({
        type,
        content,
        userBookId: type === "text" ? null : userBookId, // text posts don't have any associations with books
      });

      onPostCreated(newPost);

      setContent("");
      setUserBookId(null);
      setType("text");
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm space-y-3" 
    onSubmit={handleSubmit}>
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
              setType(value as "text" | "status" | "review");
              if (value === "text") {
                  setSelectedBook(null);
                  setUserBookId(null);
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
          initialBook={selectedBook}
          onBookSelect={(book) => {
            setSelectedBook(book);
            // NOTE: this is TEMP until we create/lookup user_books.id
            setUserBookId(book?.id ?? null); // for createPost
          }}
        />
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
        disabled={isSubmitting}
      >
        {isSubmitting ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
};
