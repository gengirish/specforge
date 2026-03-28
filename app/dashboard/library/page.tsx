"use client";

import { useEffect, useState } from "react";
import { API_URL, cn } from "@/lib/utils";
import { toast } from "sonner";
import { Trash2, ChevronDown, ChevronUp, Copy, Check, BookOpen } from "lucide-react";
import Link from "next/link";

interface SpecSummary {
  id: number;
  title: string;
  raw_input: string;
  status: string;
  created_at: string;
  project_id: number;
}

interface SpecDetail {
  id: number;
  title: string;
  raw_input: string;
  user_stories: string;
  acceptance_criteria: string;
  api_contract: string;
  db_schema: string;
  edge_cases: string;
  test_scenarios: string;
  full_spec: string;
  created_at: string;
}

type TabKey = "user_stories" | "acceptance_criteria" | "api_contract" | "db_schema" | "edge_cases" | "test_scenarios";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "user_stories", label: "User Stories", icon: "📖" },
  { key: "acceptance_criteria", label: "Criteria", icon: "✅" },
  { key: "api_contract", label: "API", icon: "🔌" },
  { key: "db_schema", label: "Schema", icon: "🗄️" },
  { key: "edge_cases", label: "Edge Cases", icon: "⚠️" },
  { key: "test_scenarios", label: "Tests", icon: "🧪" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function SpecCard({
  spec,
  onDelete,
}: {
  spec: SpecSummary;
  onDelete: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<SpecDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("user_stories");
  const [deleting, setDeleting] = useState(false);

  const toggleExpand = async () => {
    if (!expanded && !detail) {
      setLoadingDetail(true);
      try {
        const res = await fetch(`${API_URL}/api/specs/${spec.id}`);
        const data = await res.json();
        setDetail(data);
      } catch {
        toast.error("Failed to load spec details.");
        return;
      } finally {
        setLoadingDetail(false);
      }
    }
    setExpanded(!expanded);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this spec?")) return;
    setDeleting(true);
    try {
      await fetch(`${API_URL}/api/specs/${spec.id}`, { method: "DELETE" });
      toast.success("Spec deleted.");
      onDelete(spec.id);
    } catch {
      toast.error("Failed to delete spec.");
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50 transition"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{spec.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md">
              {spec.raw_input}
            </p>
          </div>
          <span className="shrink-0 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Project #{spec.project_id}
          </span>
          <span className="shrink-0 text-xs text-slate-400">
            {new Date(spec.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            disabled={deleting}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-slate-100">
          {loadingDetail ? (
            <div className="p-8 text-center text-slate-400">
              <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2" />
              Loading spec...
            </div>
          ) : detail ? (
            <>
              {/* Tabs */}
              <div className="flex gap-1 px-6 pt-4 border-b border-slate-100 overflow-x-auto">
                {TABS.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-xl whitespace-nowrap transition border-b-2 -mb-px",
                      activeTab === key
                        ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
              <div className="p-6">
                <div className="flex justify-end mb-3">
                  <CopyButton text={detail[activeTab] || ""} />
                </div>
                <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 bg-slate-50 rounded-xl p-5 max-h-96 overflow-y-auto leading-relaxed">
                  {detail[activeTab] || "No content for this section."}
                </pre>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function LibraryPage() {
  const [specs, setSpecs] = useState<SpecSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/specs`)
      .then((r) => r.json())
      .then((d) => setSpecs(d))
      .catch(() => toast.error("Failed to load specs."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: number) => {
    setSpecs((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Spec Library</h1>
          <p className="text-slate-500 mt-1">
            All your generated technical specifications.
          </p>
        </div>
        <Link
          href="/dashboard/generate"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
        >
          + Generate New
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : specs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <h3 className="font-semibold text-slate-700 mb-1">No specs yet</h3>
          <p className="text-slate-400 text-sm mb-6">
            Generate your first technical specification to get started.
          </p>
          <Link
            href="/dashboard/generate"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
          >
            Generate Spec
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">{specs.length} spec{specs.length !== 1 ? "s" : ""} total</p>
          {specs.map((spec) => (
            <SpecCard key={spec.id} spec={spec} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
