import { useCallback } from "react";
import { likePost, unlikePost } from "../services/posts";
import type { Post } from "../types/Post";

type UseToggleLikeArgs = {
  userId?: string;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

export const useToggleLike = ({ userId, setPosts }: UseToggleLikeArgs) => {
  return useCallback(
    async (postId: string, currentlyLiked: boolean) => {
      if (!userId) return;

      // Optimistic update for faster UI feedback
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          const nextLiked = !currentlyLiked;
          const currentCount = p.like_count ?? 0;
          const nextCount = nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
          return { ...p, liked_by_me: nextLiked, like_count: nextCount };
        })
      );

      try {
        if (currentlyLiked) await unlikePost(postId, userId);
        else await likePost(postId, userId);
      } catch (err) {
        console.error(err);

        // Revert optimistic update if the request fails
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== postId) return p;
            const currentCount = p.like_count ?? 0;
            const revertedCount = currentlyLiked
              ? currentCount + 1
              : Math.max(0, currentCount - 1);
            return { ...p, liked_by_me: currentlyLiked, like_count: revertedCount };
          })
        );
      }
    },
    [setPosts, userId]
  );
};
