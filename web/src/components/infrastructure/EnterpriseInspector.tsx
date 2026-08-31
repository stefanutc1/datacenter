"use client";

import React, { useState, useMemo } from "react";
import { TopologyNode, topologyNodes } from "@/data/infrastructure";
import { services, ServiceItem } from "@/data/services";
import { homelabArticles, cyberArticles, WikiArticle } from "@/data/wiki";
import {
  X,
  Copy,
  Check,
  Server,
  HardDrive,
  Cpu,
  Shield,
  Layers,
  Network,
  Activity,
  Zap,
  ArrowRight,
  Radio,
  ExternalLink,
  Code,
  FileText,
} from "lucide-react";

interface EnterpriseInspectorProps {
  node: TopologyNode | null;
  onClose: () => void;
  onSelectNode: (node: TopologyNode) => void;
}

type InspectorTab = "spec" | "cascade" | "compose" | "runbook";

export const EnterpriseInspector: React.FC<EnterpriseInspectorProps> = ({
  node,
  onClose,
  onSelectNode,
}) => {
  const [activeTab, setActiveTab] = useState<InspectorTab>("spec");
  const [copied, setCopied] = useState(false);

  // Fast node lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, TopologyNode>();
    topologyNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  // Match corresponding service item if any
  const matchedService: ServiceItem | undefined = useMemo(() => {
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

  // Match wiki runbook
  const matchedWiki: WikiArticle | undefined = useMemo(() => {
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

  // If this node is a host (Node 1, Node 2, Node 3, Node 4), list all hosted services/workloads
  const hostedWorkloads = useMemo(() => {
    if (!node) return [];
    const isHost = ["node1-pve", "node2-omv", "node3-arm", "k8s-node4"].includes(node.id);
    if (!isHost) return [];

    return (node.connections || [])
      .map((id) => nodeMap.get(id))
      .filter((n): n is TopologyNode => Boolean(n) && (n as TopologyNode).tier >= 2);
  }, [node, nodeMap]);

  // Direct connected topology nodes
  const adjacentNodes = useMemo(() => {
    if (!node) return [];
    return (node.connections || [])
      .map((id) => nodeMap.get(id))
      .filter((n): n is TopologyNode => Boolean(n));
  }, [node, nodeMap]);

  if (!node) return null;

  const composeCode =
    matchedService?.composeCode ||
    `# Infrastructure Spec: ${node.name}\n# Host: ${node.hardware?.node || "Bare-Metal"}\n# RAM Allocation: ${node.hardware?.ram || "Dynamic"}\n# Storage Pool: ${node.hardware?.storage || "Standard"}\ntier: ${node.tier}\ncategory: ${node.category}\nstatus: ${node.status}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(composeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] md:w-[520px] bg-warm-card/95 backdrop-blur-xl border-l border-warm shadow-2xl flex flex-col font-sans text-warm-primary transition-transform duration-200"
      aria-label="Enterprise Node Inspector"
    >
      {/* Inspector Header */}
      <div className="p-4 border-b border-warm flex items-start justify-between gap-4 bg-warm-page/60">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-warm font-mono font-bold text-sm shadow-sm"
            style={{ backgroundColor: `${node.color}20`, color: node.color }}
          >
            {node.hostname ? node.hostname.substring(0, 4) : "NODE"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg text-warm-primary leading-tight">
                {node.name}
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-warm-page border border-warm text-warm-secondary uppercase">
                {node.status}
              </span>
            </div>
            <div className="text-xs text-warm-secondary font-mono">
              {node.sublabel || node.domain || node.ip}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-warm-secondary hover:text-warm-primary hover:bg-warm-page border border-transparent hover:border-warm transition-colors"
          aria-label="Close Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center px-4 border-b border-warm bg-warm-card gap-5 text-xs font-mono">
        {(
          [
            { id: "spec", label: "01 // SPECIFICATION" },
            { id: "cascade", label: "02 // RELATIONSHIPS" },
            { id: "compose", label: "03 // MANIFEST" },
            { id: "runbook", label: "04 // RUNBOOK" },
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
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
        {/* TAB 1: SPECIFICATION */}
        {activeTab === "spec" && (
          <div className="space-y-5">
            {/* Architectural Role */}
            <div className="p-4 rounded-xl bg-warm-page border border-warm space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-terracotta-500 font-bold">
                SYSTEM ROLE & FUNCTION
              </div>
              <p className="text-xs text-warm-primary leading-relaxed">
                {node.why || node.description}
              </p>
            </div>

            {/* Hardware Capacity Specs */}
            {node.hardware && (
              <div className="space-y-2.5">
                <div className="text-xs font-mono uppercase tracking-wider text-warm-secondary">
                  Host & Hardware Capacity
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-lg bg-warm-page border border-warm">
                    <div className="text-[10px] font-mono text-warm-secondary uppercase">
                      Compute Host
                    </div>
                    <div className="text-xs font-mono font-bold text-warm-primary truncate">
                      {node.hardware.node}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-warm-page border border-warm">
                    <div className="text-[10px] font-mono text-warm-secondary uppercase">
                      Memory Allocation
                    </div>
                    <div className="text-xs font-mono font-bold text-warm-primary">
                      {node.hardware.ram}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-warm-page border border-warm">
                    <div className="text-[10px] font-mono text-warm-secondary uppercase">
                      Storage Pool
                    </div>
                    <div className="text-xs font-mono font-bold text-warm-primary truncate">
                      {node.hardware.storage}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-warm-page border border-warm">
                    <div className="text-[10px] font-mono text-warm-secondary uppercase">
                      Architecture Tier
                    </div>
                    <div className="text-xs font-mono font-bold text-warm-primary">
                      Tier {node.tier} ({node.category})
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hosted Workloads (If inspecting a Host Node) */}
            {hostedWorkloads.length > 0 && (
              <div className="space-y-2.5">
                <div className="text-xs font-mono uppercase tracking-wider text-warm-secondary flex items-center justify-between">
                  <span>Workloads Hosted on this Node ({hostedWorkloads.length})</span>
                  <span className="text-[10px] text-terracotta-500 font-mono">CLICK TO INSPECT</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {hostedWorkloads.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => onSelectNode(w)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg bg-warm-page border border-warm hover:border-terracotta-400 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: w.color }}
                        />
                        <span className="font-mono text-xs font-bold text-warm-primary group-hover:text-terracotta-500 truncate">
                          {w.hostname || w.name}
                        </span>
                        <span className="text-[10px] font-mono text-warm-secondary truncate">
                          {w.sublabel}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-warm-secondary group-hover:text-terracotta-500 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Network Endpoints & Protocols */}
            <div className="space-y-2.5">
              <div className="text-xs font-mono uppercase tracking-wider text-warm-secondary">
                Network Endpoints
              </div>
              <div className="p-3.5 rounded-xl bg-warm-page border border-warm space-y-2 font-mono text-xs">
                {node.ip && (
                  <div className="flex items-center justify-between">
                    <span className="text-warm-secondary">Direct Address</span>
                    <span className="font-bold text-warm-primary">{node.ip}</span>
                  </div>
                )}
                {node.port && (
                  <div className="flex items-center justify-between">
                    <span className="text-warm-secondary">Port</span>
                    <span className="font-bold text-warm-primary">:{node.port}</span>
                  </div>
                )}
                {node.domain && (
                  <div className="flex items-center justify-between">
                    <span className="text-warm-secondary">Domain</span>
                    <span className="font-bold text-terracotta-500">{node.domain}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Technologies */}
            {node.technologies && node.technologies.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-warm-secondary">
                  Technology Stack
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {node.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-warm-page border border-warm text-warm-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RELATIONSHIP CASCADE */}
        {activeTab === "cascade" && (
          <div className="space-y-6">
            {/* Service -> Host -> Perimeter -> Monitoring Relationship Flow */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-warm-secondary">
                System Relationship Chain
              </div>

              <div className="p-4 rounded-xl bg-warm-page border border-warm space-y-3 font-mono text-xs">
                {/* 1. Service / Workload */}
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-terracotta-500/15 text-terracotta-500">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-warm-secondary uppercase">Workload Node</div>
                    <div className="font-bold text-warm-primary">{node.name}</div>
                  </div>
                </div>

                <div className="ml-4 pl-3 border-l-2 border-warm h-4" />

                {/* 2. Virtualization Host */}
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-blue-500/15 text-blue-500">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-warm-secondary uppercase">Hosted On</div>
                    <div className="font-bold text-warm-primary">
                      {node.hardware?.node || "Proxmox Cluster"}
                    </div>
                  </div>
                </div>

                <div className="ml-4 pl-3 border-l-2 border-warm h-4" />

                {/* 3. Perimeter & Network */}
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-amber-500/15 text-amber-500">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-warm-secondary uppercase">Protected By</div>
                    <div className="font-bold text-warm-primary">
                      OPNsense Gateway · Suricata IPS
                    </div>
                  </div>
                </div>

                <div className="ml-4 pl-3 border-l-2 border-warm h-4" />

                {/* 4. Telemetry & Monitoring */}
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-emerald-500/15 text-emerald-500">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-warm-secondary uppercase">Monitored By</div>
                    <div className="font-bold text-warm-primary">
                      Prometheus TSDB · Scrutiny SMART
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Mesh Links */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-warm-secondary flex items-center justify-between">
                <span>Direct Mesh Connections ({adjacentNodes.length})</span>
                <span className="text-[10px] text-terracotta-500 font-mono">CLICK TO JUMP</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {adjacentNodes.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => onSelectNode(target)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-warm-page border border-warm hover:border-terracotta-400 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: target.color }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-mono font-bold text-warm-primary group-hover:text-terracotta-500 truncate">
                          {target.hostname || target.name}
                        </div>
                        <div className="text-[11px] text-warm-secondary truncate font-mono">
                          {target.sublabel || target.domain}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-warm-secondary group-hover:text-terracotta-500 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPOSE / PROVISIONING MANIFEST */}
        {activeTab === "compose" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-warm-secondary">
                Configuration Spec
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-warm-page border border-warm hover:border-terracotta-500 text-warm-primary transition-colors font-bold"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY MANIFEST</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-espresso-950 text-sand-100 font-mono text-xs overflow-x-auto border border-espresso-800 leading-relaxed">
              <code>{composeCode}</code>
            </pre>
          </div>
        )}

        {/* TAB 4: ENGINEERING RUNBOOK */}
        {activeTab === "runbook" && (
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-warm-secondary">
              Architecture Runbook
            </div>
            {matchedWiki ? (
              <div className="space-y-3 font-sans">
                <h3 className="font-serif font-bold text-base text-warm-primary">
                  {matchedWiki.title}
                </h3>
                <p className="text-xs text-warm-secondary leading-relaxed italic border-l-2 border-terracotta-500 pl-3">
                  {matchedWiki.summary}
                </p>
                <div className="text-xs text-warm-primary whitespace-pre-wrap leading-relaxed pt-2 font-mono bg-warm-page p-4 rounded-xl border border-warm">
                  {matchedWiki.content}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-warm-page border border-warm text-center font-mono text-xs text-warm-secondary">
                No dedicated runbook file attached to this node.
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
