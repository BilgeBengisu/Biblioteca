import { useState, useEffect } from "react";
import { getUserBooksByUserId } from "../services/profiles";
import type { UserBookRow } from "../types/Profile";

export function useLibrary(profileId: string | undefined, enabled: boolean) {
    const [library, setLibrary] = useState<{
        want_to_read: UserBookRow[];
        reading: UserBookRow[];
        finished: UserBookRow[];
    }>({
        want_to_read: [],
        reading: [],
        finished: [],
    });
    const [libraryLoading, setLibraryLoading] = useState(false);
    const [libraryError, setLibraryError] = useState<string | null>(null);
    
    // useEffect to load library tab on mounting (the library tab is default)
    useEffect(() => {
        if (!enabled) return;
        if (!profileId) return;

        let isMounted = true;

        setLibraryLoading(true);
        setLibraryError(null);

        (async () => {
            try {
                const rows = await getUserBooksByUserId(profileId);
                const grouped = {
                want_to_read: rows.filter((r) => r.status === "want_to_read"),
                reading: rows.filter((r) => r.status === "reading"),
                finished: rows.filter((r) => r.status === "finished"),
                };
                if (isMounted) setLibrary(grouped);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Error al cargar la biblioteca.";
                if (isMounted) setLibraryError(message);
            } finally {
                if (isMounted) setLibraryLoading(false);
            }
        })();

        // if the page is unmounted, react runs this cleanup
        return () => { isMounted = false; };
    }, [enabled, profileId]);



    return { library, libraryLoading, libraryError };
}