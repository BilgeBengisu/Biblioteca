import { supabase } from "../supabase-client";

/**
 * Uploads an avatar to Supabase Storage and returns path.
 * Avatars Bucket is public
 */
export async function uploadAvatar(
  bucket: string,
  userId: string,
  file: File
): Promise<{ publicUrl: string; path: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const filePath = `${userId}/${crypto.randomUUID()}.${ext}`; // stores each photo with a unique id

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    const isHeic = file.type === "image/heic" || file.type === "image/heif";
    const hint = isHeic
      ? " The bucket must allow image/heic (or convert to JPG/PNG)."
      : "";
    throw new Error(`${uploadError.message}${hint}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return { publicUrl: data.publicUrl, path: filePath };
}
