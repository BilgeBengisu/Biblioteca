import { useState } from "react";
import { deletePost } from "../services/posts";

export function useDeletePost() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePostById = async (postId: string, userId: string) => {
    setIsDeleting(true);
    try {
      await deletePost(postId, userId);
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deletePostById };
}
