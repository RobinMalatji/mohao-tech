import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAdmin } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function AdminShell({
  email,
  children,
}: {
  email?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Logo />
            <p className="hidden text-sm text-muted sm:block">Enquiries</p>
          </div>
          {email ? (
            <div className="flex items-center gap-3">
              <p className="hidden text-xs text-muted sm:block">{email}</p>
              <form action={logoutAdmin}>
                <Button type="submit" variant="secondary">
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/" className="text-sm text-muted hover:text-ink">
              Back to site
            </Link>
          )}
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}
