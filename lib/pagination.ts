/** Default number of items per page across paginated lists. */
export const DEFAULT_PAGE_SIZE = 8;

/** Query inputs shared by paginated, searchable data-layer functions. */
export type PageParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

/** A page of results plus the metadata needed to render pagination controls. */
export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Clamps a requested page against the total count and derives the Prisma
 * `skip`/`take` window. `page` is 1-based and never exceeds `totalPages`.
 */
export function resolvePagination(
  total: number,
  page: number | undefined,
  pageSize: number,
): { page: number; totalPages: number; skip: number; take: number } {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page ?? 1), totalPages);
  return {
    page: current,
    totalPages,
    skip: (current - 1) * pageSize,
    take: pageSize,
  };
}
