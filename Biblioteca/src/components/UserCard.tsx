import { Link } from "react-router-dom";
import defaultAvatar from "../assets/default-avatar.svg";
import type { UserResult } from "../types/Search";

type UserCardProps = {
  user: UserResult;
  className?: string;
};

export const UserCard = ({ user, className = "" }: UserCardProps) => {
  const hasProfile = Boolean(user.username);
  const name = user.username ?? "Usuario";

  return (
    <Link
      to={hasProfile ? `/profile/${user.username}` : "#"}
      className={`flex items-center gap-4 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
      onClick={(e) => { if (!hasProfile) e.preventDefault(); }}
    >
      <img
        src={user.avatarUrl ?? defaultAvatar}
        alt={name}
        className="h-11 w-11 rounded-full object-cover bg-neutral-100 shrink-0"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-neutral-900 truncate">{name}</p>
        {hasProfile && (
          <p className="text-xs text-neutral-400 truncate">Ver perfil</p>
        )}
      </div>
      {hasProfile && (
        <svg
          className="h-4 w-4 text-neutral-300 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  );
};
