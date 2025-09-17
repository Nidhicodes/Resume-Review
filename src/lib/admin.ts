const ADMIN_USER_IDS = [
  '29514379-62bc-429f-8dc5-276b7862b1ec',
];

/**
 * Checks if a given user ID belongs to an admin.
 * @param userId The ID of the user to check.
 * @returns True if the user is an admin, false otherwise.
 */
export const isAdmin = (userId: string | undefined): boolean => {
  if (!userId) {
    return false;
  }
  return ADMIN_USER_IDS.includes(userId);
};
