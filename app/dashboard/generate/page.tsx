"use client";

import { useState } from "react";
import { API_URL } from "@/lib/utils";
import { toast } from "sonner";
import { Wand2, Copy, Check, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type TabKey =
  | "user_stories"
  | "acceptance_criteria"
  | "api_contract"
  | "db_schema"
  | "edge_cases"
  | "test_scenarios"
  | "full_spec";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "user_stories", label: "User Stories", icon: "📖" },
  { key: "acceptance_criteria", label: "Criteria", icon: "✅" },
  { key: "api_contract", label: "API", icon: "🔌" },
  { key: "db_schema", label: "Schema", icon: "🗄️" },
  { key: "edge_cases", label: "Edge Cases", icon: "⚠️" },
  { key: "test_scenarios", label: "Tests", icon: "🧪" },
  { key: "full_spec", label: "Full Spec", icon: "📄" },
];

interface SpecResult {
  id: number;
  user_stories: string;
  acceptance_criteria: string;
  api_contract: string;
  db_schema: string;
  edge_cases: string;
  test_scenarios: string;
  full_spec: string;
}

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
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function GeneratePage() {
  const [title, setTitle] = useState("");
  const [rawInput, setRawInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpecResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("user_stories");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawInput.trim()) {
      toast.error("Please fill in both the title and feature description.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), raw_input: rawInput.trim() }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setResult(data);
      setActiveTab("user_stories");
      toast.success("Spec generated successfully!");
    } catch (err) {
      toast.error("Failed to generate spec. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Generate Spec</h1>
        <p className="text-slate-500 mt-1">
          Describe your feature and let AI generate a complete technical specification.
        </p>
      </div>

      {/* Input form */}
      <form
        onSubmit={handleGenerate}
        className="bg-white rounded-2xl border border-slate-200 p-6 mb-8"
      >
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Feature Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. User Authentication System"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-slate-900 placeholder-slate-400 transition"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Feature Description
          </label>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Describe the feature in plain language... e.g. 'Users should be able to sign up with email and password, log in, and reset their password if forgotten. Admin users should have access to a user management panel.'"
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-slate-900 placeholder-slate-400 transition resize-none font-mono text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-all"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating spec...
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5" />
              Generate Full Spec
            </>
          )}
        </button>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
            <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Generating your spec...</h3>
          <p className="text-slate-500 text-sm">
            AI is crafting Gherkin user stories, API contracts, DB schema, edge cases, and test scenarios.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            {["User Stories", "API Contract", "DB Schema", "Test Cases"].map((item, i) => (
              <span key={item} className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h2 className="font-semibold text-slate-900">Generated Specification</h2>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                Saved to Library
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 pt-4 pb-0 border-b border-slate-100 overflow-x-auto">
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

          {/* Tab content */}
          <div className="p-6">
            <div className="flex justify-end mb-3">
              <CopyButton text={result[activeTab] || ""} />
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 bg-slate-50 rounded-xl p-5 max-h-[500px] overflow-y-auto leading-relaxed">
              {result[activeTab] || "No content generated for this section."}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
