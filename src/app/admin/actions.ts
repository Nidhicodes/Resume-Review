'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/lib/admin'

export async function updateAdminStatus(userId: string, newIsAdmin: boolean) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !(await isAdmin(user.id))) {
    throw new Error('Not authorized')
  }

  if (user.id === userId) {
    throw new Error('Admins cannot revoke their own status.')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ is_admin: newIsAdmin })
    .eq('id', userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin')
}
