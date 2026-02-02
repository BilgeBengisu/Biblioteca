import { ProfileTabs } from "./ProfileTabs";
import { useMemo, useState } from "react";
import type { UserBookRow } from "../types/Profile";
import type { Post, PostBook } from "../types/Post";
import { BookInlineCard } from "./BookInlineCard";
import { PostCard } from "./PostCard";

export type ProfileTab = "library" | "posts";
type LibraryView = "want_to_read" | "reading" | "finished";

export const ProfileTabView = ({
  activeTab,
  onChange,
  library,
  libraryLoading,
  libraryError,
  posts,
  postsLoading,
  postsError,
  onPostDeleted,
}: {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
  library: {
    want_to_read: UserBookRow[];
    reading: UserBookRow[];
    finished: UserBookRow[];
  };
  libraryLoading: boolean;
  libraryError: string | null;
  posts: Post[];
  postsLoading: boolean;
  postsError: string | null;
  onPostDeleted: (deletedPostId: string) => void;
}) => {
  const [libraryView, setLibraryView] = useState<LibraryView>("reading");

  const counts = {
    want_to_read: library.want_to_read.length,
    reading: library.reading.length,
    finished: library.finished.length,
  };

  const rowsToShow = useMemo<UserBookRow[]>(() => {
    switch (libraryView) {
        case "want_to_read":
            return library.want_to_read;
        case "reading":
            return library.reading;
        case "finished":
            return library.finished;
    }
  }, [libraryView, library.want_to_read, library.reading, library.finished]); // only rerun if these values change

  const viewLabel = (v: LibraryView) => {
    switch (v) {
      case "want_to_read":
        return "Quiero leer";
      case "reading":
        return "Leyendo";
      case "finished":
        return "Terminado";
    }
  };

  return (
    <div>
      <ProfileTabs activeTab={activeTab} onChange={onChange} />

      <div className="mt-4">
        {activeTab === "library" ? (
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Mi biblioteca</h2>
            </div>

            {/* Status view selector */}
            <div className="flex flex-wrap gap-2">
            {(["want_to_read", "reading", "finished"] as const).map((v) => {
                const active = libraryView === v;
                return (
                <button
                    key={v}
                    type="button"
                    onClick={() => setLibraryView(v)}
                    className={[
                    "px-3 py-1.5 rounded-full text-sm border transition",
                    active
                        ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                        : "bg-transparent text-neutral-700 border-neutral-200 hover:bg-neutral-50 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800",
                    ].join(" ")}
                >
                    {viewLabel(v)}{" "}
                    <span className="opacity-70">({counts[v]})</span>
                </button>
                );
            })}
            </div>

            {libraryLoading ? (
              <p className="text-sm text-neutral-600">Cargando biblioteca…</p>
            ) : libraryError ? (
              <p className="text-sm text-red-600">{libraryError}</p>
            ) : rowsToShow.length === 0 ? (
              <p className="text-sm text-neutral-600">
                No hay libros en “{viewLabel(libraryView)}”.
              </p>
            ) : (
                <ul className="space-y-3">
                    {rowsToShow.map((ub) => {
                    const book = ub.book_data as PostBook | null;
                    if (!book) return null;

                    return (
                        <li key={ub.id}>
                        <BookInlineCard
                            book={book}
                            rightSlot={
                            ub.status === "finished" && ub.rating != null ? (
                                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                Tu calificación: {ub.rating}/5
                                </span>
                            ) : null
                            }
                        />
                        </li>
                    );
                    })}
                </ul>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="text-lg font-semibold">Mis publicaciones</h2>
            <div className="mt-3 space-y-3">
              {postsLoading ? (
                <p className="text-sm text-neutral-600">Cargando publicaciones…</p>
              ) : postsError ? (
                <p className="text-sm text-red-600">{postsError}</p>
              ) : posts.length === 0 ? (
                <p className="text-sm text-neutral-600">No hay publicaciones todavía.</p>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} onDelete={onPostDeleted} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
