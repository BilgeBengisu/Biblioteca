import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { SEARCH_BOOKS_POPULARITY, SEARCH_BOOKS_TRENDING, SEARCH_BOOKS_SHUFFLE, GET_BOOKS_BY_IDS } from '../queries/queries';
import type { BooksData } from '../types/Book';

export type SortOption = 'tendencias' | 'aleatorio' | 'popular';

export function useBookSort(sortOrder: SortOption) {
    const now = new Date();
    const to = now.toISOString().split('T')[0];
    const from = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];

    const popularity = useQuery<BooksData>(SEARCH_BOOKS_POPULARITY, {
        skip: sortOrder !== 'popular',
        variables: { limit: 100, offset: 0 },
    });
    const trending = useQuery<BooksData>(SEARCH_BOOKS_TRENDING, {
        skip: sortOrder !== 'tendencias',
        variables: { from, to, limit: 100, offset: 0 },
    });
    const shuffle = useQuery<BooksData>(SEARCH_BOOKS_SHUFFLE, { skip: sortOrder !== 'aleatorio' });

    // mapping trending books data because it is stored differently in Graphql than the books table
    const trendingIds = trending.data?.books_trending?.ids ?? [];
    const trendingBooks = useQuery<BooksData>(GET_BOOKS_BY_IDS, {
        skip: sortOrder !== 'tendencias' || trendingIds.length === 0,
        variables: { ids: trendingIds },
    });

    const books = useMemo(() => {
        if (sortOrder === 'tendencias') return trendingBooks.data?.books ?? [];
        if (sortOrder === 'popular') return popularity.data?.books ?? [];
        return shuffle.data?.books ?? [];
    }, [sortOrder, trendingBooks.data, popularity.data, shuffle.data]);

    const loading = { tendencias: trending.loading || trendingBooks.loading, popular: popularity.loading, aleatorio: shuffle.loading }[sortOrder];
    const error = { tendencias: trending.error || trendingBooks.error, popular: popularity.error, aleatorio: shuffle.error }[sortOrder];

    return { books, loading, error };
}
