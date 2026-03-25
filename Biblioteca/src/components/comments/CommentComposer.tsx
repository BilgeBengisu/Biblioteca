import { useState } from "react";

const MAX_LENGTH = 250;

type CommentComposerProps = {
  onSubmit: (content: string) => Promise<void> | void;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  submitLabel?: string;
  disabled?: boolean;
};

export const CommentComposer = ({
  onSubmit,
  onCancel,
  initialValue = "",
  placeholder = "Escribe un comentario...",
  autoFocus = false,
  submitLabel = "Publicar",
  disabled = false,
}: CommentComposerProps) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = content.trim().length > 0 && content.length <= MAX_LENGTH && !isSubmitting && !disabled;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={3}
        maxLength={MAX_LENGTH}
        className="w-full rounded-lg border border-neutral-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
      />
      <div className="flex items-center justify-end gap-2">
        <p className={`text-xs ${content.length > MAX_LENGTH * 0.9 ? "text-red-500" : "text-neutral-400"}`}>
          {content.length}/{MAX_LENGTH}
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600 disabled:opacity-50"
        >
          {isSubmitting ? "Publicando..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
