'use client'

import { useState } from 'react'

export function AdminToggle({
  userId,
  isAdmin,
  updateAdminStatus,
}: {
  userId: string
  isAdmin: boolean
  updateAdminStatus: (userId: string, isAdmin: boolean) => Promise<void>
}) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleClick = async () => {
    setIsUpdating(true)
    await updateAdminStatus(userId, !isAdmin)
    setIsUpdating(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isUpdating}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
        isAdmin
          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
      }`}
    >
      {isUpdating ? 'Updating...' : isAdmin ? 'Revoke Admin' : 'Grant Admin'}
    </button>
  )
}
