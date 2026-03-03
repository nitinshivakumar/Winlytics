import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Winlytics
        </h1>
        <p className="text-xl text-slate-300 mb-2">
          Data-driven career tracking
        </p>
        <p className="text-slate-400 mb-10">
          Strategically navigate your job search and maximize your chances of landing an offer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg border border-slate-500 hover:border-slate-400 text-slate-200 font-medium transition"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
