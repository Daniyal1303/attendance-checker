"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { registerUser } from "@/lib/data/users";
import { logger } from "@/lib/logger";
import type { FormState, User } from "@/lib/types";
import { registerUserSchema } from "@/lib/validations";
import { field } from "./form-data";

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
