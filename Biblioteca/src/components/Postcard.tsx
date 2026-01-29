import type { Post } from "../types/Post";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { author, content, createdAt, status, book } = post;

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={author.avatarUrl ?? "/avatar.png"}
            alt={author.username}
            className="h-8 w-8 rounded-full"
          />

          <div>
            <p className="text-sm font-medium">{author.username}</p>
            <p className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {status && (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs">
            {status.replaceAll("_", " ")}
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-gray-800 whitespace-pre-line">
        {content}
      </p>

      {/* Book Preview */}
      {book && (
        <div className="flex gap-4 rounded-xl bg-gray-50 p-3">
          {book.coverUrl && (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="h-20 w-14 rounded-md object-cover"
            />
          )}

          <div>
            <p className="text-sm font-semibold">{book.title}</p>
            <p className="text-xs text-gray-600">{book.author}</p>
          </div>
        </div>
      )}
    </article>
  );
};
