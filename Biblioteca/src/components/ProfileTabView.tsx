import { ProfileTabs } from "./ProfileTabs";
import type { UserBookRow } from "../services/userBooks";
import type { PostBook } from "../types/Post";
import { BookInlineCard } from "./BookInlineCard";

export type ProfileTab = "library" | "posts";

export const ProfileTabView = ({
  activeTab,
  onChange,
  library,
  libraryLoading,
  libraryError,
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
}) => {
  return (
    <div>
      <ProfileTabs activeTab={activeTab} onChange={onChange} />

      <div className="mt-4">
        {activeTab === "library" ? (
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Mi biblioteca</h2>
              <p className="text-sm text-neutral-600 mt-1">
                Quiero leer: {library.want_to_read.length} · Leyendo: {library.reading.length} · Terminado:{" "}
                {library.finished.length}
              </p>
            </div>

            {libraryLoading ? (
              <p className="text-sm text-neutral-600">Cargando biblioteca…</p>
            ) : libraryError ? (
              <p className="text-sm text-red-600">{libraryError}</p>
            ) : (
                <div>
                    {library.want_to_read.map((ub) => {
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
                </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="text-lg font-semibold">Mis publicaciones</h2>
            <p className="text-sm text-neutral-600 mt-2">
              (Próximo paso) Cargaremos posts cuando abras esta pestaña.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
