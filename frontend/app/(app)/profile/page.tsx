"use client";

import { useEffect, useState } from "react";
import { getUserFromStorage } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  if (!user) return <div className="text-slate-400">Loading…</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 max-w-md">
        <p className="text-slate-400 text-sm">Name</p>
        <p className="text-white font-medium mb-4">{user.name}</p>
        <p className="text-slate-400 text-sm">Email</p>
        <p className="text-white font-medium">{user.email}</p>
      </div>
    </div>
  );
}
