"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Stats = {
  total_applications: number;
  interviews_scheduled: number;
  offers_received: number;
  rejections: number;
  conversion_rate: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Stats>("/api/applications/stats")
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-400">Loading…</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!stats) return null;

  const cards = [
    { label: "Total Applications", value: stats.total_applications, color: "blue" },
    { label: "Interviews Scheduled", value: stats.interviews_scheduled, color: "amber" },
    { label: "Offers Received", value: stats.offers_received, color: "emerald" },
    { label: "Rejections", value: stats.rejections, color: "slate" },
    { label: "Conversion Rate", value: `${stats.conversion_rate}%`, color: "violet" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="p-4 rounded-xl bg-slate-800 border border-slate-700"
          >
            <p className="text-slate-400 text-sm mb-1">{c.label}</p>
            <p className="text-2xl font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-slate-500 text-sm">
        Weekly activity and more analytics coming in Phase 3.
      </p>
    </div>
  );
}
