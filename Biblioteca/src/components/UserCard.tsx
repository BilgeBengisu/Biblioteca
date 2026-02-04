import { Link } from "react-router-dom";
import defaultAvatar from "../assets/default-avatar.svg";
import type { UserResult } from "../types/Search";

type UserCardProps = {
  user: UserResult;
  className?: string;
};

export const UserCard = ({ user, className = "" }: UserCardProps) => {
  const hasProfile = Boolean(user.username);
  const primary = user.username ?? "Usuario";

  return (
    <Link
      to={hasProfile ? `/profile/${user.username}` : "#"}
      className={`flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
      onClick={(event) => {
        if (!hasProfile) event.preventDefault();
      }}
    >
      <img
        src={user.avatarUrl ?? defaultAvatar}
        alt="avatar"
        className="h-12 w-12 rounded-full object-cover bg-neutral-100"
        loading="lazy"
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-neutral-900 truncate">
          {primary}
        </p>
      </div>
    </Link>
  );
};
