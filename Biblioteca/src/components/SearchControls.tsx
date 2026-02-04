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
              "px-4 py-2 text-sm rounded-lg transition",
              active
                ? "bg-neutral-100 dark:bg-neutral-800 font-medium"
                : "hover:bg-neutral-50 dark:hover:bg-neutral-800",
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
        />
      </form>
    </div>
  );
}
