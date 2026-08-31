"use client";

import React, { useState } from "react";
import { TopologyNode, topologyNodes } from "@/data/infrastructure";
import { services } from "@/data/services";
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Server,
  Shield,
  Zap,
  Activity,
  HardDrive,
  Cpu,
  Layers,
  ArrowRight,
  Code,
} from "lucide-react";

interface NodeInspectorProps {
  node: TopologyNode | null;
  onClose: () => void;
  onSelectNode: (node: TopologyNode) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  onClose,
  onSelectNode,
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "compose" | "wiki">("overview");

  if (!node) return null;

  const serviceMatch = services.find(
    (s) =>
      s.id === node.id ||
      s.containerName === node.id ||
      node.name.toLowerCase().includes(s.name.toLowerCase()) ||
      (node.domain && s.domain === node.domain)
  );

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const connectedNodes = topologyNodes.filter((n) =>
    node.connections.includes(n.id)
  );

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[520px] z-30 pointer-events-auto flex flex-col border-l border-sand-300 dark:border-espresso-700 shadow-2xl backdrop-blur-2xl bg-sand-50/95 dark:bg-espresso-900/95 text-espresso-900 dark:text-sand-100 overflow-hidden animate-in slide-in-from-right duration-300">
      {/* Header Bar */}
      <div className="p-5 border-b border-sand-200 dark:border-espresso-800 flex items-start justify-between gap-4 bg-sand-100/50 dark:bg-espresso-950/40">
        <div className="flex items-start gap-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm"
            style={{
              backgroundColor: `${node.color}15`,
              borderColor: `${node.color}40`,
              color: node.color,
            }}
          >
            {node.category === "compute" && <Server className="w-5 h-5" />}
            {node.category === "security" && <Shield className="w-5 h-5" />}
            {node.category === "elo" && <Zap className="w-5 h-5" />}
            {node.category === "observability" && <Activity className="w-5 h-5" />}
            {node.category !== "compute" &&
              node.category !== "security" &&
              node.category !== "elo" &&
              node.category !== "observability" && <Layers className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: node.color }}
              />
              <span className="code-font text-[11px] uppercase tracking-wider text-espresso-500 dark:text-sand-400 font-semibold">
                Tier {node.tier} // {node.category}
              </span>
            </div>
            <h2 className="font-editorial text-xl font-bold text-espresso-900 dark:text-sand-100 mt-0.5">
              {node.name}
            </h2>
            <p className="text-xs text-espresso-500 dark:text-sand-400 font-mono mt-0.5">
              {node.sublabel}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg text-espresso-500 hover:text-espresso-900 dark:hover:text-sand-100 hover:bg-sand-200 dark:hover:bg-espresso-800 transition-all"
          title="Close Panel (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-sand-200 dark:border-espresso-800 px-5 bg-sand-100/30 dark:bg-espresso-950/20">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 text-xs font-mono border-b-2 font-semibold transition-all ${
            activeTab === "overview"
              ? "border-terracotta-500 text-terracotta-600 dark:text-terracotta-400"
              : "border-transparent text-espresso-500 dark:text-sand-400 hover:text-espresso-900 dark:hover:text-sand-100"
          }`}
        >
          01 // OVERVIEW
        </button>
        {serviceMatch?.composeCode && (
          <button
            onClick={() => setActiveTab("compose")}
            className={`px-4 py-2.5 text-xs font-mono border-b-2 font-semibold transition-all ${
              activeTab === "compose"
                ? "border-terracotta-500 text-terracotta-600 dark:text-terracotta-400"
                : "border-transparent text-espresso-500 dark:text-sand-400 hover:text-espresso-900 dark:hover:text-sand-100"
            }`}
          >
            02 // COMPOSE / SPEC
          </button>
        )}
        {serviceMatch?.wikiMarkdown && (
          <button
            onClick={() => setActiveTab("wiki")}
            className={`px-4 py-2.5 text-xs font-mono border-b-2 font-semibold transition-all ${
              activeTab === "wiki"
                ? "border-terracotta-500 text-terracotta-600 dark:text-terracotta-400"
                : "border-transparent text-espresso-500 dark:text-sand-400 hover:text-espresso-900 dark:hover:text-sand-100"
            }`}
          >
            03 // ARCHITECTURE
          </button>
        )}
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === "overview" && (
          <>
            {/* Hardware / Resource Allocation Bar */}
            {node.hardware && (
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-sand-200/50 dark:bg-espresso-800/60 border border-sand-300/60 dark:border-espresso-700/60">
                  <div className="flex items-center gap-1.5 text-espresso-500 dark:text-sand-400 text-[11px] font-mono">
                    <Cpu className="w-3.5 h-3.5 text-amber-500" />
                    <span>Allocated RAM</span>
                  </div>
                  <div className="code-font text-sm font-bold text-espresso-900 dark:text-sand-100 mt-1">
                    {node.hardware.ram}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-sand-200/50 dark:bg-espresso-800/60 border border-sand-300/60 dark:border-espresso-700/60">
                  <div className="flex items-center gap-1.5 text-espresso-500 dark:text-sand-400 text-[11px] font-mono">
                    <HardDrive className="w-3.5 h-3.5 text-purple-500" />
                    <span>Allocated Storage</span>
                  </div>
                  <div className="code-font text-sm font-bold text-espresso-900 dark:text-sand-100 mt-1">
                    {node.hardware.storage}
                  </div>
                </div>

                {node.hardware.cpu && (
                  <div className="p-3 rounded-xl bg-sand-200/50 dark:bg-espresso-800/60 border border-sand-300/60 dark:border-espresso-700/60 col-span-2">
                    <div className="flex items-center gap-1.5 text-espresso-500 dark:text-sand-400 text-[11px] font-mono">
                      <Server className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Host Node &amp; CPU</span>
                    </div>
                    <div className="code-font text-xs text-espresso-800 dark:text-sand-200 mt-1">
                      {node.hardware.node} • {node.hardware.cpu}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Network Endpoints */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-espresso-500 dark:text-sand-400 font-semibold">
                Network Endpoints
              </h3>

              <div className="space-y-2">
                {node.domain && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-sand-200/50 dark:bg-espresso-800/60 border border-sand-300/60 dark:border-espresso-700/60">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-terracotta-100 dark:bg-terracotta-900/50 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-300 dark:border-terracotta-800">
                        LAN
                      </span>
                      <span className="code-font text-xs text-espresso-900 dark:text-sand-100">
                        {node.domain}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => copyToClipboard(`http://${node.domain}`, "domain")}
                        className="p-1.5 rounded-lg text-espresso-500 hover:text-espresso-900 dark:hover:text-sand-100 hover:bg-sand-300/50 dark:hover:bg-espresso-700/50 text-xs flex items-center gap-1 font-mono transition-all"
                        title="Copy URL"
                      >
                        {copied === "domain" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href={`http://${node.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-espresso-500 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-sand-300/50 dark:hover:bg-espresso-700/50 transition-all"
                        title="Open Domain Endpoint"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {node.ip && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-sand-200/50 dark:bg-espresso-800/60 border border-sand-300/60 dark:border-espresso-700/60">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        IP
                      </span>
                      <span className="code-font text-xs text-espresso-900 dark:text-sand-100">
                        {node.ip}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => copyToClipboard(`http://${node.ip}`, "ip")}
                        className="p-1.5 rounded-lg text-espresso-500 hover:text-espresso-900 dark:hover:text-sand-100 hover:bg-sand-300/50 dark:hover:bg-espresso-700/50 text-xs flex items-center gap-1 font-mono transition-all"
                        title="Copy IP Endpoint"
                      >
                        {copied === "ip" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-espresso-500 dark:text-sand-400 font-semibold">
                System Purpose &amp; Architecture
              </h3>
              <p className="text-xs sm:text-sm text-espresso-700 dark:text-sand-200 leading-relaxed font-sans">
                {node.description}
              </p>
            </div>

            {/* Key Capabilities */}
            {node.features && node.features.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-espresso-500 dark:text-sand-400 font-semibold">
                  Key Capabilities
                </h3>
                <ul className="space-y-1.5">
                  {node.features.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-espresso-700 dark:text-sand-300 bg-sand-200/50 dark:bg-espresso-800/40 p-2 rounded-lg border border-sand-300/50 dark:border-espresso-700/50 font-sans"
                    >
                      <Check className="w-3.5 h-3.5 text-terracotta-500 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies */}
            {node.technologies && node.technologies.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-espresso-500 dark:text-sand-400 font-semibold">
                  Stack &amp; Technologies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {node.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-sand-200/70 dark:bg-espresso-800/80 text-espresso-700 dark:text-sand-300 border border-sand-300 dark:border-espresso-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Connected Topology Mesh */}
            {connectedNodes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-espresso-500 dark:text-sand-400 font-semibold">
                  Direct Mesh Links ({connectedNodes.length})
                </h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {connectedNodes.map((target) => (
                    <button
                      key={target.id}
                      onClick={() => onSelectNode(target)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-sand-200/40 hover:bg-sand-200/80 dark:bg-espresso-800/40 dark:hover:bg-espresso-800 border border-sand-300/60 dark:border-espresso-700 transition-all text-left group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: target.color }}
                        />
                        <div>
                          <div className="text-xs font-semibold text-espresso-900 dark:text-sand-100 group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400 transition-colors">
                            {target.name}
                          </div>
                          <div className="text-[11px] font-mono text-espresso-500 dark:text-sand-400">
                            {target.sublabel}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-espresso-400 dark:text-sand-500 group-hover:text-terracotta-500 transition-transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "compose" && serviceMatch?.composeCode && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-espresso-500 dark:text-sand-400">
                <Code className="w-4 h-4 text-terracotta-500" />
                <span>docker-compose.yml</span>
              </div>
              <button
                onClick={() => copyToClipboard(serviceMatch.composeCode, "compose")}
                className="px-2 py-1 rounded text-xs font-mono bg-sand-200 dark:bg-espresso-800 text-espresso-700 dark:text-sand-300 flex items-center gap-1 transition-all"
              >
                {copied === "compose" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied === "compose" ? "Copied" : "Copy YAML"}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-espresso-950 text-sand-200 border border-espresso-800 font-mono text-xs overflow-x-auto leading-relaxed">
              <code>{serviceMatch.composeCode}</code>
            </pre>
          </div>
        )}

        {activeTab === "wiki" && serviceMatch?.wikiMarkdown && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-sand-200/50 dark:bg-espresso-800/40 border border-sand-300/50 dark:border-espresso-700/50 font-mono text-xs text-espresso-800 dark:text-sand-200 leading-relaxed whitespace-pre-wrap">
              {serviceMatch.wikiMarkdown}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
