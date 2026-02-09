import { Link } from "react-router-dom";
import default_avatar from "../../assets/default-avatar.svg";
import type { Comment } from "../../types/Comment";

type CommentItemProps = {
  comment: Comment;
  canReply: boolean;
  canDelete: boolean;
  onReply: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onToggleLike: (commentId: string, currentlyLiked: boolean) => void;
};

export const CommentItem = ({
  comment,
  canReply,
  canDelete,
  onReply,
  onDelete,
  onToggleLike,
}: CommentItemProps) => {
  const author = comment.author;

  return (
    <div className="rounded-xl border border-neutral-100 bg-white p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <img
          src={author?.avatarUrl ?? default_avatar}
          alt={author?.username ?? "Usuario"}
          className="h-8 w-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {author?.username ? (
              <Link to={`/profile/${author.username}`} className="text-sm font-semibold hover:underline">
                {author.username}
              </Link>
            ) : (
              <span className="text-sm font-semibold">Usuario</span>
            )}
            <span className="text-xs text-neutral-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-800 whitespace-pre-wrap">
            {comment.content}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-neutral-600">
            <button
              type="button"
              onClick={() => onToggleLike(comment.id, comment.liked_by_me ?? false)}
              className="inline-flex items-center gap-1 hover:text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className={`w-4 h-4 ${comment.liked_by_me ? "fill-red-500" : "fill-neutral-500"}`}
              >
                <path d="m225.8 468.2-2.5-2.3L48.1 303.2A150.6 150.6 0 0 1 0 192.8v-3.3c0-70.4 50-130.8 119.2-144A146.2 146.2 0 0 1 256 91.9c4.2-4.8 8.7-9.2 13.5-13.3a146.67 146.67 0 0 1 123.3-33.2A146.7 146.7 0 0 1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9M239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1a98.4 98.4 0 0 0-92-31.2A98.6 98.6 0 0 0 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268a102.7 102.7 0 0 0 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9-34-6.5-69 5.4-92 31.2l-.1.1-.1.1-17.8 20c-.3.4-.7.7-1 1.1a23.9 23.9 0 0 1-33.8 0z"></path>
              </svg>
              <span>{comment.like_count ?? 0}</span>
            </button>
            {canReply && (
              <button type="button" onClick={() => onReply(comment.id)} className="hover:underline">
                Responder
              </button>
            )}
            {canDelete && (
              <button type="button" onClick={() => onDelete(comment.id)} className="hover:underline">
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
