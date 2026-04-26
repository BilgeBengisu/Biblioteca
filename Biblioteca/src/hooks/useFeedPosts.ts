import { useState, useEffect } from "react";
import { getPosts } from "../services/posts";
import type { Post } from "../types/Post";

export function useFeedPosts(filter: "all" | "following", viewerId: string | undefined) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getPosts({ feed: filter, viewerId })
      .then((data) => { if (!cancelled) setPosts(data); })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError("No se pudieron cargar las publicaciones");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [filter, viewerId]);

  return { posts, setPosts, loading, error };
}
