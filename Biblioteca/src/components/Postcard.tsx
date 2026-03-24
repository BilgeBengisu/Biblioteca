import type { Post } from "../types/Post";
import default_avatar from "../assets/default-avatar.svg";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { deletePost } from "../services/posts";
import { getCommentCountByPostId } from "../services/comments";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { StarRating } from "./StarRating";
import { BookInlineCard } from "./BookInlineCard";
import { CommentThread } from "./CommentThread";

type PostCardProps = {
  post: Post;
  onDelete: (deletedPostId: string) => void;// this is to notify parent on deletion so the ui can be updated
  onToggleLike: (postId: string, currentlyLiked: boolean) => void;
  showBookInline?: boolean;
  showComments?: boolean;
  commentCompact?: boolean;
};

export const PostCard = ({
  post,
  onDelete,
  onToggleLike,
  showBookInline = true,
  showComments = true,
  commentCompact = false,
}: PostCardProps) => {
  // getting the currently logged user
  const { user } = useAuth();
  // getting the mapping of the post that was fetched from supabase
  const { author, type, content, status, userBook, created_at } = post;

  const STATUS_LABELS: Record<string, string> = {
    want_to_read: "quiere leer",
    reading: "leyendo",
    finished: "terminado",
  };

  const headerLabel =
    type === "review"
      ? "compartió sobre"
      : type === "status" && status
      ? STATUS_LABELS[status]
      : null;

  const book = userBook?.bookData // matching the PostBook type
  ? {
      id: userBook.bookId,
      title: userBook.bookData.title,
      author: userBook.bookData.author ?? "Desconocido",
      coverUrl: userBook.bookData.coverUrl,
      slug: userBook.bookData.slug ?? null,
    }
  : undefined;

  const CONTENT_LIMIT = 300;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentCount, setCommentCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!showComments) return;

    getCommentCountByPostId(post.id).then((count) => {
      if (!cancelled) setCommentCount(count);
    });

    return () => {
      cancelled = true;
    };
  }, [post.id, showComments]);

  const handleDelete = async () => {
    if (!user) return; // just in case
    if (!confirm('Estás seguro de que quieres eliminar esta publicación?')) return;

    try {
      setIsDeleting(true);
      await deletePost(post.id, user.id);
      onDelete(post.id); // Notify parent component(posts page) about deletion - only after successful deletion
      alert('Publicación eliminada');
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar la publicación');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to={`/profile/${author.username}`}
          className="flex items-center gap-3"
        >
          <img
            src={author.avatarUrl ?? default_avatar}
            alt={author.username}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div>
            <p className="text-sm font-medium hover:underline">
              {author.username}
            </p>
          </div>
        </Link>
        {headerLabel && (
          <span className="text-sm text-neutral-500">{headerLabel}</span>
        )}
        <span className="text-xs text-neutral-500 ml-auto">
          {new Date(created_at).toLocaleDateString()}
        </span>
        {user?.id === author.id && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-full text-neutral-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50"
            title="Eliminar"
          >
            {isDeleting ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Post Body */}
      <div className="space-y-2">
        {/* For text-only posts */}
        {type === "text" && content && (
          <div>
            <p className="text-base whitespace-pre-wrap">
              {isExpanded || content.length <= CONTENT_LIMIT
                ? content
                : content.slice(0, CONTENT_LIMIT) + "…"}
            </p>
            {content.length > CONTENT_LIMIT && (
              <button
                onClick={() => setIsExpanded((v) => !v)}
                className="text-sm text-neutral-400 hover:text-neutral-600 mt-1"
              >
                {isExpanded ? "leer menos" : "leer más"}
              </button>
            )}
          </div>
        )}

        {/* For status or review posts with book */}
        {(type === "status" || type === "review") && (
          <div className="flex flex-col gap-2">
            {/* Book display */}
            {showBookInline && book && (
              <BookInlineCard book={book} />
            )}
            {/* Rating sits directly below the book card — position implies it's the user's rating */}
            {type === "review" && post.rating != null && (
              <StarRating rating={post.rating} size="md" />
            )}
            {/* Status or Review Content */}
            {post.content && post.content.trim().length > 0 && (
              <div>
                <p className="text-base text-neutral-800 dark:text-neutral-100 whitespace-pre-wrap">
                  {isExpanded || post.content.length <= CONTENT_LIMIT
                    ? post.content
                    : post.content.slice(0, CONTENT_LIMIT) + "…"}
                </p>
                {post.content.length > CONTENT_LIMIT && (
                  <button
                    onClick={() => setIsExpanded((v) => !v)}
                    className="text-sm text-neutral-400 hover:text-neutral-600 mt-1"
                  >
                    {isExpanded ? "leer menos" : "leer más"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex items-center gap-2 pt-2">
        <div>
          <button    
            type="button"
            onClick={() => onToggleLike(post.id, post.liked_by_me ?? false)}
            className={`cursor-pointer inline-flex items-center gap-2 text-primary dark:text-gray-300 hover:text-red-500`}
          > 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={`icon-lg w-5 h-5 ${post.liked_by_me ? 'fill-red-500 dark:fill-red-500' : 'fill-gray-700 dark:fill-gray-300'} hover:fill-red-500 dark:hover:fill-red-500 hover:rotate-3 transition-all`} >
              <path d="m225.8 468.2-2.5-2.3L48.1 303.2A150.6 150.6 0 0 1 0 192.8v-3.3c0-70.4 50-130.8 119.2-144A146.2 146.2 0 0 1 256 91.9c4.2-4.8 8.7-9.2 13.5-13.3a146.67 146.67 0 0 1 123.3-33.2A146.7 146.7 0 0 1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9M239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1a98.4 98.4 0 0 0-92-31.2A98.6 98.6 0 0 0 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268a102.7 102.7 0 0 0 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9-34-6.5-69 5.4-92 31.2l-.1.1-.1.1-17.8 20c-.3.4-.7.7-1 1.1a23.9 23.9 0 0 1-33.8 0z"></path> 
            </svg>
            {post.like_count || 0}
          </button>
        </div>
        {showComments && (
          <div>
            <button
              type="button"
              onClick={() => setIsCommentsOpen((v) => !v)}
              aria-expanded={isCommentsOpen}
              className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-blue-500"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
              >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="text-xs text-neutral-600">
                {commentCount ?? "…"}
              </span>
            </button>
          </div>
        )}
      </div>

      {showComments && isCommentsOpen && (
        <div className="pt-3 border-t border-neutral-100">
          <CommentThread
            postId={post.id}
            compact={commentCompact}
            maxDepth={5}
            onCountChange={setCommentCount}
            initialCount={commentCount}
          />
        </div>
      )}
    </article>
  );
};
