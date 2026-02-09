import { Link } from "react-router-dom";
import default_avatar from "../../assets/default-avatar.svg";
import type { Comment } from "../../types/Comment";

type CommentItemProps = {
  comment: Comment;
  canReply: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onReply: (commentId: string) => void;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
};

export const CommentItem = ({
  comment,
  canReply,
  canEdit,
  canDelete,
  onReply,
  onEdit,
  onDelete,
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
            {canReply && (
              <button type="button" onClick={() => onReply(comment.id)} className="hover:underline">
                Responder
              </button>
            )}
            {canEdit && (
              <button type="button" onClick={() => onEdit(comment.id)} className="hover:underline">
                Editar
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
