import { useEffect, useMemo, useState } from "react";
import { getUserBookByBookId, upsertUserBook } from "../services/userBooks";
import type { UserBookStatus, BookStatusSelectProps } from "../types/Book";

export const BookStatusSelect = ({
  bookId,
  bookSnapshot,
  userId,
}: BookStatusSelectProps) => {
  const [userBookStatus, setUserBookStatus] = useState<UserBookStatus | "remove">("want_to_read");
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [hasUserBook, setHasUserBook] = useState<boolean>(false);

  const canLoad = useMemo(() => !!bookId && !!userId, [bookId, userId]);

  useEffect(() => {
    if (!bookId || !userId) {
      setUserBookStatus("want_to_read");
      setHasUserBook(false);
      return;
    }

    let cancelled = false;
    setStatusLoading(true);
    setStatusError(null);

    getUserBookByBookId({ bookId, userId })
      .then((row) => {
        if (cancelled) return;
        setUserBookStatus(row ? row.status ?? "remove" : "want_to_read");
        setHasUserBook(!!row);
      })
      .catch((err) => {
        console.error(err);
        if (cancelled) return;
        setStatusError("No se pudo cargar tu estado de lectura.");
      })
      .finally(() => {
        if (cancelled) return;
        setStatusLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [bookId, userId]);

  const handleStatusChange = async (nextStatus: UserBookStatus | "remove") => {
    if (!bookId || !userId || !bookSnapshot) return;

    setUserBookStatus(nextStatus);
    setStatusLoading(true);
    setStatusError(null);

    try {
      if (nextStatus === "remove") {
        await upsertUserBook({ book: bookSnapshot, status: null }); // reset the reading status
        setHasUserBook(true);
      } else {
        await upsertUserBook({ book: bookSnapshot, status: nextStatus });
        setHasUserBook(true);
      }
    } catch (err) {
      console.error(err);
      setStatusError("No se pudo guardar tu estado.");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Estado de lectura</label>
      {userId ? (
        <select
          value={userBookStatus}
          onChange={(e) => handleStatusChange(e.target.value as UserBookStatus | "remove")}
          disabled={statusLoading || !canLoad}
          className={`mt-1 w-48 border rounded px-2 py-1.5 text-sm ${
            hasUserBook ? "border-red-500 text-red-600" : "border-neutral-300 text-neutral-800"
          }`}
        >
          <option value="want_to_read">Quiero leer</option>
          <option value="reading">Leyendo</option>
          <option value="finished">Terminado</option>
          {hasUserBook && <option value="remove">Quitar</option>}
        </select>
      ) : (
        <p className="mt-1 text-sm text-gray-500">Inicia sesión para guardar tu estado.</p>
      )}
      {statusError && <p className="mt-1 text-xs text-red-500">{statusError}</p>}
    </div>
  );
};
