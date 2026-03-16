import { useEffect, useState } from "react";
import type { ReadingGoalRow } from "../types/Profile";
import { getReadingGoal, getFinishedBooksCount } from "../services/profiles";

export function useReadingGoal(userId?: string, year?: number) {
    const [goal, setGoal] = useState<ReadingGoalRow | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [goalLoading, setGoalLoading] = useState(false);
    const [goalError, setGoalError] = useState<string | null>(null);
    useEffect(() => {
        if (!userId || !year) return;

        let alive = true;
        setGoalLoading(true);
        setGoalError(null);

        (async () => {
            try {
                const [data, count] = await Promise.all([
                    getReadingGoal(userId, year),
                    getFinishedBooksCount(userId, year),
                ]);
                if (alive) {
                    setGoal(data);
                    setProgress(count);
                }
            }
            catch (err) {
                if (alive) setGoalError(err instanceof Error ? err.message : "Error al cargar la meta de lectura.");
            }
            finally {
                if (alive) setGoalLoading(false);
            }
        })();

        return () => { alive = false; };
    }, [userId, year]);

    return { goal, setGoal, progress, goalLoading, goalError };
}