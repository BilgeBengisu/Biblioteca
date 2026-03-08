import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { BooksData } from "../types/Book";
import { useQuery } from "@apollo/client/react";
import { GET_BOOK_BY_SLUG } from "../queries/queries";
import { useEffect, useMemo, useState } from "react";
import { StarRating } from "../components/StarRating";
import { PostCard } from "../components/Postcard";
import { PostCardSkeleton } from "../components/PostCardSkeleton";
import type { Post } from "../types/Post";
import { getPostsByBook } from "../services/posts";
import { useAuth } from "../contexts/AuthContext";
import { useToggleLike } from "../hooks/useToggleLike";
import { BookStatusSelect } from "../components/BookStatusSelect";

export const BookView = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from;

    // finding the book to display using the id param (slug)
    const { data, loading, error } = useQuery<BooksData>(GET_BOOK_BY_SLUG, {
        variables: { slug: id },
        skip: !id,
    });

    // filter view for sections
    const [selectedSection, setSelectedSection] = useState<
        "descripcion" | "author" | "posts"
    >("descripcion");

    const [posts, setPosts] = useState<Post[]>([]);
    const [postsLoading, setPostsLoading] = useState<boolean>(false);
    const [postsError, setPostsError] = useState<string | null>(null);
    const [postsLoaded, setPostsLoaded] = useState<boolean>(false);

    const bookData = data?.books?.[0];

    // Transform API book data to match component expectations
    const book = bookData ? {
        id: bookData.slug,
        title: bookData.title,
        author: bookData.contributions?.[0]?.author?.name || "Autor desconocido",
        cover: bookData.image?.url || "/default-book-cover.png",
        description: bookData.description || "",
        rating: bookData.rating,
        color: bookData.image?.color,
        authorBio: bookData.contributions?.[0]?.author?.bio,
    } : null;

    const bookId = useMemo(() => {
        const rawBookId = bookData?.id;
        const parsed = rawBookId ? Number(rawBookId) : NaN;
        return Number.isFinite(parsed) ? parsed : null;
    }, [bookData?.id]);
    
    useEffect(() => {
        setPosts([]);
        setPostsError(null);
        setPostsLoaded(false);
    }, [bookData?.id]);

    useEffect(() => {
        if (selectedSection !== "posts" || postsLoaded) return;
        if (!bookId) return;

        if (!Number.isFinite(bookId)) {
            setPostsError("No se pudieron cargar las reseñas.");
            setPostsLoaded(true);
            return;
        }

        let cancelled = false;
        setPostsLoading(true);
        setPostsError(null);

        getPostsByBook({ bookId, viewerId: user?.id })
            .then((posts) => {
                if (cancelled) return;
                setPosts(posts);
            })
            .catch((err) => {
                console.error(err);
                if (cancelled) return;
                setPostsError("No se pudieron cargar las reseñas.");
            })
            .finally(() => {
                if (cancelled) return;
                setPostsLoading(false);
                setPostsLoaded(true);
            });

        return () => {
            cancelled = true;
        };
    }, [selectedSection, postsLoaded, bookId, user?.id]);


    const handlePostDeleted = (deletedPostId: string) => {
        setPosts((prev) => prev.filter((post) => post.id !== deletedPostId));
    };

    const handleToggleLike = useToggleLike({ userId: user?.id, setPosts });

    const bookSnapshot = useMemo(() => {
        if (!bookData || !bookId) return null;
        return {
            id: String(bookId),
            title: bookData.title,
            author: bookData.contributions?.[0]?.author?.name || "Autor desconocido",
            coverUrl: bookData.image?.url || "/default-book-cover.png",
            slug: bookData.slug,
        };
    }, [bookData, bookId]);

    // handle loading and error states
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error al cargar el libro</div>;
    if (!data || !data.books?.length) {
        return <div>Libro no ha sido encontrado</div>;
    }

    return (
        <div>
            <div className="mb-4">
                <button
                    type="button"
                    onClick={() => {
                        if (from) {
                            navigate(from);
                            return;
                        }
                        navigate(-1);
                    }}
                    className="text-sm text-neutral-700 hover:text-neutral-900"
                >
                    ← Volver
                </button>
            </div>
            <div className="flex gap-6 relative">
                <img src={book?.cover} alt={book?.title} className="h-64 rounded-lg" />
                <div className="flex-1 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">{book?.title}</h1>
                        <p className="text-lg text-gray-700 mt-2">por {book?.author}</p>
                        <BookStatusSelect
                            bookId={bookId}
                            bookSnapshot={bookSnapshot}
                            userId={user?.id}
                        />
                    </div>
                </div>
                <div className="p-4 absolute right-0 top-1/2 -translate-y-1/2">
                    <StarRating rating={book?.rating ?? 0} />
                </div>
            </div>

            {/* Selection bar for Descripcion / Author / Reseñas */}
            <div className="mt-8 border-b border-neutral-200 pb-4">
                <button
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${
                    selectedSection === "descripcion"
                        ? "text-red-500"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                    onClick={() => setSelectedSection("descripcion")}
                >
                    Descripcion
                </button>
                <button
                    className={`ml-2 px-4 py-1.5 text-sm font-medium rounded-full transition ${
                    selectedSection === "author"
                        ? "text-red-500"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                    onClick={() => setSelectedSection("author")}
                >
                    Author
                </button>
                <button
                    className={`ml-2 px-4 py-1.5 text-sm font-medium rounded-full transition ${
                    selectedSection === "posts"
                        ? "text-red-500"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                    onClick={() => setSelectedSection("posts")}
                >
                    Reseñas
                </button>
            </div>
            {/* Content depending on selected section */}
            <div>
                {selectedSection === "descripcion" && (
                <section className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
                    <p className="text-gray-800 leading-relaxed">{book?.description}</p>
                </section>
                )}

                {selectedSection === "author" && (
                <section className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Autor</h2>
                    <p className="text-gray-800 leading-relaxed">
                    {book?.authorBio ||
                        `Información del autor ${book?.author} próximamente.`}
                    </p>
                </section>
                )}

                {selectedSection === "posts" && (
                <section className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Reseñas</h2>
                    {postsLoading && (
                        <>
                            <PostCardSkeleton />
                            <PostCardSkeleton />
                            <PostCardSkeleton />
                        </>
                    )}
                    {postsError && (
                        <p className="text-center text-sm text-red-500">{postsError}</p>
                    )}
                    {!postsLoading && !postsError && posts.length === 0 && (
                        <p className="text-center text-sm text-gray-500">
                            No hay reseñas para este libro.
                        </p>
                    )}
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onDelete={handlePostDeleted}
                                onToggleLike={handleToggleLike}
                                showBookInline={false}
                                commentCompact={true}
                            />
                        ))}
                    </div>
                </section>
                )}
            </div>
        </div>
    )
}
