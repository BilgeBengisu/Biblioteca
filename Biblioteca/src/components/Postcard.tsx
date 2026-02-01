import type { Post } from "../types/Post";
import default_avatar from "../assets/default-avatar.svg";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { deletePost } from "../services/posts";
import { Link } from "react-router-dom";

type PostCardProps = {
  post: Post;
  onDelete: (deletedPostId: string) => void; // this is to notify parent on deletion so the ui can be updated
};

export const PostCard = ({ post, onDelete }: PostCardProps) => {
  // getting the currently logged user
  const { user } = useAuth();
  // getting the mapping of the post that was fetched from supabase
  const { author, type, content, status, book, created_at } = post;

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user) return; // just in case
    if (!confirm('Estás seguro de que quieres eliminar esta publicación?')) return;

    try {
      setIsDeleting(true);
      await deletePost(post.id, user.id);
      onDelete(post.id); // Notify parent component(posts page) about deletion
      alert('Publicación eliminada');
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar la publicación');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="relative rounded-2xl bg-white p-4 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <img
          src={author.avatarUrl ?? default_avatar}
          alt={author.username}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium">{author.username}</p>
          <span className="text-xs text-neutral-500">
            {new Date(created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      {/* Delete button for the postcard - only shows if the user is the author of the post */}
      {user?.id === author.id && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-3 right-3 p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-50"
          title="Eliminar"
        >
          {isDeleting ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.5 3a1 1 0 00-1 1V5H3a1 1 0 100 2h14a1 1 0 100-2h-2.5v-1a1 1 0 00-1-1h-5zm-2 5a1 1 0 011-1h9a1 1 0 011 1v8a2 2 0 01-2 2h-6a2 2 0 01-2-2V8zm3 2a1 1 0 10-2 0v5a1 1 0 102 0v-5zm4 0a1 1 0 10-2 0v5a1 1 0 102 0v-5z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}

      {/* Post Body */}
      <div className="space-y-2">
        {/* For text-only posts */}
        {type === "text" && <p className="text-sm">{content}</p>}

        {/* For status or review posts with book */}
        {(type === "status" || type === "review") && (
          <div className="flex flex-col gap-2">
            {/* Status */}
            {type === "status" && status && (
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {status === "want_to_read" && "Quiere Leer"}
                {status === "reading" && "Leyendo"}
                {status === "finished" && "Leído"}
              </span>
            )}
            {/* Status */}
            {type === "review" && (
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Compartió sobre
              </span>
            )}

            {/* Book display */}
            {book && (
              <Link
                to={`/books/${book.slug}`}
                className="flex items-center gap-3 hover:opacity-80"
              >
                {book.coverUrl && (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded shadow-sm"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{book.title}</h3>
                  {book.author && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      por {book.author}
                    </p>
                  )}
                </div>
              </Link>
            )}
            {/* Status or Review Content */}
            {content && <p className="text-sm">{content}</p>}
          </div>
        )}
      </div>
    </article>
  );
};
