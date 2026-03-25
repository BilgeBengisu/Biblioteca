import { useEffect, useMemo, useState } from "react";
import { useComments } from "../hooks/useComments";
import { useAuth } from "../contexts/AuthContext";
import { buildCommentTree } from "../utils/comments";
import { CommentComposer } from "./comments/CommentComposer";
import { CommentList } from "./comments/CommentList";

type CommentThreadProps = {
  postId: string;
  maxDepth?: number;
  compact?: boolean;
  onCountChange?: (count: number) => void;
  initialCount?: number | null;
};

export const CommentThread = ({
  postId,
  maxDepth = 5,
  compact = false,
  onCountChange,
  initialCount = null,
}: CommentThreadProps) => {
  const { user } = useAuth();
  const {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    toggleLike,
  } = useComments(postId);

  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const tree = useMemo(() => buildCommentTree(comments), [comments]);
  const count = comments.length;
  const displayCount = loading && initialCount != null ? initialCount : count;

  useEffect(() => {
    if (!loading) setHasLoadedOnce(true);
  }, [loading]);

  useEffect(() => {
    if (!loading && hasLoadedOnce && onCountChange) onCountChange(count);
  }, [count, hasLoadedOnce, loading, onCountChange]);

  const handleCancelAction = () => {
    setReplyToId(null);
  };

  const handleSubmitNew = async (content: string) => {
    await addComment({ postId, content });
  };

  const handleSubmitReply = async (parentId: string, content: string) => {
    await addComment({ postId, parentId, content });
    handleCancelAction();
  };

  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId, user?.id);
  };

  const handleToggleLike = async (commentId: string, currentlyLiked: boolean) => {
    await toggleLike(commentId, currentlyLiked, user?.id);
  };

  return (
    <section className={compact ? "space-y-3" : "space-y-4"}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-700">
          Comentarios ({displayCount})
        </h3>
        {loading && <span className="text-xs text-neutral-500">Cargando...</span>}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <CommentComposer
        onSubmit={handleSubmitNew}
        placeholder="Escribe un comentario..."
        submitLabel="Comentar"
      />

      {tree.length === 0 && !loading && (
        <p className="text-sm text-neutral-500">Sé la primera persona en comentar.</p>
      )}

      <CommentList
        nodes={tree}
        depth={1}
        maxDepth={maxDepth}
        currentUserId={user?.id}
        replyToId={replyToId}
        onReply={(id) => {
          setReplyToId(id);
        }}
        onDelete={handleDelete}
        onToggleLike={handleToggleLike}
        onSubmitReply={handleSubmitReply}
        onCancelAction={handleCancelAction}
      />
    </section>
  );
};
