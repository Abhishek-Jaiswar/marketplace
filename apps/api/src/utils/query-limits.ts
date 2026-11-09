/**
 * Prisma's budget middleware rejects any SELECT without a LIMIT. Use this for
 * naturally small result sets that are returned without pagination.
 */
export const MAX_UNPAGED_ROWS = 1000
