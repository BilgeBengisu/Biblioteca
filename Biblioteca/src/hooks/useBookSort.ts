import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { SEARCH_BOOKS_POPULARITY, SEARCH_BOOKS_TRENDING, SEARCH_BOOKS_SHUFFLE } from '../queries/queries';
import type { BookData, BooksData } from '../types/Book';

export type SortOption = 'tendencias' | 'aleatorio' | 'popularidad';

export function useBookSort(sortOrder: SortOption) {
    const popularity = useQuery<BooksData>(SEARCH_BOOKS_POPULARITY, { skip: sortOrder !== 'popularidad' });
    const trending = useQuery<BooksData>(SEARCH_BOOKS_TRENDING, { skip: sortOrder !== 'tendencias' });
    const shuffle = useQuery<BooksData>(SEARCH_BOOKS_SHUFFLE, { skip: sortOrder !== 'aleatorio' });

    const { data, loading, error } = sortOrder === 'popularidad'
        ? popularity
        : sortOrder === 'tendencias'
        ? trending
        : shuffle;

    const books: BookData[] = useMemo(() => data?.books ?? [], [data]);

    return { books, loading, error };
}
