type FeedFilter = "all" | "following";

const feedLabel = (v: FeedFilter) => {
  switch (v) {
    case "all":
      return "Todos";
    case "following":
      return "Siguiendo";
  }
};

export const PostsFilterTabs = ({
  filter,
  onChange,
  userLoggedIn,
}: {
  filter: FeedFilter;
  onChange: (filter: FeedFilter) => void;
  userLoggedIn: boolean;
}) => {
  return (
    <div className="inline-flex rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-1">
      {(["all", "following"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          disabled={v === "following" && !userLoggedIn}
          className={[
            "px-4 py-2 text-sm rounded-lg transition",
            filter === v
              ? "bg-red-100 dark:bg-neutral-800 font-medium"
              : "hover:bg-neutral-50 dark:hover:bg-neutral-800",
            v === "following" && !userLoggedIn ? "opacity-50 cursor-not-allowed" : "",
          ].join(" ")}
        >
          {feedLabel(v)}
        </button>
      ))}
    </div>
  );
};
