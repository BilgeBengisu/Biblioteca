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
  const filePath = `profile-pictures/${userId}/${crypto.randomUUID()}.${ext}`; // stores each photo with a unique id

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return { publicUrl: data.publicUrl, path: filePath };
}
