import type { SearchType } from "../types/Search";

type Props = {
  scope: SearchType;
  query: string;
  onScopeChange: (s: SearchType) => void;
  onQueryChange: (q: string) => void;
  onSubmit?: () => void; // optional for future to “submit to search” instead of live search
};

export function SearchControls({
  scope,
  query,
  onScopeChange,
  onQueryChange,
  onSubmit,
}: Props) {

  const scopes: SearchType[] = ["books", "users"];
  return (
    <div className="search-controls">
      <div className="flex gap-2">
      {scopes.map((v) => {
        const active = scope === v;

        return (
          <button
            key={v}
            type="button"
            onClick={() => onScopeChange(v)}
            className={[
              "px-3 py-1.5 rounded-full text-sm border transition",
              active
                ? "bg-red-600 text-white border-red-600"
                : "bg-transparent text-neutral-700 border-neutral-200 hover:bg-neutral-50 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800",
            ].join(" ")}
            aria-pressed={active}
          >
            {v === "books" ? "Libros" : "Usuarios"}
          </button>
        );
      })}
    </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
        className="search-form"
      >
        <input
          type="search"
          placeholder={scope === "books" ? "Buscar libros..." : "Buscar usuarios..."}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search query"
          className="border border-black rounded px-3 py-2 w-full focus:outline-none"
        />
      </form>
    </div>
  );
}
