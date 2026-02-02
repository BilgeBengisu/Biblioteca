import { getPosts, likePost, unlikePost } from "../services/posts";
import type { Post } from "../types/Post";
import { useEffect, useState } from "react";
import { NewPostForm } from "../components/NewPostForm";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../contexts/AuthContext";

export const Posts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);

    // loading and error states for more responsive UI
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
        getPosts()
        .then(setPosts)
        .catch((err) => {
            console.error(err);
            setError("No se pudieron cargar las publicaciones");
        })
        .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <p className="text-center text-sm text-gray-500">Cargando publicaciones…</p>;
    }

    if (error) {
        return <p className="text-center text-sm text-red-500">{error}</p>;
    }

    if (posts.length === 0) {
        return (
            <p className="text-center text-sm text-gray-500">
                No hay publicaciones todavía.
            </p>
        );
    }

    // handling the like on Postcard
    const handleToggleLike = async (postId: string, currentlyLiked: boolean) => {
        if (!user) return;

        // optimistic update, meaning we update the ui before knowing if the database request succeded or not and revert later if it didn't
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
            if (currentlyLiked) await unlikePost(postId, user.id);
            else await likePost(postId, user.id);
        } catch (err) {
            console.error(err);

            // revert if likePost database insert was not successful
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
    };


    return (
        <div className="max-w-3xl mx-auto p-4 space-y-4">
            <NewPostForm onPostCreated={handlePostCreated} />
            {posts.map((post) => (
                <PostCard 
                key={post.id} 
                post={post} 
                onDelete={handlePostDeleted}
                onToggleLike={handleToggleLike}/> // the callback to update UI on deletion
            ))}
        </div>
    );
};
