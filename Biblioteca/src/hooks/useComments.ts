import { useCallback, useEffect, useState } from "react";
import type { Comment, CreateCommentInput } from "../types/Comment";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
  likeComment,
  unlikeComment,
} from "../services/comments";

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

  const add = async (input: CreateCommentInput) => {
    setError(null);
    const created = await createComment(input);
    setComments((prev) => [created, ...prev]);
    return created;
  };

  const remove = async (commentId: string, userId?: string) => {
    setError(null);
    await deleteComment(commentId, userId);
    await refresh();
  };

  const toggleLike = async (commentId: string, currentlyLiked: boolean, userId?: string) => {
    if (!userId) return;

    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const nextLiked = !currentlyLiked;
        const currentCount = c.like_count ?? 0;
        const nextCount = nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
        return { ...c, liked_by_me: nextLiked, like_count: nextCount };
      })
    );

    try {
      if (currentlyLiked) await unlikeComment(commentId, userId);
      else await likeComment(commentId, userId);
    } catch (err) {
      console.error(err);
      setComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;
          const currentCount = c.like_count ?? 0;
          const revertedCount = currentlyLiked
            ? currentCount + 1
            : Math.max(0, currentCount - 1);
          return { ...c, liked_by_me: currentlyLiked, like_count: revertedCount };
        })
      );
    }
  };

  return {
    comments,
    loading,
    error,
    refresh,
    addComment: add,
    deleteComment: remove,
    toggleLike,
  };
}
