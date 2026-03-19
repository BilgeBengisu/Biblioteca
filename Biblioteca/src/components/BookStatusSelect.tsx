import { useEffect, useRef, useState } from "react";
import { getUserBookByBookId, upsertUserBook } from "../services/userBooks";
import type { UserBookStatus, BookStatusSelectProps } from "../types/Book";

const OPTIONS: { value: UserBookStatus; label: string }[] = [
  { value: "want_to_read", label: "Quiero leer" },
  { value: "reading", label: "Leyendo" },
  { value: "finished", label: "Terminado" },
];

export const BookStatusSelect = ({
  bookId,
  bookSnapshot,
  userId,
}: BookStatusSelectProps) => {
  const [userBookStatus, setUserBookStatus] = useState<UserBookStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const canLoad = !!bookId && !!userId;

  useEffect(() => {
    if (!bookId || !userId) {
      setUserBookStatus(null);
      return;
    }

    let cancelled = false;
    setStatusLoading(true);
    setStatusError(null);

    getUserBookByBookId({ bookId, userId })
      .then((row) => {
        if (cancelled) return;
        setUserBookStatus(row?.status ?? null);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (nextStatus: UserBookStatus) => {
    if (!bookId || !userId || !bookSnapshot) return;
    setOpen(false);

    const previous = userBookStatus;
    setUserBookStatus(nextStatus);
    setStatusLoading(true);
    setStatusError(null);

    try {
      await upsertUserBook({ book: bookSnapshot, status: nextStatus });
    } catch (err) {
      console.error(err);
      setUserBookStatus(previous);
      setStatusError("No se pudo guardar tu estado.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!bookId || !userId || !bookSnapshot) return;

    const previous = userBookStatus;
    setUserBookStatus(null);
    setStatusLoading(true);
    setStatusError(null);

    try {
      await upsertUserBook({ book: bookSnapshot, status: null });
    } catch (err) {
      console.error(err);
      setUserBookStatus(previous);
      setStatusError("No se pudo guardar tu estado.");
    } finally {
      setStatusLoading(false);
    }
  };

  const selectedLabel = OPTIONS.find((o) => o.value === userBookStatus)?.label;
  const disabled = statusLoading || !canLoad;

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Estado de lectura</label>
      {userId ? (
        <div ref={containerRef} className="relative inline-block mt-1">
          {/* Trigger */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen((v) => !v)}
            className={`flex items-center justify-between w-48 border rounded px-3 py-2 text-sm disabled:opacity-50 ${
              userBookStatus
                ? "border-red-400 text-red-600 bg-red-50"
                : "border-neutral-300 text-neutral-500 bg-white"
            }`}
          >
            <span>{selectedLabel ?? "Quiero leer"}</span>
            {userBookStatus ? (
              <span
                role="button"
                onClick={handleRemove}
                className="ml-1 text-base text-red-400 hover:text-red-600 leading-none"
              >
                ×
              </span>
            ) : (
              <span className="text-neutral-400 text-xs">▾</span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <ul className="absolute left-0 mt-1 w-48 bg-white border border-neutral-200 rounded shadow-md z-10 py-1 text-sm">
              {OPTIONS.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  className={`px-3 py-1.5 cursor-pointer hover:bg-neutral-100 ${
                    userBookStatus === opt.value ? "text-red-600 font-medium" : "text-neutral-700"
                  }`}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="mt-1 text-sm text-gray-500">Inicia sesión para guardar tu estado.</p>
      )}
      {statusError && <p className="mt-1 text-xs text-red-500">{statusError}</p>}
    </div>
  );
};
