import { PostCard } from "../components/PostCard";
import { getPosts } from "../services/posts";
import type { Post } from "../types/Post";
import { useEffect, useState } from "react";
import { NewPostForm } from "../components/NewPostForm";

export const Posts = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    // loading and error states for more responsive UI
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // handler to add newly created post to the posts list
    // this updates the ui without refetching all posts
    const handlePostCreated = (post: Post) => {
        setPosts([post, ...posts]); // prepend new post to top
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

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-4">
            <NewPostForm onPostCreated={handlePostCreated} />
            {posts.map((post) => (
                <PostCard 
                key={post.id} 
                post={post} 
                onDelete={handlePostDeleted}/> // the callback to update UI on deletion
            ))}
        </div>
    );
};
