import { createClient } from './supabase/server'

/**
 * Checks if a given user ID belongs to an admin.
 * @param userId The ID of the user to check.
 * @returns True if the user is an admin, false otherwise.
 */
export const isAdmin = async (userId: string | undefined): Promise<boolean> => {
  if (!userId) {
    return false
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error checking admin status:', error)
    return false
  }

  return data?.is_admin || false
}
