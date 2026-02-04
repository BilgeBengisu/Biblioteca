import { useEffect, useMemo, useState } from "react";
import type { SearchType, SearchState } from "../types/Search";
import { searchBooks, searchUsers } from "../services/search";

export function useSearch(scope: SearchType, query: string) {
  const [state, setState] = useState<SearchState>({ status: "idle" });

  const canSearch = useMemo(() => query.trim().length >= 1, [query]);

  useEffect(() => {
    if (!canSearch) {
      setState({ status: "idle" });
      return;
    }

    const controller = new AbortController();
    setState({ status: "loading" });

    (async () => {
      try {
        const q = query.trim();
        const items =
          scope === "books"
            ? await searchBooks(q, controller.signal)
            : await searchUsers(q, controller.signal);

        setState({ status: "success", scope, items });
      } catch (err: any) {
        // Ignore abort errors
        if (err?.name === "AbortError") return;
        setState({ status: "error", message: err?.message ?? "Search failed" });
      }
    })();

    return () => controller.abort();
  }, [scope, query, canSearch]);

  return { state, canSearch };
}
