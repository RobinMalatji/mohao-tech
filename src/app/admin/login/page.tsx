import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-full items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-[1.8rem] border border-line bg-canvas p-7 sm:p-8">
        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">
          Administration
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          This area is for authorised Mohao Tech administrators only.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
