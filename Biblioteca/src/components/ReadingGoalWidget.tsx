import targetIcon from "../assets/target-04-svgrepo-com.svg";

type Props = {
  goal: number | null;       // target for this year
  progress: number;          // books finished this year
  isOwnProfile: boolean;
  onEditClick: () => void;
};

export function ReadingGoalWidget({ goal, progress, isOwnProfile, onEditClick }: Props) {
  const currentYear = new Date().getFullYear();

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
    <div className="text-sm space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-neutral-600 flex items-center gap-1">
          <img src={targetIcon} alt="target" className="w-4 h-4" />
          {currentYear} Meta de Lectura: <span className="font-medium text-neutral-900 dark:text-neutral-100">{progress} / {goal} libros</span>
        </span>
        {/* {isOwnProfile && (
          <button onClick={onEditClick} className="text-xs text-neutral-400 hover:text-neutral-600">
            Editar
          </button>
        )} */}
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
