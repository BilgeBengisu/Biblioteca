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
  const filePath = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) throw new Error(uploadError.message);

  // filePath is useful for storing paths in the database - no need to store full public URL
  return filePath ;
}
