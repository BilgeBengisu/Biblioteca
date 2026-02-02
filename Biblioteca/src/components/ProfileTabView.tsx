import { ProfileTabs } from "./ProfileTabs";
import type { UserBookRow } from "../services/userBooks";

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
              <div className="space-y-6">
                <section>
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Quiero leer</h3>
                  <ul className="mt-2 space-y-2">
                    {library.want_to_read.map((ub) => (
                      <li key={ub.id} className="text-sm text-neutral-700 dark:text-neutral-200">
                        {ub.book_data?.title ?? `Book ${ub.book_id}`}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Leyendo</h3>
                  <ul className="mt-2 space-y-2">
                    {library.reading.map((ub) => (
                      <li key={ub.id} className="text-sm text-neutral-700 dark:text-neutral-200">
                        {ub.book_data?.title ?? `Book ${ub.book_id}`}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Terminado</h3>
                  <ul className="mt-2 space-y-2">
                    {library.finished.map((ub) => (
                      <li key={ub.id} className="text-sm text-neutral-700 dark:text-neutral-200">
                        {ub.book_data?.title ?? `Book ${ub.book_id}`}
                      </li>
                    ))}
                  </ul>
                </section>
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
