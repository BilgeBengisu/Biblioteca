import { useEffect, useRef, useState } from "react";
import type { ProfileRow } from "../types/Profile";
import { uploadAvatar } from "../services/storage";
import defaultAvatar from "../assets/default-avatar.svg";

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
      username?: string | null;
      bio: string | null;
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingRemoveAvatar, setPendingRemoveAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!avatarFile) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(avatarFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string }>({});

  const normalizedUsername = username.trim();
  const normalizedBio = bio.trim();
  const profileUsername = (profile.username ?? "").trim();
  const profileBio = (profile.bio ?? "").trim();

  const hasChanges =
    normalizedUsername !== profileUsername ||
    normalizedBio !== profileBio ||
    avatarFile !== null ||
    pendingRemoveAvatar;

  // Prefill when component mounts / profile changes
  useEffect(() => {
    setUsername(profile.username ?? "");
    setBio(profile.bio ?? "");
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


  // error messages for invalid inputs
  const validate = () => {
    if (username.trim().length === 0) return "El nombre de usuario es obligatorio.";
    if (username.trim().length > 0) {
      const u = username.trim();
      if (u.length < 3 || u.length > 30) return "El nombre de usuario debe tener entre 3 y 30 caracteres.";
      if (!/^[a-zA-Z0-9_]+$/.test(u)) return "El nombre de usuario solo puede contener letras, números y guiones bajos.";
    }
    if (bio.length > 500) return "La biografía debe tener 500 caracteres o menos.";
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
      const trimmedUsername = username.trim();
      const usernameUpdate = trimmedUsername.length ? trimmedUsername : undefined;

      let avatarUpdate: { avatar_url: string | null } | undefined;
      if (avatarFile) {
        const { publicUrl } = await uploadAvatar(avatarBucket, userId, avatarFile);
        avatarUpdate = { avatar_url: publicUrl };
      } else if (pendingRemoveAvatar) {
        avatarUpdate = { avatar_url: null };
      }

      const updated = await updateProfile(userId, {
        username: usernameUpdate,
        bio: bio.trim().length ? bio.trim() : null,
        ...avatarUpdate,
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
            <div className="ring-1 ring-neutral-200 dark:ring-neutral-800 flex-shrink-0 rounded-full">
              <img
                src={pendingRemoveAvatar ? defaultAvatar : (previewUrl ?? currentAvatarUrl ?? defaultAvatar)}
                alt="Avatar actual"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>

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
                    setPendingRemoveAvatar(false);
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

                {(currentAvatarUrl || avatarFile) && !pendingRemoveAvatar && (
                  <button
                    type="button"
                    onClick={() => { setPendingRemoveAvatar(true); setAvatarFile(null); }}
                    disabled={isSaving}
                    className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-red-600 hover:bg-red-50 dark:hover:bg-neutral-800 disabled:opacity-50"
                  >
                    Eliminar foto
                  </button>
                )}
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
          disabled={isSaving || !hasChanges}
          className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
        >
          {isSaving ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
};
