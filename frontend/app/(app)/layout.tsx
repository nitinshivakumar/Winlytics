"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthToken, getToken } from "@/lib/api";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Applications Tracker" },
  { href: "/interviews", label: "Interview Tracker" },
  { href: "/offers", label: "Offer Tracker" },
  { href: "/activity", label: "Daily Activity" },
  { href: "/reflection", label: "Mindset / Reflection" },
  { href: "/analytics", label: "Analytics" },
  { href: "/profile", label: "Profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) router.replace("/login");
  }, [router]);

  function logout() {
    clearAuthToken();
    localStorage.removeItem("winlytics_user");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-slate-900">
      <aside className="w-56 shrink-0 border-r border-slate-700 bg-slate-800/50 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <Link href="/dashboard" className="font-bold text-white text-lg">
            Winlytics
          </Link>
        </div>
        <nav className="p-2 flex-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-slate-700">
          <button
            onClick={logout}
            className="w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-slate-700/50 text-left"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
