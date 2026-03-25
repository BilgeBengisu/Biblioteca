import type { Post } from "../types/Post";
import default_avatar from "../assets/default-avatar.svg";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { deletePost } from "../services/posts";
import { getCommentCountByPostId } from "../services/comments";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
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
      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={() => onToggleLike(post.id, post.liked_by_me ?? false)}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-500"
        >
          <Heart className={`w-4 h-4 transition-all hover:rotate-3 ${post.liked_by_me ? 'fill-red-500 stroke-red-500' : 'fill-none'}`} />
          {post.like_count || 0}
        </button>
        {showComments && (
          <button
            type="button"
            onClick={() => setIsCommentsOpen((v) => !v)}
            aria-expanded={isCommentsOpen}
            className="inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <MessageCircle className="w-4 h-4 fill-none" />
            {commentCount ?? "…"}
          </button>
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
