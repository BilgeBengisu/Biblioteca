import { useCallback, useEffect, useState } from "react";
import type { Comment } from "../types/Comment";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
  updateComment,
} from "../services/comments";

type CreateArgs = {
  postId: string;
  content: string;
  parentId?: string | null;
};

type UpdateArgs = {
  id: string;
  content: string;
  userId?: string;
};

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCommentsByPostId(postId);
      setComments(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los comentarios");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (input: CreateArgs) => {
      setError(null);
      const created = await createComment(input);
      setComments((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const update = useCallback(async (input: UpdateArgs) => {
    setError(null);
    const updated = await updateComment(input);
    setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    return updated;
  }, []);

  const remove = useCallback(async (commentId: string, userId?: string) => {
    setError(null);
    await deleteComment(commentId, userId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }, []);

  return {
    comments,
    loading,
    error,
    refresh,
    addComment: add,
    updateComment: update,
    deleteComment: remove,
  };
}
