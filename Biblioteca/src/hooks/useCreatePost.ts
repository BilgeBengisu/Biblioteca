import { useState } from "react";
import { createPost } from "../services/posts";
import { upsertUserBook } from "../services/userBooks";
import type { Post } from "../types/Post";
import type { SearchBook } from "../components/BookSearchInput";

type PostType = "text" | "status" | "review";
type StatusOption = "want_to_read" | "reading" | "finished";

interface SubmitParams {
  type: PostType;
  content: string;
  selectedBook: SearchBook | null;
  status: StatusOption;
  rating: number;
}

export function useCreatePost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (params: SubmitParams): Promise<Post | null> => {
    const { type, content, selectedBook, status, rating } = params;
    setError(null);
    setIsSubmitting(true);

    try {
      let userBookIdForPost: string | null = null;

      if (type === "status" && selectedBook) {
        const userBook = await upsertUserBook({ book: selectedBook, status });
        userBookIdForPost = userBook.id;
      }

      if (type === "review" && selectedBook) {
        const userBook = await upsertUserBook({
          book: selectedBook,
          status: "finished",
          rating: rating > 0 ? rating : null,
        });
        userBookIdForPost = userBook.id;
      }

      if ((type === "status" || type === "review") && !userBookIdForPost) {
        setError("No se pudo asociar el libro. Intenta de nuevo.");
        return null;
      }

      const newPost = await createPost({
        type,
        content: type === "text" ? content.trim() : (content.trim() || ""),
        userBookId: type === "text" ? null : userBookIdForPost!,
        ...(type === "status" ? { status } : {}),
        ...(type === "review" ? { rating: rating > 0 ? rating : null } : {}),
      } as any);

      return newPost;
    } catch (err) {
      console.error("Error creating post:", err);
      setError("No se pudo publicar. Intenta de nuevo.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, error, setError };
}
