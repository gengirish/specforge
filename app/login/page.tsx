"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    if (email === "demo@specforge.ai" && password === "demo123") {
      toast.success("Welcome to SpecForge!");
      router.push("/dashboard");
    } else {
      toast.error("Invalid credentials. Try demo@specforge.ai / demo123");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left: Feature Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-center px-16">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">📝</span>
            <span className="text-2xl font-bold text-white">SpecForge</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            From Vague Idea to Full Tech Spec in Seconds
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Paste a feature request and get Gherkin user stories, API contracts,
            DB schemas, edge cases, and test scenarios — instantly.
          </p>
        </div>

        {/* Output type badges */}
        <div className="flex flex-wrap gap-2 mb-10">
          {["Gherkin", "OpenAPI", "SQL Schema", "Test Cases", "Edge Cases"].map(
            (badge) => (
              <span
                key={badge}
                className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-600/20 text-indigo-300 border border-indigo-600/30"
              >
                {badge}
              </span>
            )
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Spec Sections", value: "6" },
            { label: "Generation Time", value: "< 15s" },
            { label: "Export Ready", value: "Yes" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-indigo-400">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="text-3xl">📝</span>
            <span className="text-xl font-bold text-slate-900">SpecForge</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Sign in to SpecForge
          </h2>
          <p className="text-slate-500 mb-8">
            Use{" "}
            <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-sm">
              demo@specforge.ai
            </code>{" "}
            /{" "}
            <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-sm">
              demo123
            </code>
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@specforge.ai"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-slate-900 placeholder-slate-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-slate-900 placeholder-slate-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
