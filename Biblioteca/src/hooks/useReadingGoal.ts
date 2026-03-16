import { useEffect, useState } from "react";
import type { ReadingGoalRow } from "../types/Profile";
import { getReadingGoal, getFinishedBooksCount, upsertReadingGoal } from "../services/profiles";

export function useReadingGoal(userId?: string, year?: number) {
    const [goal, setGoal] = useState<ReadingGoalRow | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [goalLoading, setGoalLoading] = useState(false);
    const [goalError, setGoalError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [goalInput, setGoalInput] = useState("");
    const [goalSaving, setGoalSaving] = useState(false);
    const [goalSaveError, setGoalSaveError] = useState<string | null>(null);

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

    async function saveGoal() {
        if (!userId || !year) return;
        const target = parseInt(goalInput, 10);
        if (!target || target < 1) return;
        setGoalSaving(true);
        setGoalSaveError(null);
        try {
            const updated = await upsertReadingGoal(userId, year, target);
            setGoal(updated);
            setIsEditing(false);
        } catch (err) {
            setGoalSaveError(err instanceof Error ? err.message : "Error al guardar la meta.");
        } finally {
            setGoalSaving(false);
        }
    }

    function cancelEditing() {
        setIsEditing(false);
        setGoalInput("");
    }

    return {
        goal,
        progress,
        goalLoading,
        goalError,
        isEditing,
        goalInput,
        goalSaving,
        goalSaveError,
        onEditClick: () => setIsEditing(true),
        onGoalInputChange: setGoalInput,
        onSave: saveGoal,
        onCancel: cancelEditing,
    };
}