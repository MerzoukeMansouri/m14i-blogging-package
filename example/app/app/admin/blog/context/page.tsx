"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BrandContext {
  site_name: string;
  description: string;
  industry: string;
  target_audience: string;
  tone: string;
  vocabulary_prefer: string[];
  vocabulary_avoid: string[];
}

export default function BrandContextPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [context, setContext] = useState<BrandContext>({
    site_name: "",
    description: "",
    industry: "",
    target_audience: "",
    tone: "",
    vocabulary_prefer: [],
    vocabulary_avoid: [],
  });

  // Load current settings
  useEffect(() => {
    fetch("/api/blog/brand-settings")
      .then(res => res.json())
      .then(data => {
        // API returns direct object, not wrapped in data
        const settings = data.data || data;
        if (settings && settings.site_name) {
          setContext({
            site_name: settings.site_name || "",
            description: settings.description || "",
            industry: settings.industry || "",
            target_audience: settings.target_audience || "",
            tone: settings.tone || "",
            vocabulary_prefer: settings.vocabulary_prefer || [],
            vocabulary_avoid: settings.vocabulary_avoid || [],
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load brand context:", err);
        setError("Failed to load brand context");
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const response = await fetch("/api/blog/brand-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(context),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError("Failed to save brand context");
    } finally {
      setSaving(false);
    }
  };

  const handleArrayChange = (field: "vocabulary_prefer" | "vocabulary_avoid", value: string) => {
    setContext(prev => ({
      ...prev,
      [field]: value.split(",").map(s => s.trim()).filter(Boolean),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/blog"
            className="text-purple-600 hover:text-purple-700 text-sm mb-4 inline-block"
          >
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Context</h1>
          <p className="text-gray-600">
            Configure your site's identity and voice. AI generation will use this context to match your brand.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name *
            </label>
            <input
              type="text"
              value={context.site_name}
              onChange={(e) => setContext({ ...context, site_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="My Awesome Blog"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={context.description}
              onChange={(e) => setContext({ ...context, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="A blog about technology, design, and innovation"
            />
            <p className="mt-1 text-xs text-gray-500">What is your site about?</p>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <input
              type="text"
              value={context.industry}
              onChange={(e) => setContext({ ...context, industry: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="technology, healthcare, finance, etc."
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <input
              type="text"
              value={context.target_audience}
              onChange={(e) => setContext({ ...context, target_audience: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="developers, marketers, executives, etc."
            />
            <p className="mt-1 text-xs text-gray-500">Who are you writing for?</p>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <input
              type="text"
              value={context.tone}
              onChange={(e) => setContext({ ...context, tone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="professional, casual, technical, friendly, etc."
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vocabulary Preferences</h3>

            {/* Preferred Words */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prefer (comma-separated)
              </label>
              <input
                type="text"
                value={context.vocabulary_prefer.join(", ")}
                onChange={(e) => handleArrayChange("vocabulary_prefer", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="practical, actionable, specific, concrete"
              />
              <p className="mt-1 text-xs text-gray-500">Words AI should use more often</p>
            </div>

            {/* Avoided Words */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avoid (comma-separated)
              </label>
              <textarea
                value={context.vocabulary_avoid.join(", ")}
                onChange={(e) => handleArrayChange("vocabulary_avoid", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="game-changing, transformative, revolutionary, leverage, synergy"
              />
              <p className="mt-1 text-xs text-gray-500">Buzzwords and phrases to avoid</p>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {saved && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              ✓ Brand context saved successfully
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving || !context.site_name}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/admin/blog"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
