"use client";

import React, { useState } from "react";
import { HeaderNav } from "@/components/editorial/HeaderNav";
import { HeroSection } from "@/components/sections/HeroSection";
import { TopologySection } from "@/components/sections/TopologySection";
import { HardwareFleetSection } from "@/components/sections/HardwareFleetSection";
import { ServicesCatalogSection } from "@/components/sections/ServicesCatalogSection";
import { ArchitectureNarrativeSection } from "@/components/sections/ArchitectureNarrativeSection";
import { BootTerminal } from "@/components/editorial/BootTerminal";
import { WikiModal } from "@/components/editorial/WikiModal";
import { Layers, Github, Heart } from "lucide-react";

export default function HomelabPage() {
  const [hasBooted, setHasBooted] = useState(false);
  const [showBootTerminal, setShowBootTerminal] = useState(false);
  const [isWikiOpen, setIsWikiOpen] = useState(false);

  const handleBootComplete = () => {
    setHasBooted(true);
    setShowBootTerminal(false);
  };

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-espresso-950 text-espresso-900 dark:text-sand-100 transition-colors selection:bg-terracotta-500/25 selection:text-terracotta-800 dark:selection:text-terracotta-200">
      {/* 1. Cinematic Boot Sequence */}
      {(!hasBooted || showBootTerminal) && (
        <BootTerminal onComplete={handleBootComplete} />
      )}

      {/* 2. Top Header Navigation with Theme Switcher */}
      <HeaderNav
        onTriggerBoot={() => setShowBootTerminal(true)}
        onOpenWiki={() => setIsWikiOpen(true)}
      />

      {/* 3. Main Multi-Section Descriptive Homepage */}
      <main className="flex flex-col">
        {/* Hero Section */}
        <HeroSection />

        {/* 3D Digital Twin & Topology Section */}
        <TopologySection />

        {/* Heterogeneous Hardware Fleet Section */}
        <HardwareFleetSection />

        {/* Workloads & Services Directory Section */}
        <ServicesCatalogSection />

        {/* Architecture & Engineering Principles Section */}
        <ArchitectureNarrativeSection />
      </main>

      {/* 4. Editorial Footer */}
      <footer className="py-12 border-t border-sand-300 dark:border-espresso-800 bg-sand-100 dark:bg-espresso-900/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-espresso-500 dark:text-sand-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-terracotta-500 flex items-center justify-center text-white text-[10px]">
              <Layers className="w-3 h-3" />
            </div>
            <span className="font-editorial font-bold text-espresso-800 dark:text-sand-200 text-sm">
              Stefanut Homelab
            </span>
            <span>•</span>
            <span>Autonomous Virtualization &amp; AI</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/stefanutc1/homelab"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-terracotta-600 dark:hover:text-terracotta-400 flex items-center gap-1 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>stefanutc1/homelab</span>
            </a>
            <span>•</span>
            <span>Zero-Trust WireGuard Mesh</span>
          </div>
        </div>
      </footer>

      {/* 5. Wiki & Runbook Documentation Modal */}
      <WikiModal
        isOpen={isWikiOpen}
        onClose={() => setIsWikiOpen(false)}
      />
    </div>
  );
}
