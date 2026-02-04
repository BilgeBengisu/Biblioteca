import { useParams } from "react-router-dom";
import type { BooksData } from "../types/Book";
import { useQuery } from "@apollo/client/react";
import { GET_BOOK_BY_SLUG } from "../queries/queries";
import { useState } from "react";
import { StarRating } from "../components/StarRating";

export const BookView = () => {
    const { id } = useParams<{ id: string }>();
    // for returning to previous page
    //const navigate = useNavigate();

    // finding the book to display using the id param (slug)
    const { data, loading, error } = useQuery<BooksData>(GET_BOOK_BY_SLUG, {
        variables: { slug: id },
        skip: !id,
    });

    // filter view for sections
    const [selectedSection, setSelectedSection] = useState<
        "descripcion" | "author" | "criticas"
    >("descripcion");

    // handle loading and error states
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error al cargar el libro</div>;
    if (!data || !data.books?.length) {
        return <div>Libro no ha sido encontrado</div>;
    }
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
    
    if (!data) {
        return <div>Libro no ha sido encontrado</div>;
    }


    return (
        <div>
            <div className="flex gap-6 relative">
                <img src={book?.cover} alt={book?.title} className="h-64 rounded-lg" />
                <div className="flex-1 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">{book?.title}</h1>
                        <p className="text-lg text-gray-700 mt-2">por {book?.author}</p>
                    </div>
                </div>
                {/* TO BE COMPLETED */}
                <div className="p-4 absolute right-0 top-1/2 -translate-y-1/2">
                    <StarRating rating={book?.rating ?? 0} />
                </div>
            </div>

            {/* Selection bar for Descripcion / Author / Criticas */}
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
                    selectedSection === "criticas"
                        ? "text-red-500"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                    onClick={() => setSelectedSection("criticas")}
                >
                    Criticas
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
                    {(book as any).authorBio ||
                        `Información del autor ${book?.author} próximamente.`}
                    </p>
                </section>
                )}
            </div>
        </div>
    )
}
