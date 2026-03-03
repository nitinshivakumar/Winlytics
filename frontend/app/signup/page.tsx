"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, setAuthToken, setUserInStorage } from "@/lib/api";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api<{ access_token: string; user: { id: number; name: string; email: string } }>(
        "/api/auth/signup",
        {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        }
      );
      setAuthToken(res.access_token);
      setUserInStorage(res.user);
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(token: string) {
    setError("");
    setLoading(true);
    try {
      const res = await api<{ access_token: string; user: { id: number; name: string; email: string } }>(
        "/api/auth/google",
        { method: "POST", body: JSON.stringify({ token }) }
      );
      setAuthToken(res.access_token);
      setUserInStorage(res.user);
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center text-slate-400 hover:text-white mb-6">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Create your Winlytics account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 text-red-300 text-sm">{error}</div>
          )}
          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google sign-up was cancelled or failed.")}
            disabled={loading}
          />
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-500">or with email</span>
            </div>
          </div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium"
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-slate-400 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
