import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (with service role key)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Storage bucket name - you can customize this
export const STORAGE_BUCKET = 'images'

// Helper function to upload file to Supabase Storage
export async function uploadToSupabase(file: File, fileName?: string): Promise<{ url: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop()
    const finalFileName = fileName || `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(finalFileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return { url: '', error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path)

    return { url: publicUrl }
  } catch (error) {
    console.error('Upload error:', error)
    return { url: '', error: 'Upload failed' }
  }
}

// Helper function to delete file from Supabase Storage
export async function deleteFromSupabase(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error: 'Delete failed' }
  }
}