import "server-only";
import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import type { User } from "@/lib/types";
import type { RegisterUserInput } from "@/lib/validations";

/** Number of users shown per page in the users list. */
export const USERS_PAGE_SIZE = 5;

export type ListUsersParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export type PagedUsers = {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Lists users newest-first with optional case-insensitive search across name,
 * email, and phone, paginated. `page` is 1-based and clamped to a valid range.
 */
export async function listUsers(params: ListUsersParams = {}): Promise<PagedUsers> {
  const pageSize = params.pageSize ?? USERS_PAGE_SIZE;
  const search = params.search?.trim();

  const where: Prisma.UserWhereInput = search
    ? {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ],
    }
    : {};

  const total = await prisma.user.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, params.page ?? 1), totalPages);

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return { users, total, page, pageSize, totalPages };
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
