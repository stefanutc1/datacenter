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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[85vh] glass-panel rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden bg-obsidian/95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Homelab // Architecture &amp; Wiki Documentation
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Declarative runbooks, CIS benchmarks, and infrastructure topology
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two-column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Article Sidebar */}
          <div className="w-64 sm:w-72 border-r border-white/10 p-4 space-y-4 overflow-y-auto bg-black/40">
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-500 font-bold px-2 mb-2">
                01 // Homelab Infrastructure
              </div>
              <div className="space-y-1">
                {homelabArticles.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                      selectedArticleId === art.id
                        ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate">{art.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase text-slate-500 font-bold px-2 mb-2">
                02 // Cyber Security Lab
              </div>
              <div className="space-y-1">
                {cyberArticles.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                      selectedArticleId === art.id
                        ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate">{art.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Markdown Content Area */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-4">
            {activeArticle && (
              <>
                <div className="border-b border-white/10 pb-4">
                  <span className="code-font text-xs font-bold text-cyan-400 uppercase">
                    {activeArticle.category}
                  </span>
                  <h1 className="text-2xl font-bold text-white mt-1 capitalize">
                    {activeArticle.title}
                  </h1>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    {activeArticle.summary}
                  </p>
                </div>

                <div className="prose prose-invert prose-sm max-w-none font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
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
