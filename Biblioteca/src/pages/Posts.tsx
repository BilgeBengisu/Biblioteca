import { useState } from "react";
import type { Post } from "../types/Post";
import { NewPostForm } from "../components/NewPostForm";
import { PostCard } from "../components/Postcard";
import { useAuth } from "../contexts/AuthContext";
import { PostCardSkeleton } from "../components/PostCardSkeleton";
import { useToggleLike } from "../hooks/useToggleLike";
import { PostsFilterTabs } from "../components/PostsFilterTabs";
import { useFeedPosts } from "../hooks/useFeedPosts";

export const Posts = () => {
    const { user } = useAuth();
    const [filter, setFilter] = useState<"all" | "following">("all");
    const { posts, setPosts, loading, error } = useFeedPosts(filter, user?.id);

    const handlePostCreated = (post: Post) => {
        setPosts((prev) => [post, ...prev]);
    };

    const handlePostDeleted = (deletedPostId: string) => {
        setPosts(prev => prev.filter(post => post.id !== deletedPostId));
    };

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
            {loading && (
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
                onToggleLike={handleToggleLike}/>
            ))}
            {posts.length === 0 && !loading &&
                <p className="text-center text-sm text-gray-500">
                    No hay publicaciones todavía.
                </p>
            }
        </div>
    );
};
