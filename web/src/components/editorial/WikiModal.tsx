"use client";

import React, { useState } from "react";
import { homelabArticles, cyberArticles } from "@/data/wiki";
import { X, BookOpen, ChevronRight } from "lucide-react";

interface WikiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WikiModal: React.FC<WikiModalProps> = ({ isOpen, onClose }) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(homelabArticles[0]?.id || "");
  const allArticles = [...homelabArticles, ...cyberArticles];
  const activeArticle = allArticles.find((a) => a.id === selectedArticleId) || allArticles[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[85vh] rounded-3xl border border-sand-300 dark:border-espresso-700 shadow-2xl flex flex-col overflow-hidden bg-sand-50 dark:bg-espresso-900 transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-sand-200 dark:border-espresso-800 flex items-center justify-between bg-sand-100/50 dark:bg-espresso-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-terracotta-100 dark:bg-terracotta-900/50 flex items-center justify-center text-terracotta-600 dark:text-terracotta-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-editorial text-lg font-bold text-espresso-900 dark:text-sand-100">
                Architecture &amp; Wiki Documentation
              </h2>
              <p className="text-xs text-espresso-500 dark:text-sand-400 font-mono">
                Declarative runbooks, CIS benchmarks &amp; operational topology
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-espresso-500 hover:text-espresso-900 dark:hover:text-sand-100 hover:bg-sand-200 dark:hover:bg-espresso-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two-column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Article Sidebar */}
          <div className="w-64 sm:w-72 border-r border-sand-200 dark:border-espresso-800 p-4 space-y-4 overflow-y-auto bg-sand-100/30 dark:bg-espresso-950/20">
            <div>
              <div className="text-xs font-mono uppercase text-espresso-500 dark:text-sand-400 font-bold px-2 mb-2">
                01 // Homelab Infrastructure
              </div>
              <div className="space-y-1">
                {homelabArticles.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                      selectedArticleId === art.id
                        ? "bg-terracotta-500 text-white font-bold shadow-sm"
                        : "text-espresso-600 dark:text-sand-400 hover:bg-sand-200/70 dark:hover:bg-espresso-800"
                    }`}
                  >
                    <span className="truncate">{art.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-mono uppercase text-espresso-500 dark:text-sand-400 font-bold px-2 mb-2">
                02 // Cyber Security Lab
              </div>
              <div className="space-y-1">
                {cyberArticles.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                      selectedArticleId === art.id
                        ? "bg-terracotta-500 text-white font-bold shadow-sm"
                        : "text-espresso-600 dark:text-sand-400 hover:bg-sand-200/70 dark:hover:bg-espresso-800"
                    }`}
                  >
                    <span className="truncate">{art.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Markdown Content Area */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-4 bg-sand-50 dark:bg-espresso-900">
            {activeArticle && (
              <>
                <div className="border-b border-sand-200 dark:border-espresso-800 pb-4">
                  <span className="code-font text-xs font-bold text-terracotta-600 dark:text-terracotta-400 uppercase">
                    {activeArticle.category}
                  </span>
                  <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-espresso-900 dark:text-sand-100 mt-1 capitalize">
                    {activeArticle.title}
                  </h1>
                  <p className="text-xs text-espresso-500 dark:text-sand-400 font-mono mt-1">
                    {activeArticle.summary}
                  </p>
                </div>

                <div className="font-mono text-xs sm:text-sm text-espresso-700 dark:text-sand-200 whitespace-pre-wrap leading-relaxed">
                  {activeArticle.content}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
