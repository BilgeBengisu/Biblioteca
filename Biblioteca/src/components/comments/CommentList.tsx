import type { CommentNode } from "../../utils/comments";
import { CommentItem } from "./CommentItem";
import { CommentComposer } from "./CommentComposer";

type CommentListProps = {
  nodes: CommentNode[];
  depth: number;
  maxDepth: number;
  currentUserId?: string | null;
  replyToId?: string | null;
  onReply: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onToggleLike: (commentId: string, currentlyLiked: boolean) => void;
  onSubmitReply: (parentId: string, content: string) => Promise<void>;
  onCancelAction: () => void;
};

export const CommentList = ({
  nodes,
  depth,
  maxDepth,
  currentUserId,
  replyToId,
  onReply,
  onDelete,
  onToggleLike,
  onSubmitReply,
  onCancelAction,
}: CommentListProps) => {
  if (nodes.length === 0) return null;

  return (
    <div className="space-y-3">
      {nodes.map((node) => {
        const canReply = depth < maxDepth;
        const canDelete = !!currentUserId && node.user_id === currentUserId;

        return (
          <div key={node.id} className={depth > 1 ? "ml-6" : ""}>
            <CommentItem
              comment={node}
              canReply={canReply}
              canDelete={canDelete}
              onReply={onReply}
              onDelete={onDelete}
              onToggleLike={onToggleLike}
            />

            {replyToId === node.id && canReply && (
              <div className="mt-2 ml-10">
                <CommentComposer
                  placeholder="Escribe una respuesta..."
                  submitLabel="Responder"
                  onCancel={onCancelAction}
                  onSubmit={(content) => onSubmitReply(node.id, content)}
                />
              </div>
            )}

            {node.children.length > 0 && (
              <div className="mt-3">
                <CommentList
                  nodes={node.children}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  currentUserId={currentUserId}
                  replyToId={replyToId}
                  onReply={onReply}
                  onDelete={onDelete}
                  onToggleLike={onToggleLike}
                  onSubmitReply={onSubmitReply}
                  onCancelAction={onCancelAction}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
