import { useState, useEffect } from "react";
import { getPosts } from "../services/posts";
import type { Post } from "../types/Post";

export function usePosts(profileId: string | undefined, enabled: boolean) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [postsLoadedFor, setPostsLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!profileId) return;
    if (postsLoadedFor === profileId) return;

    let isMounted = true;
    setPostsLoading(true);
    setPostsError(null);

    getPosts({ userId: profileId })
        .then((data) => {
            if (!isMounted) return;
            setPosts(data);
            setPostsLoadedFor(profileId);
        })
        .catch((err) => {
            console.error(err);
            if (!isMounted) return;
            setPostsError("No se pudieron cargar las publicaciones");
        })
        .finally(() => {
            if (!isMounted) return;
            setPostsLoading(false);
        });

        // if the page is unmounted, react runs this cleanup
        return () => { isMounted = false; };
    }, [enabled, profileId, postsLoadedFor]);

    return { posts, setPosts, postsLoading, postsError };
}