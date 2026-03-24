import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import type { SearchType } from "../types/Search";
import { SearchControls } from "../components/SearchControls";
import { SearchResults } from "../components/SearchResults";
import { useSearch } from "../hooks/useSearch";

function parseScope(value: string | null): SearchType {
  return value === "users" ? "users" : "books";
}

/**
 * Controls UI for searching books and users
 * useSearch hook handles debounced search logic and state management, 
 * while this component manages URL params and renders controls/results
 */

export const Search = () => {
  const [params, setParams] = useSearchParams();

  const scope = useMemo(() => parseScope(params.get("scope")), [params]);
  const query = params.get("q") ?? "";

  // Live search: hook runs whenever scope/query changes
  const { state } = useSearch(scope, query);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-10 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Busca Libros o Usuarios</h1>
      </div>

      <SearchControls
        scope={scope}
        query={query}
        onScopeChange={(s) => setParams({ scope: s, q: query })}
        onQueryChange={(q) => setParams({ scope, q })}
      />
      <div className="mt-6 mb-10 px-4 sm:px-6 lg:px-8">
        <SearchResults state={state} scope={scope} />
      </div>
    </main>
  );
};
