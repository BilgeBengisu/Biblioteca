import { useEffect, useRef, useState } from "react";
import type { ProfileRow } from "../types/Profile";
import { uploadAvatar } from "../services/storage";

type EditProfileFormProps = {
  profile: ProfileRow;
  userId: string;
  avatarBucket: string;
  currentAvatarUrl: string | null;
  onCancel: () => void;
  onSaved: (updated: ProfileRow) => void;
  updateProfile: (
    userId: string,
    updates: {
      username: string | null;
      bio: string | null;
      reading_goal: number | null;
      avatar_url?: string | null;
    }
  ) => Promise<ProfileRow>;
};

export const EditProfileForm = ({
  profile,
  userId,
  avatarBucket,
  currentAvatarUrl,
  onCancel,
  onSaved,
  updateProfile,
}: EditProfileFormProps) => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [readingGoal, setReadingGoal] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string }>({});

  // Prefill when component mounts / profile changes
  useEffect(() => {
    setUsername(profile.username ?? "");
    setBio(profile.bio ?? "");
    setReadingGoal(profile.reading_goal != null ? String(profile.reading_goal) : "");
    setErrorMsg(null);
    setFieldErrors({});
  }, [profile]);

  const mapProfileError = (message: string) => {
    const lower = message.toLowerCase();
    if (
      lower.includes("profiles_username_lower_idx") ||
      (lower.includes("duplicate key value") && lower.includes("username"))
    ) {
      return { fieldErrors: { username: "Ese nombre de usuario ya está en uso." } };
    }
    return { general: message };
  };

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    if (!["image/jpeg", "image/png"].includes(avatarFile.type)) {
      setErrorMsg("Solo se permiten imágenes JPG o PNG.");
      setAvatarFile(null);
      return;
    }

    setIsUploadingAvatar(true);
    setErrorMsg(null);
    setFieldErrors({});

    try {
        const { publicUrl } = await uploadAvatar(avatarBucket, userId, avatarFile);

        const updated = await updateProfile(userId, {
            username: username.trim() || null,
            bio: bio.trim() || null,
            reading_goal: readingGoal.trim() ? Number(readingGoal) : null,
            avatar_url: publicUrl,
        });

        onSaved(updated);
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Error al subir el avatar.";
        const mapped = mapProfileError(msg);
        if (mapped.fieldErrors) {
          setFieldErrors(mapped.fieldErrors);
        } else {
          setErrorMsg(mapped.general ?? msg);
        }
    } finally {
        setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentAvatarUrl) return;

    setIsRemovingAvatar(true);
    setErrorMsg(null);
    setFieldErrors({});

    try {
      const updated = await updateProfile(userId, {
        username: username.trim().length ? username.trim() : null,
        bio: bio.trim().length ? bio.trim() : null,
        reading_goal: readingGoal.trim().length ? Number(readingGoal) : null,
        avatar_url: null,
      });

      setAvatarFile(null);
      onSaved(updated);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al eliminar la foto de perfil.";
      const mapped = mapProfileError(msg);
      if (mapped.fieldErrors) {
        setFieldErrors(mapped.fieldErrors);
      } else {
        setErrorMsg(mapped.general ?? msg);
      }
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  // error messages for invalid inputs
  const validate = () => {
    if (username.trim().length > 0) {
      const u = username.trim();
      if (u.length < 3 || u.length > 30) return "El nombre de usuario debe tener entre 3 y 30 caracteres.";
      if (!/^[a-zA-Z0-9_]+$/.test(u)) return "El nombre de usuario solo puede contener letras, números y guiones bajos.";
    }
    if (bio.length > 500) return "La biografía debe tener 500 caracteres o menos.";
    if (readingGoal.trim().length > 0) {
      const n = Number(readingGoal);
      if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) {
        return "El objetivo de lectura debe ser un número entero (0 o más).";
      }
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    setFieldErrors({});

    try {
      const updated = await updateProfile(userId, {
        username: username.trim().length ? username.trim() : null,
        bio: bio.trim().length ? bio.trim() : null,
        reading_goal: readingGoal.trim().length ? Number(readingGoal) : null,
      });

      onSaved(updated);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al guardar el perfil.";
      const mapped = mapProfileError(msg);
      if (mapped.fieldErrors) {
        setFieldErrors(mapped.fieldErrors);
      } else {
        setErrorMsg(mapped.general ?? msg);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {errorMsg && (
        <div className="text-sm text-red-600 border border-red-200 dark:border-red-900 rounded-lg p-2">
          {errorMsg}
        </div>
      )}
      <div className="space-y-2">
        <label className="text-sm text-neutral-700 dark:text-neutral-200">Foto de Perfil</label>

        <div className="flex items-center gap-3">

            <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
                      setErrorMsg("Solo se permiten imágenes JPG o PNG.");
                      setAvatarFile(null);
                      e.currentTarget.value = "";
                      return;
                    }
                    setErrorMsg(null);
                    setAvatarFile(file);
                  }}
                  className="sr-only"
                />

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    Elegir archivo
                  </button>
                  <span className="text-sm text-neutral-600 dark:text-neutral-300">
                    {avatarFile ? avatarFile.name : "Ningún archivo seleccionado"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={!avatarFile || isUploadingAvatar || isSaving || isRemovingAvatar}
                    className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {isUploadingAvatar ? "Subiendo…" : "Subir avatar"}
                  </button>
                  {currentAvatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={isUploadingAvatar || isSaving || isRemovingAvatar}
                      className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-red-600 hover:bg-red-50 dark:hover:bg-neutral-800 disabled:opacity-50"
                    >
                      {isRemovingAvatar ? "Eliminando…" : "Eliminar foto"}
                    </button>
                  )}
                </div>
            </div>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm text-neutral-700 dark:text-neutral-200">Nombre de Usuario</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          placeholder="nombre_de_usuario"
          aria-invalid={Boolean(fieldErrors.username)}
          aria-describedby={fieldErrors.username ? "username-error" : undefined}
          className={`w-full rounded-lg border bg-transparent px-3 py-2 text-sm ${
            fieldErrors.username
              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-neutral-200 dark:border-neutral-800"
          }`}
        />
        {fieldErrors.username ? (
          <p id="username-error" className="text-xs text-red-600">
            {fieldErrors.username}
          </p>
        ) : (
          <p className="text-xs text-neutral-500">3–30 caracteres. Solo letras, números y guiones bajos.</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm text-neutral-700 dark:text-neutral-200">Biografía</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Comparte sobre ti"
          className="w-full min-h-[96px] rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm"
        />
        <p className="text-xs text-neutral-500">{bio.length}/500</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-neutral-700 dark:text-neutral-200">Meta de Lectura</label>
        <input
          value={readingGoal}
          onChange={(e) => setReadingGoal(e.target.value)}
          inputMode="numeric"
          placeholder="e.g. 20"
          className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm"
        />
        <p className="text-xs text-neutral-500">Numero de Libros</p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
        >
          {isSaving ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
};
