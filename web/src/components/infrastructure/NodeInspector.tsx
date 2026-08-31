"use client";

import React, { useState, useMemo } from "react";
import { TopologyNode } from "@/data/infrastructure";
import { services, ServiceItem } from "@/data/services";
import { homelabArticles, cyberArticles, WikiArticle } from "@/data/wiki";
import { DependencyGraph } from "./DependencyGraph";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Server,
  HardDrive,
  Cpu,
  Shield,
  Layers,
  Network,
  Activity,
  Zap,
} from "lucide-react";

interface NodeInspectorProps {
  node: TopologyNode | null;
  onClose: () => void;
  onSelectNode: (node: TopologyNode) => void;
}

type TabType = "overview" | "compose" | "architecture" | "dependencies";

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  onClose,
  onSelectNode,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [copied, setCopied] = useState(false);

  // Cross-reference node with services catalog
  const matchingService: ServiceItem | undefined = useMemo(() => {
    if (!node) return undefined;
    const target = node.id.toLowerCase();
    return services.find(
      (s) =>
        s.id.toLowerCase() === target ||
        s.containerName.toLowerCase().includes(target) ||
        (node.domain && s.domain && s.domain.toLowerCase() === node.domain.toLowerCase()) ||
        s.name.toLowerCase() === node.name.toLowerCase()
    );
  }, [node]);

  // Cross-reference wiki articles
  const matchingWiki: WikiArticle | undefined = useMemo(() => {
    if (!node) return undefined;
    const docId = node.wikiDoc?.toLowerCase();
    const allArticles = [...homelabArticles, ...cyberArticles];
    if (docId) {
      const found = allArticles.find((a) => a.id.toLowerCase() === docId);
      if (found) return found;
    }
    return allArticles.find(
      (a) =>
        a.id.toLowerCase() === node.id.toLowerCase() ||
        a.title.toLowerCase().includes(node.name.toLowerCase())
    );
  }, [node]);

  if (!node) return null;

  const composeCode = matchingService?.composeCode || `# Infrastructure Node: ${node.name}\n# Host: ${node.hardware?.node || "Proxmox Core"}\n# RAM: ${node.hardware?.ram || "Dynamic"}\n# Storage: ${node.hardware?.storage || "N/A"}\nstatus: ${node.status}\ncategory: ${node.category}\ntier: ${node.tier}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(composeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] md:w-[500px] bg-warm-card/95 backdrop-blur-xl border-l border-warm shadow-2xl flex flex-col transition-transform duration-300 ease-out font-sans text-warm-primary"
      aria-label="Node Inspector"
    >
      {/* Header */}
      <div className="p-5 border-b border-warm flex items-start justify-between gap-4 bg-warm-page/50">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-warm/80 font-mono font-bold text-sm shadow-sm"
            style={{ backgroundColor: `${node.color}25`, color: node.color }}
          >
            {node.hostname ? node.hostname.substring(0, 4) : "NODE"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg text-warm-primary leading-tight">
                {node.name}
              </h2>
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: node.status === "online" ? "#10b981" : "#f59e0b" }}
                title={`Status: ${node.status}`}
              />
            </div>
            <div className="text-xs text-warm-secondary font-mono">
              {node.sublabel || node.domain || node.ip}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg text-warm-secondary hover:text-warm-primary hover:bg-warm-page/80 border border-transparent hover:border-warm transition-colors"
          aria-label="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-5 border-b border-warm bg-warm-card gap-6 text-xs font-mono">
        {(
          [
            { id: "overview", label: "01 // OVERVIEW" },
            { id: "compose", label: "02 // COMPOSE" },
            { id: "architecture", label: "03 // RUNBOOK" },
            { id: "dependencies", label: "04 // GRAPH" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 relative tracking-wider transition-colors ${
              activeTab === tab.id
                ? "text-terracotta-500 font-bold"
                : "text-warm-secondary hover:text-warm-primary"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta-500 rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Architectural Purpose */}
            {node.why && (
              <div className="p-4 rounded-xl bg-warm-page border border-warm space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-terracotta-500 font-bold">
                  WHY DOES THIS EXIST?
                </div>
                <p className="text-xs text-warm-primary leading-relaxed">
                  {node.why}
                </p>
              </div>
            )}

            {/* Hardware Allocation Matrix */}
            {node.hardware && (
              <div className="space-y-2.5">
                <div className="text-xs font-mono uppercase tracking-wider text-warm-secondary">
                  Host & Hardware Capacity
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-lg bg-warm-page border border-warm flex items-center gap-3">
                    <Server className="w-4 h-4 text-terracotta-500" />
                    <div>
                      <div className="text-[10px] font-mono text-warm-secondary uppercase">
                        Virtualization Host
                      </div>
                      <div className="text-xs font-mono font-bold text-warm-primary">
                        {node.hardware.node}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-warm-page border border-warm flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="text-[10px] font-mono text-warm-secondary uppercase">
                        Memory Cap
                      </div>
                      <div className="text-xs font-mono font-bold text-warm-primary">
                        {node.hardware.ram}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-warm-page border border-warm flex items-center gap-3">
                    <HardDrive className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="text-[10px] font-mono text-warm-secondary uppercase">
                        Storage Pool
                      </div>
                      <div className="text-xs font-mono font-bold text-warm-primary">
                        {node.hardware.storage}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-warm-page border border-warm flex items-center gap-3">
                    <Network className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="text-[10px] font-mono text-warm-secondary uppercase">
                        System Tier
                      </div>
                      <div className="text-xs font-mono font-bold text-warm-primary">
                        Tier {node.tier} ({node.category})
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description & Features */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-warm-secondary">
                Capabilities & Workloads
              </div>
              <p className="text-xs text-warm-primary leading-relaxed">
                {node.description}
              </p>

              {node.features && node.features.length > 0 && (
                <ul className="space-y-2 pt-1">
                  {node.features.map((feat, i) => (
                    <li
                      key={i}
                      className="text-xs text-warm-secondary flex items-start gap-2"
                    >
                      <span className="text-terracotta-500 font-mono mt-0.5">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Technologies */}
            {node.technologies && node.technologies.length > 0 && (
              <div className="space-y-2.5">
                <div className="text-xs font-mono uppercase tracking-wider text-warm-secondary">
                  Technology Stack
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {node.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-warm-page border border-warm text-warm-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "compose" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-wider text-warm-secondary">
                Configuration Spec
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-warm-page border border-warm hover:border-terracotta-500 text-warm-primary transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY SPEC</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-espresso-950 text-sand-100 font-mono text-xs overflow-x-auto border border-espresso-800 leading-relaxed">
              <code>{composeCode}</code>
            </pre>
          </div>
        )}

        {activeTab === "architecture" && (
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-warm-secondary">
              Engineering Documentation
            </div>
            {matchingWiki ? (
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-base text-warm-primary">
                  {matchingWiki.title}
                </h3>
                <p className="text-xs text-warm-secondary leading-relaxed italic border-l-2 border-terracotta-500 pl-3">
                  {matchingWiki.summary}
                </p>
                <div className="text-xs text-warm-primary whitespace-pre-wrap leading-relaxed pt-2 font-sans">
                  {matchingWiki.content}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-warm-page border border-warm text-center space-y-2">
                <div className="text-xs font-mono text-warm-secondary">
                  No dedicated runbook file attached to this node.
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "dependencies" && (
          <DependencyGraph node={node} onSelectNode={onSelectNode} />
        )}
      </div>
    </aside>
  );
};
