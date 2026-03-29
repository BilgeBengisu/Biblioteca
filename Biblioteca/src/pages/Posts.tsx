import { getPosts } from "../services/posts";
import type { Post } from "../types/Post";
import { useEffect, useState } from "react";
import { NewPostForm } from "../components/NewPostForm";
import { PostCard } from "../components/Postcard";
import { useAuth } from "../contexts/AuthContext";
import { PostCardSkeleton } from "../components/PostCardSkeleton";
import { useToggleLike } from "../hooks/useToggleLike";
import { PostsFilterTabs } from "../components/PostsFilterTabs";

export const Posts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);

    // loading and error states for more responsive UI
    const [error, setError] = useState<string | null>(null);
    const [loadingPosts, setLoadingPosts] = useState<boolean>(true);

    const [filter, setFilter] = useState<"all" | "following">("all");


    // handler to add newly created post to the posts list
    // this updates the ui without refetching all posts
    const handlePostCreated = (post: Post) => {
        setPosts((prev) => [post, ...prev]); // prepend new post to top
        // prev helps calling the function with the latest state
        // this way we don't lose any post if states update quickly
    };

     // handler to update the UI after a post is deleted
    const handlePostDeleted = (deletedPostId: string) => {
        setPosts(prev => prev.filter(post => post.id !== deletedPostId));
    };

    // getting posts from the service to display
    useEffect(() => {
        let cancelled = false;

        setLoadingPosts(true);
        setError(null);

        getPosts({
            feed: filter,        // "all" | "following"
            viewerId: user?.id,  // needed for following feed (also used for "include me")
        })
            .then((data) => {
            if (cancelled) return;
            setPosts(data);
            })
            .catch((err) => {
            console.error(err);
            if (cancelled) return;
            setError("No se pudieron cargar las publicaciones");
            })
            .finally(() => {
            if (cancelled) return;
            setLoadingPosts(false);
            });

        return () => {
            cancelled = true;
        };
    }, [filter, user?.id]);

    const handleToggleLike = useToggleLike({ userId: user?.id, setPosts });

    if (error) {
        return <p className="text-center text-sm text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-4">
            {user ? (
                <NewPostForm onPostCreated={handlePostCreated} />
            ) : (
                <p className="text-center text-sm text-gray-500">Inicia sesión para publicar.</p>
            )}
            <PostsFilterTabs
                filter={filter}
                onChange={setFilter}
                userLoggedIn={!!user}
            />
            {loadingPosts && ( // show skeleton while loading posts
                <>
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
                </>
            )}
            {posts.map((post) => (
                <PostCard 
                key={post.id} 
                post={post} 
                onDelete={handlePostDeleted}
                onToggleLike={handleToggleLike}/> // the callback to update UI on deletion
            ))}
            {posts.length === 0 && !loadingPosts &&
                <p className="text-center text-sm text-gray-500">
                    No hay publicaciones todavía.
                </p>
            }
        </div>
    );
};
