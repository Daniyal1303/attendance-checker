"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { deleteUser, registerUser, updateUser } from "@/lib/data/users";
import { logger } from "@/lib/logger";
import type { FormState, User } from "@/lib/types";
import {
  deleteUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "@/lib/validations";
import { field } from "./form-data";

/** Narrows an unknown error to a Prisma P2025 (record not found) failure. */
function isRecordNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "P2025"
  );
}

/** Narrows an unknown error to a Prisma P2002 (unique constraint) failure. */
function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "P2002"
  );
}

/** Registers a user from a submitted form (feature 1). */
export async function registerUserAction(
  _prev: FormState<User>,
  formData: FormData,
): Promise<FormState<User>> {
  const parsed = registerUserSchema.safeParse({
    firstName: field(formData, "firstName"),
    lastName: field(formData, "lastName"),
    email: field(formData, "email"),
    phone: field(formData, "phone"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const user = await registerUser(parsed.data);
    logger.info("user.registered", { userId: user.id });
    revalidatePath("/users");
    return { status: "success", data: user };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        status: "error",
        message: "That email is already registered.",
        fieldErrors: { email: ["That email is already registered."] },
      };
    }
    logger.error("user.register_failed", { error: String(error) });
    return { status: "error", message: "Could not register the user. Please try again." };
  }
}

/** Updates an existing user from a submitted form. */
export async function updateUserAction(
  _prev: FormState<User>,
  formData: FormData,
): Promise<FormState<User>> {
  const parsed = updateUserSchema.safeParse({
    id: field(formData, "id"),
    firstName: field(formData, "firstName"),
    lastName: field(formData, "lastName"),
    email: field(formData, "email"),
    phone: field(formData, "phone"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { id, ...input } = parsed.data;

  try {
    const user = await updateUser(id, input);
    logger.info("user.updated", { userId: user.id });
    revalidatePath("/users");
    return { status: "success", data: user };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        status: "error",
        message: "That email is already registered.",
        fieldErrors: { email: ["That email is already registered."] },
      };
    }
    if (isRecordNotFoundError(error)) {
      return { status: "error", message: "That user no longer exists." };
    }
    logger.error("user.update_failed", { error: String(error) });
    return { status: "error", message: "Could not update the user. Please try again." };
  }
}

/** Deletes a user from a submitted form. */
export async function deleteUserAction(
  _prev: FormState<{ id: string }>,
  formData: FormData,
): Promise<FormState<{ id: string }>> {
  const parsed = deleteUserSchema.safeParse({ id: field(formData, "id") });

  if (!parsed.success) {
    return { status: "error", message: "Could not delete the user." };
  }

  try {
    await deleteUser(parsed.data.id);
    logger.info("user.deleted", { userId: parsed.data.id });
    revalidatePath("/users");
    return { status: "success", data: { id: parsed.data.id } };
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return { status: "error", message: "That user no longer exists." };
    }
    logger.error("user.delete_failed", { error: String(error) });
    return { status: "error", message: "Could not delete the user. Please try again." };
  }
}
