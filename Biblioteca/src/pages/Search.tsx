import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import type { SearchType } from "../types/Search";
import { SearchControls } from "../components/SearchControls";
import { SearchResults } from "../components/SearchResults";
import { useSearch } from "../hooks/useSearch";

function parseScope(value: string | null): SearchType {
  return value === "users" ? "users" : "books";
}

export const Search = () => {
  const [params, setParams] = useSearchParams();

  const scope = useMemo(() => parseScope(params.get("scope")), [params]);
  const query = params.get("q") ?? "";

  // Live search: hook runs whenever scope/query changes
  const { state, canSearch } = useSearch(scope, query);

  return (
    <main className="search-page">
      <h1>Buscar</h1>

      <SearchControls
        scope={scope}
        query={query}
        onScopeChange={(s) => setParams({ scope: s, q: query })}
        onQueryChange={(q) => setParams({ scope, q })}
      />
      <SearchResults state={state} />
    </main>
  );
};
