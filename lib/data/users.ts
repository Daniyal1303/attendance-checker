import "server-only";
import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  resolvePagination,
  type PageParams,
  type Paginated,
} from "@/lib/pagination";
import type { User } from "@/lib/types";
import type { RegisterUserInput } from "@/lib/validations";

/** Number of users shown per page in the users list. */
export const USERS_PAGE_SIZE = 5;

/**
 * Builds a case-insensitive Prisma filter matching a search term against a
 * user's name, email, or phone. Returns an empty filter for a blank term.
 */
export function userSearchWhere(search?: string): Prisma.UserWhereInput {
  const term = search?.trim();
  if (!term) return {};
  return {
    OR: [
      { firstName: { contains: term, mode: "insensitive" } },
      { lastName: { contains: term, mode: "insensitive" } },
      { email: { contains: term, mode: "insensitive" } },
      { phone: { contains: term, mode: "insensitive" } },
    ],
  };
}

/** Lists users newest-first, paginated, with optional search. */
export async function listUsers(params: PageParams = {}): Promise<Paginated<User>> {
  const pageSize = params.pageSize ?? USERS_PAGE_SIZE;
  const where = userSearchWhere(params.search);

  const total = await prisma.user.count({ where });
  const { page, totalPages, skip, take } = resolvePagination(
    total,
    params.page,
    pageSize,
  );

  const items = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  return { items, total, page, pageSize, totalPages };
}

/** Returns every user newest-first; for selectors that need the full list. */
export async function listAllUsers(): Promise<User[]> {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
}

export async function registerUser(input: RegisterUserInput): Promise<User> {
  return prisma.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email ?? null,
      phone: input.phone ?? null,
    },
  });
}

/** Updates a user's profile fields. */
export async function updateUser(
  id: string,
  input: RegisterUserInput,
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email ?? null,
      phone: input.phone ?? null,
    },
  });
}

/** Deletes a user; their attendance records cascade-delete via the FK. */
export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({ where: { id } });
}
