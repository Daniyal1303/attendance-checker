import "server-only";
import { prisma } from "@/lib/db";
import type { User } from "@/lib/types";
import type { RegisterUserInput } from "@/lib/validations";

export async function listUsers(): Promise<User[]> {
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
