import targetIcon from "../assets/target-04-svgrepo-com.svg";

type Props = {
  goal: number | null;
  progress: number;
  isOwnProfile: boolean;
  isEditing: boolean;
  goalInput: string;
  goalSaving: boolean;
  goalSaveError: string | null;
  onEditClick: () => void;
  onGoalInputChange: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ReadingGoalWidget({
  goal,
  progress,
  isOwnProfile,
  isEditing,
  goalInput,
  goalSaving,
  goalSaveError,
  onEditClick,
  onGoalInputChange,
  onSave,
  onCancel,
}: Props) {
  const currentYear = new Date().getFullYear();

  if (isEditing) {
    return (
      <div className="text-sm space-y-2">
        <div className="flex items-center gap-2">
          <img src={targetIcon} alt="target" className="w-4 h-4 flex-shrink-0" />
          <input
            autoFocus
            type="number"
            min={1}
            value={goalInput}
            onChange={(e) => onGoalInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave();
              if (e.key === "Escape") onCancel();
            }}
            placeholder={goal ? String(goal) : "ej. 12"}
            className="w-24 rounded-md border border-neutral-300 dark:border-neutral-600 bg-transparent px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
          <span className="text-neutral-500">libros en {currentYear}</span>
        </div>
        {goalSaveError && <p className="text-xs text-red-500 pl-5">{goalSaveError}</p>}
        <div className="flex gap-2 pl-5">
          <button
            onClick={onSave}
            disabled={goalSaving || !goalInput}
            className="text-xs px-2.5 py-1 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-50"
          >
            {goalSaving ? "Guardando…" : "Guardar"}
          </button>
          <button
            onClick={onCancel}
            className="text-xs px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  if (!goal) {
    if (!isOwnProfile) return null;
    return (
      <button onClick={onEditClick} className="text-sm text-neutral-400 hover:text-neutral-600">
        + Establecer meta de lectura para {currentYear}
      </button>
    );
  }

  const pct = Math.min(Math.round((progress / goal) * 100), 100);

  return (
    <div
      className={`text-sm space-y-1 ${isOwnProfile ? "cursor-pointer group" : ""}`}
      onClick={isOwnProfile ? onEditClick : undefined}
    >
      <div className="flex items-center justify-between">
        <span className="text-neutral-600 flex items-center gap-1">
          <img src={targetIcon} alt="target" className="w-4 h-4" />
          {currentYear} Meta de Lectura:{" "}
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {progress} / {goal} libros
          </span>
        </span>
        {isOwnProfile && (
          <span className="text-xs text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Editar
          </span>
        )}
      </div>
      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
        <div
          className="bg-red-500 dark:bg-neutral-200 h-1.5 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
