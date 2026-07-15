"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/admin-actions";

const links = [
  { href: "/", label: "Home" },
  { href: "/symptoms", label: "Symptoms" },
  { href: "/nutrients", label: "Nutrients" },
  { href: "/foods", label: "Foods" },
  { href: "/supplements", label: "Supplements" },
];

export default function SidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sm:hidden fixed top-0 inset-x-0 h-14 bg-white border-b border-neutral-200 z-30 flex items-center justify-between px-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="touch-manipulation p-2 -ml-2 text-neutral-700"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link href="/" className="font-bold text-emerald-700 touch-manipulation" onClick={close}>
          BodyNeeds
        </Link>
        {isAdmin ? (
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center">
            A
          </span>
        ) : (
          <span className="w-8" />
        )}
      </div>

      {/* Overlay (mobile only, shown when drawer open) */}
      {open && (
        <div
          className="sm:hidden fixed inset-0 bg-black/40 z-40"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar / drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-neutral-200 z-50 flex flex-col transition-transform duration-200 ease-out sm:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-lg text-emerald-700 touch-manipulation"
            onClick={close}
          >
            BodyNeeds Navigator
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="sm:hidden p-1 text-neutral-500 touch-manipulation"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium touch-manipulation ${
                  active
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-neutral-700 hover:bg-neutral-100 active:bg-neutral-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-neutral-200">
          {isAdmin ? (
            <div className="space-y-1">
              <p className="px-3 text-xs text-neutral-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Signed in as Admin
              </p>
              <Link
                href="/admin"
                onClick={close}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium touch-manipulation ${
                  pathname.startsWith("/admin")
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-neutral-700 hover:bg-neutral-100 active:bg-neutral-100"
                }`}
              >
                Admin dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-50 touch-manipulation"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/admin/login"
              onClick={close}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 active:bg-emerald-50 touch-manipulation"
            >
              Admin sign in
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
