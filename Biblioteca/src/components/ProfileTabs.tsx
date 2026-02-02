type ProfileTab = "library" | "posts";

export const ProfileTabs = ({
  activeTab,
  onChange,
}: {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}) => {
  return (
    <div className="inline-flex rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-1">
      <button
        type="button"
        onClick={() => onChange("library")}
        className={`px-4 py-2 text-sm rounded-lg transition ${
          activeTab === "library"
            ? "bg-neutral-100 dark:bg-neutral-800 font-medium"
            : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
        }`}
      >
        Biblioteca
      </button>

      <button
        type="button"
        onClick={() => onChange("posts")}
        className={`px-4 py-2 text-sm rounded-lg transition ${
          activeTab === "posts"
            ? "bg-neutral-100 dark:bg-neutral-800 font-medium"
            : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
        }`}
      >
        Publicaciones
      </button>
    </div>
  );
};
