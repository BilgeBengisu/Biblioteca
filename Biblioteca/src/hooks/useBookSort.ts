import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_BOOKS } from '../queries/queries';
import type { BookData, BooksData } from '../types/Book';

export type SortOption = 'tendencias' | 'aleatorio' | 'popularidad';

export function useBookSort(sortOrder: SortOption) {
    const { data, loading, error } = useQuery<BooksData>(GET_BOOKS);
    const books: BookData[] = data?.books ?? [];

    const sortedBooks = useMemo(() => {
        switch (sortOrder) {
            case 'popularidad':
                return books;
            case 'aleatorio':
                return books;
            case 'tendencias':
                return books;
            default:
                return books;
        }
    }, [books, sortOrder]);

    return { books: sortedBooks, loading, error };
}
