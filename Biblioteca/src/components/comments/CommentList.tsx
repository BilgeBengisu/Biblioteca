import type { CommentNode } from "../../utils/comments";
import { CommentItem } from "./CommentItem";
import { CommentComposer } from "./CommentComposer";

type CommentListProps = {
  nodes: CommentNode[];
  depth: number;
  maxDepth: number;
  currentUserId?: string | null;
  replyToId?: string | null;
  editId?: string | null;
  onReply: (commentId: string) => void;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onSubmitReply: (parentId: string, content: string) => Promise<void>;
  onSubmitEdit: (commentId: string, content: string) => Promise<void>;
  onCancelAction: () => void;
};

export const CommentList = ({
  nodes,
  depth,
  maxDepth,
  currentUserId,
  replyToId,
  editId,
  onReply,
  onEdit,
  onDelete,
  onSubmitReply,
  onSubmitEdit,
  onCancelAction,
}: CommentListProps) => {
  if (nodes.length === 0) return null;

  return (
    <div className="space-y-3">
      {nodes.map((node) => {
        const canReply = depth < maxDepth;
        const canEdit = !!currentUserId && node.user_id === currentUserId;
        const canDelete = !!currentUserId && node.user_id === currentUserId;

        return (
          <div key={node.id} className={depth > 1 ? "ml-6" : ""}>
            <CommentItem
              comment={node}
              canReply={canReply}
              canEdit={canEdit}
              canDelete={canDelete}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />

            {editId === node.id && (
              <div className="mt-2 ml-10">
                <CommentComposer
                  initialValue={node.content}
                  placeholder="Edita tu comentario..."
                  submitLabel="Guardar"
                  onCancel={onCancelAction}
                  onSubmit={(content) => onSubmitEdit(node.id, content)}
                />
              </div>
            )}

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
                  editId={editId}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onSubmitReply={onSubmitReply}
                  onSubmitEdit={onSubmitEdit}
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
