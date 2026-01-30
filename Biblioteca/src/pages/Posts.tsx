import { PostCard } from "../components/PostCard";
import { mockPosts } from "../data/mockPosts";
import { getPosts } from "../services/posts";
import type { Post } from "../types/Post";
import { useEffect, useState } from "react";

export const Posts = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    // loading and error states for more responsive UI
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // const mockPosts: Post[] = [
    //     {
    //         id: "1",
    //         user_id: "123",
    //         type: "text",
    //         content: "Just started using Biblioteca 📚",
    //         created_at: new Date().toISOString(),
    //     },
    // ];

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
        <main className="mx-auto max-w-2xl space-y-6 py-6">
        {posts.map((post) => (
            <PostCard key={post.id} post={post} />
        ))}
        </main>
    );
};
