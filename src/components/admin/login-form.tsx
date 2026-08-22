"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/actions/auth";
import { Button } from "@/components/ui/button";

const initial: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initial);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="admin-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="min-h-12 w-full rounded-2xl border border-ink/12 px-4 text-sm"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="admin-password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="min-h-12 w-full rounded-2xl border border-ink/12 px-4 text-sm"
        />
      </div>
      {state.message ? (
        <p className="text-sm text-red-700" role="alert">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
