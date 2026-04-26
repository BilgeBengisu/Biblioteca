import { useState, useEffect } from "react";
import { getCommentCountByPostId } from "../services/comments";

export function useCommentCount(postId: string, enabled = true) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    getCommentCountByPostId(postId).then((c) => {
      if (!cancelled) setCount(c);
    });

    return () => { cancelled = true; };
  }, [postId, enabled]);

  return { count, setCount };
}
