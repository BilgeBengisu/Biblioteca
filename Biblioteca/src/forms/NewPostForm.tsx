import { useState } from "react";
import type { Post } from "../types/Post";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/posts";

type NewPostFormProps = {
  onPostCreated: (post: Post) => void; // callback to add the new post to feed
};

export const NewPostForm = ({ onPostCreated }: NewPostFormProps) => {
  const [type, setType] = useState<"text" | "status" | "review">("text");
  const [content, setContent] = useState("");
  const [bookId, setBookId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "text" && !content.trim()) return; // text must have content
    if ((type === "status" || type === "review") && !bookId) return; // book required

    setIsSubmitting(true);
    try {
      const newPost = await createPost({ type, content, bookId });
      onPostCreated(newPost);
      setContent("");
      setBookId(null);
      setType("text");
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm space-y-3" onSubmit={handleSubmit}>
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
            onClick={() => setType(value as "text" | "status" | "review")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Book selector for status/review */}
      {(type === "status" || type === "review") && (
        <div>
          <label className="block text-sm font-medium mb-1">Book</label>
          <select
            value={bookId ?? ""}
            onChange={(e) => setBookId(Number(e.target.value))}
            className="w-full border rounded p-2 dark:bg-neutral-800 dark:text-white"
          >
            <option value="">Select a book</option>
            {/* TODO: Replace with dynamic books */}
            {/* TODO: Need to implement search function for this */}
            <option value={1}>Atomic Habits</option>
            <option value={2}>The Alchemist</option>
          </select>
        </div>
      )}

      {/* Content textarea */}
      <div>
        <textarea
          className="w-full border rounded p-2 dark:bg-neutral-800 dark:text-white"
          placeholder={"Que te gustaría compartir?"}
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
