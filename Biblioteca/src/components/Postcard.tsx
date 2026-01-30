import type { Post } from "../types/Post";
import default_avatar from "../assets/default-avatar.svg";
import { useNavigate } from "react-router-dom";

type PostCardProps = {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => {
  const { author, type, content, status, book, created_at } = post;
  const navigate = useNavigate();

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <img
          src={author.avatarUrl ?? default_avatar}
          alt={author.username}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium">{author.username}</p>
          <span className="text-xs text-neutral-500">
            {new Date(created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Post Body */}
      <div className="space-y-2">
        {/* For text-only posts */}
        {type === "text" && <p className="text-sm">{content}</p>}

        {/* For status or review posts with book */}
        {(type === "status" || type === "review") && (
          <div className="flex flex-col gap-2">
            {/* Status */}
            {type === "status" && status && (
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {status === "want_to_read" && "Quiere Leer"}
                {status === "reading" && "Leyendo"}
                {status === "finished" && "Leído"}
              </span>
            )}
            {/* Status */}
            {type === "review" && (
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Compartió sobre
              </span>
            )}

            {/* Book display */}
            {book && (
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => book.slug && navigate(`/books/${book.slug}`)}
              >
                {book.coverUrl && (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded shadow-sm"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{book.title}</h3>
                  {book.author && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      por {book.author}
                    </p>
                  )}
                </div>
              </div>
            )}
            {/* Status or Review Content */}
            {content && <p className="text-sm">{content}</p>}
          </div>
        )}
      </div>
    </article>
  );
};
