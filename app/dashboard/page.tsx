"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/utils";
import { FileText, FolderOpen, Clock } from "lucide-react";
import Link from "next/link";

interface Stats {
  total_projects: number;
  total_specs: number;
  recent_specs: { title: string; created_at: string }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/stats`)
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => setStats({ total_projects: 0, total_specs: 0, recent_specs: [] }))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Projects",
      value: stats?.total_projects ?? "—",
      icon: FolderOpen,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total Specs",
      value: stats?.total_specs ?? "—",
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Generated Today",
      value: stats?.recent_specs?.filter((s) => {
        const d = new Date(s.created_at);
        const now = new Date();
        return d.toDateString() === now.toDateString();
      }).length ?? "—",
      icon: Clock,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-500 mt-1">
          Your SpecForge activity at a glance.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-5"
          >
            <div className={`p-3 rounded-xl ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">
                {loading ? (
                  <span className="inline-block w-8 h-8 bg-slate-100 rounded animate-pulse" />
                ) : (
                  value
                )}
              </div>
              <div className="text-sm text-slate-500 mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Specs */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Recent Specs</h2>
          <Link
            href="/dashboard/library"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : stats?.recent_specs && stats.recent_specs.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-xs uppercase text-slate-400 border-b border-slate-100">
                <th className="px-6 py-3 text-left font-medium">Title</th>
                <th className="px-6 py-3 text-right font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_specs.map((spec, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">
                    {spec.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 text-right">
                    {new Date(spec.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center text-slate-400">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No specs yet.</p>
            <Link
              href="/dashboard/generate"
              className="mt-3 inline-block text-sm text-indigo-600 hover:underline font-medium"
            >
              Generate your first spec
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
