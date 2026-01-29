import { PostCard } from "../components/PostCard";
import { mockPosts } from "../data/mockPosts";
import { getPosts } from "../services/posts";
import type { Post } from "../types/Post";
import { useEffect, useState } from "react";

export const Posts = () => {
    // getting posts from the service to display
    const [posts, setPosts] = useState<Post[]>([]);
        useEffect(() => {
            getPosts().then(setPosts);
        }, []);

    return (
        <main className="mx-auto max-w-2xl space-y-6 py-6">
        {posts.map((post) => (
            <PostCard key={post.id} post={post} />
        ))}
        </main>
    );
};
