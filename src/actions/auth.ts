"use server";

import { redirect } from "next/navigation";
import {
  authenticateAdmin,
  clearSessionCookie,
  requireAdmin,
  setSessionCookie,
} from "@/lib/auth";
import { firstError, loginSchema } from "@/lib/validation/auth";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
};

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { status: "error", message: firstError(parsed.error) };
  }

  try {
    const user = await authenticateAdmin(parsed.data.email, parsed.data.password);
    if (!user) {
      return { status: "error", message: "Those details were not recognised." };
    }

    await setSessionCookie({ sub: user.id, email: user.email });
  } catch (error) {
    console.error("Admin login failed", error);
    return {
      status: "error",
      message: "We couldn't sign you in. Please try again.",
    };
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const session = await requireAdmin();
  if (session) {
    await clearSessionCookie();
  }
  redirect("/admin/login");
}
