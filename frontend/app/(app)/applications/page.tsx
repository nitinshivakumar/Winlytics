"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Application = {
  id: number;
  company: string;
  role: string;
  status: string;
  date_applied: string;
  source: string | null;
  notes: string | null;
};

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

export default function ApplicationsPage() {
  const [list, setList] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Application | null>(null);
  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "Applied",
    date_applied: new Date().toISOString().slice(0, 10),
    source: "",
    notes: "",
  });

  function load() {
    api<Application[]>("/api/applications/")
      .then(setList)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm({
      company: "",
      role: "",
      status: "Applied",
      date_applied: new Date().toISOString().slice(0, 10),
      source: "",
      notes: "",
    });
    setEditing(null);
    setModal("add");
  }

  function openEdit(app: Application) {
    setEditing(app);
    setForm({
      company: app.company,
      role: app.role,
      status: app.status,
      date_applied: app.date_applied.slice(0, 10),
      source: app.source || "",
      notes: app.notes || "",
    });
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await api(`/api/applications/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            company: form.company,
            role: form.role,
            status: form.status,
            date_applied: form.date_applied,
            source: form.source || null,
            notes: form.notes || null,
          }),
        });
      } else {
        await api("/api/applications/", {
          method: "POST",
          body: JSON.stringify({
            company: form.company,
            role: form.role,
            status: form.status,
            date_applied: form.date_applied,
            source: form.source || null,
            notes: form.notes || null,
          }),
        });
      }
      closeModal();
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this application?")) return;
    try {
      await api(`/api/applications/${id}`, { method: "DELETE" });
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <div className="text-slate-400">Loading…</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Applications Tracker</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium"
        >
          Add Application
        </button>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-300 text-sm">{error}</div>
      )}
      <div className="rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-slate-400 text-sm">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Date Applied</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No applications yet. Add one to get started.
                </td>
              </tr>
            ) : (
              list.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/50">
                  <td className="px-4 py-3 text-white font-medium">{app.company}</td>
                  <td className="px-4 py-3 text-slate-300">{app.role}</td>
                  <td className="px-4 py-3 text-slate-400">{app.date_applied}</td>
                  <td className="px-4 py-3 text-slate-400">{app.source || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        app.status === "Offer"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : app.status === "Rejected"
                          ? "bg-red-500/20 text-red-400"
                          : app.status === "Interview"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEdit(app)}
                      className="text-blue-400 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              {editing ? "Edit Application" : "Add Application"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white"
              />
              <input
                required
                placeholder="Role"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white"
              />
              <input
                required
                type="date"
                value={form.date_applied}
                onChange={(e) => setForm((f) => ({ ...f, date_applied: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white"
              />
              <input
                placeholder="Source (e.g. LinkedIn, Indeed)"
                value={form.source}
                onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white"
              />
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white resize-none"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">
                  {editing ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
