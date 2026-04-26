import { useState, useEffect } from "react";
import { getPostsByBook } from "../services/posts";
import type { Post } from "../types/Post";

export function usePostsByBook(
  bookId: number | null,
  viewerId: string | undefined,
  enabled: boolean
) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPosts([]);
    setError(null);
    setLoaded(false);
  }, [bookId]);

  useEffect(() => {
    if (!enabled || loaded) return;
    if (!bookId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getPostsByBook({ bookId, viewerId })
      .then((data) => {
        if (cancelled) return;
        setPosts(data);
      })
      .catch((err) => {
        console.error(err);
        if (cancelled) return;
        setError("No se pudieron cargar las reseñas.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        setLoaded(true);
      });

    return () => { cancelled = true; };
  }, [enabled, loaded, bookId, viewerId]);

  return { posts, setPosts, loading, error };
}
