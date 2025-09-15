// lib/supabase-upload.ts
import { supabaseAdmin } from "./supabase";

export async function uploadToSupabase(file: File, filename: string, userId?: string) {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not initialized");
  }

  const bucket = "uploads"; // ✅ make sure this bucket exists in your Supabase project

  // Organize files by user (optional)
  const filePath = userId ? `${userId}/${filename}` : filename;

  // Convert File → Buffer for server-side upload
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    fileName: filePath,
    publicUrl: publicUrlData.publicUrl,
  };
}
