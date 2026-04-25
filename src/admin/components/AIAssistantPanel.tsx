"use client";

/**
 * AIAssistantPanel Component
 * Modal dialog for AI generation features with template support
 */

import { useState, useEffect } from "react";
import type { LayoutType } from "../../types/layouts";
import { LAYOUT_TEMPLATES } from "../../config/layoutTemplates";

export interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isGenerating: boolean;
  generationPhase: "idle" | "layout" | "sections";
  generationError: string | null;
  onGenerateComplete: (prompt: string, language: "en" | "fr", layoutPreference?: LayoutType[], tone?: string, length?: "short" | "medium" | "long") => Promise<void>;
  onGenerateFromTemplate?: (prompt: string, language: "en" | "fr", templateId: string, tone?: string) => Promise<void>;
  onGenerateSection: (prompt: string, language: "en" | "fr", layoutType: LayoutType) => Promise<void>;
  onGenerateSEO: () => Promise<void>;
  completedSectionCount?: number;
  totalSections?: number;
  generatingSectionCount?: number;
  hasTitle?: boolean;
  Button?: React.ComponentType<any>;
  Input?: React.ComponentType<any>;
}

export function AIAssistantPanel({
  isOpen,
  onClose,
  isGenerating,
  generationPhase,
  generationError,
  onGenerateComplete,
  onGenerateFromTemplate,
  onGenerateSection,
  onGenerateSEO,
  completedSectionCount = 0,
  totalSections = 0,
  generatingSectionCount = 0,
  hasTitle = false,
  Button,
  Input,
}: AIAssistantPanelProps) {
  const [activeTab, setActiveTab] = useState<"template" | "complete" | "section" | "seo">("template");
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [sectionLayoutType, setSectionLayoutType] = useState<LayoutType>("1-column");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("article");
  const [brandContext, setBrandContext] = useState<any>(null);
  const [showBrandContext, setShowBrandContext] = useState(false);

  // Load brand context
  useEffect(() => {
    if (isOpen) {
      fetch("/api/blog/brand-settings")
        .then(res => res.json())
        .then(data => {
          const settings = data.data || data;
          if (settings && settings.site_name) {
            setBrandContext(settings);
          }
        })
        .catch(() => {
          // Silently fail - brand context is optional
        });
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    if (activeTab === "template") {
      if (onGenerateFromTemplate) {
        await onGenerateFromTemplate(prompt, language, selectedTemplate);
      }
    } else if (activeTab === "complete") {
      await onGenerateComplete(prompt, language);
    } else if (activeTab === "section") {
      await onGenerateSection(prompt, language, sectionLayoutType);
    } else {
      await onGenerateSEO();
    }

    if (!generationError) {
      setPrompt("");
    }
  };

  const canGenerate = () => {
    if (activeTab === "seo") return hasTitle && !isGenerating;
    if (activeTab === "template") return prompt.trim() && onGenerateFromTemplate && !isGenerating;
    return prompt.trim() && !isGenerating;
  };

  return (
    <div
      className={`fixed right-0 top-0 h-screen bg-white border-l border-gray-200 shadow-lg transition-all duration-300 z-40 ${
        isOpen ? "w-96 visible opacity-100" : "w-96 invisible opacity-0 pointer-events-none"
      }`}
    >
      {/* Sidebar Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Brand Context Indicator */}
        {brandContext && (
          <button
            onClick={() => setShowBrandContext(!showBrandContext)}
            className="w-full text-left text-xs bg-white/10 hover:bg-white/20 rounded px-2 py-1 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span>🎯 {brandContext.site_name}</span>
              <span>{showBrandContext ? "▼" : "▶"}</span>
            </div>
          </button>
        )}

        {/* Brand Context Details */}
        {brandContext && showBrandContext && (
          <div className="mt-2 text-xs bg-white/10 rounded p-2 space-y-1">
            {brandContext.description && (
              <div><strong>About:</strong> {brandContext.description}</div>
            )}
            {brandContext.tone && (
              <div><strong>Tone:</strong> {brandContext.tone}</div>
            )}
            {brandContext.vocabulary_avoid && brandContext.vocabulary_avoid.length > 0 && (
              <div><strong>Avoiding:</strong> {brandContext.vocabulary_avoid.slice(0, 3).join(", ")}...</div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar Content */}
      <div className="overflow-y-auto h-[calc(100vh-60px)] p-4 space-y-6">
              {/* Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setActiveTab("template")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === "template"
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  📋 Template
                </button>
                <button
                  onClick={() => setActiveTab("complete")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === "complete"
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  ✨ Custom AI
                </button>
                <button
                  onClick={() => setActiveTab("section")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === "section"
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  ➕ Section
                </button>
                <button
                  onClick={() => setActiveTab("seo")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === "seo"
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  🔍 SEO
                </button>
              </div>

              {/* Description */}
              <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                {activeTab === "template" && (
                  <p>⚡ Fast generation using proven blog post structures. Perfect for most use cases.</p>
                )}
                {activeTab === "complete" && (
                  <p>✨ Custom AI layout generation. Slower but fully flexible structure.</p>
                )}
                {activeTab === "section" && (
                  <p>Generate a single section with specific layout and content.</p>
                )}
                {activeTab === "seo" && (
                  <p>Generate SEO metadata including meta description, keywords, and social tags.</p>
                )}
              </div>

              {/* Template Picker */}
              {activeTab === "template" && onGenerateFromTemplate && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Choose Template
                      <span className="ml-2 text-purple-600 font-semibold">
                        ({LAYOUT_TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Article'})
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {LAYOUT_TEMPLATES.map((template) => (
                        <button
                          type="button"
                          key={template.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedTemplate(template.id);
                          }}
                          className={`p-3 text-left border-2 rounded-lg transition-all cursor-pointer relative ${
                            selectedTemplate === template.id
                              ? "border-purple-600 bg-purple-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {selectedTemplate === template.id && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                          <div className={`font-medium text-sm ${selectedTemplate === template.id ? 'text-purple-700' : ''}`}>
                            {template.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{template.sections.length} sections</div>
                        </button>
                      ))}
                    </div>

                    {/* Selected Template Details */}
                    {selectedTemplate && LAYOUT_TEMPLATES.find(t => t.id === selectedTemplate) && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="text-xs font-medium text-purple-900 mb-1">
                          {LAYOUT_TEMPLATES.find(t => t.id === selectedTemplate)?.description}
                        </div>
                        <div className="text-xs text-purple-700">
                          Best for: {LAYOUT_TEMPLATES.find(t => t.id === selectedTemplate)?.useCase}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Topic *</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="E.g., A comprehensive guide to modern React patterns"
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Language</label>
                    <div className="flex gap-2">
                      {(["en", "fr"] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          className={`flex-1 px-4 py-2 rounded-md border-2 font-medium transition-all ${
                            language === lang
                              ? "border-purple-600 bg-purple-50 text-purple-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-600"
                          }`}
                        >
                          {lang === "en" ? "🇬🇧 English" : "🇫🇷 Français"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              {activeTab !== "seo" && activeTab !== "template" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {activeTab === "complete" ? "Topic or Prompt *" : "Section Topic *"}
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={
                        activeTab === "complete"
                          ? "E.g., A comprehensive guide to modern React patterns"
                          : "E.g., Key benefits of TypeScript"
                      }
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Language Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Language</label>
                    <div className="flex gap-2">
                      {(["en", "fr"] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          className={`flex-1 px-4 py-2 rounded-md border-2 font-medium transition-all ${
                            language === lang
                              ? "border-purple-600 bg-purple-50 text-purple-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-600"
                          }`}
                        >
                          {lang === "en" ? "🇬🇧 English" : "🇫🇷 Français"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section Layout Selection */}
                  {activeTab === "section" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Layout Type *</label>
                      <select
                        value={sectionLayoutType}
                        onChange={(e) => setSectionLayoutType(e.target.value as LayoutType)}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="1-column">1 Column</option>
                        <option value="2-columns">2 Columns (Equal)</option>
                        <option value="2-columns-wide-left">2 Columns (Wide Left)</option>
                        <option value="2-columns-wide-right">2 Columns (Wide Right)</option>
                        <option value="grid-2x2">Grid 2x2</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* SEO Message */}
              {activeTab === "seo" && !hasTitle && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                  <p className="font-medium">⚠️ Post Title Required</p>
                  <p className="mt-1">Please add a title to your post before generating SEO metadata.</p>
                </div>
              )}

              {/* Error Display */}
              {generationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">Generation Error</p>
                      <p className="text-sm text-red-700 mt-1">{generationError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Indicator */}
              {isGenerating && generationPhase !== "idle" && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent mt-0.5"></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-purple-900">
                        {generationPhase === "layout" ? "Generating layout..." : "Generating content..."}
                      </p>
                      <p className="text-xs text-purple-700">
                        {generationPhase === "layout"
                          ? "Creating the structure for your post"
                          : `${completedSectionCount}/${totalSections} sections complete, ${generatingSectionCount} in progress`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate()}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  canGenerate()
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-md"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Generating...
                  </span>
                ) : (
                  <>
                    {activeTab === "template" && "📋 Generate from Template"}
                    {activeTab === "complete" && "✨ Generate Custom Post"}
                    {activeTab === "section" && "➕ Generate Section"}
                    {activeTab === "seo" && "🔍 Generate SEO"}
                  </>
                )}
              </button>

              {/* Tips */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">💡 Tips</h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  {activeTab === "template" && (
                    <>
                      <li className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>⚡ Faster than custom AI generation</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>✅ Proven editorial structures</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>🎯 Perfect for most blog posts</span>
                      </li>
                    </>
                  )}
                  {activeTab === "complete" && (
                    <>
                      <li className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Be specific about your topic for better results</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>AI will create custom layout structure</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Slower but fully flexible</span>
                      </li>
                    </>
                  )}
                  {activeTab === "section" && (
                    <>
                      <li className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Choose layout based on content structure</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Section will be added to your post</span>
                      </li>
                    </>
                  )}
                  {activeTab === "seo" && (
                    <>
                      <li className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Requires a post title to generate</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600">•</span>
                        <span>Optimizes for search engines & social media</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
    </div>
  );
}
