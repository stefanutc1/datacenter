"use client";

import React, { useState, useMemo } from "react";
import {
  topologyNodes,
  TopologyNode,
  SubsystemCategory,
  subsystemPresets,
} from "@/data/infrastructure";
import { services, ServiceItem } from "@/data/services";
import {
  Search,
  Server,
  Shield,
  Zap,
  Activity,
  Boxes,
  Globe,
  Radio,
  Layers,
  HardDrive,
  Folder,
  ChevronRight,
  Filter,
  CheckCircle,
} from "lucide-react";

interface InfrastructureSidebarProps {
  activeSubsystem: SubsystemCategory;
  selectedNode: TopologyNode | null;
  onSelectSubsystem: (subsystem: SubsystemCategory) => void;
  onSelectNode: (node: TopologyNode) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const CATEGORY_ITEMS: { id: SubsystemCategory; label: string; icon: any }[] = [
  { id: "system", label: "GLOBAL OVERVIEW", icon: Globe },
  { id: "compute", label: "COMPUTE & VIRTUALIZATION", icon: Server },
  { id: "network", label: "NETWORK & VLANS", icon: Globe },
  { id: "security", label: "SECURITY & FIREWALL", icon: Shield },
  { id: "orchestration", label: "KUBERNETES & GITOPS", icon: Boxes },
  { id: "automation", label: "AUTOMATION PIPELINES", icon: Layers },
  { id: "observability", label: "OBSERVABILITY & LOGS", icon: Activity },
  { id: "services", label: "SERVICE CATALOG", icon: Folder },
  { id: "elo", label: "AI CONTROL PLANE", icon: Zap },
  { id: "edge", label: "EDGE & IOT SENSORS", icon: Radio },
  { id: "projects", label: "PROJECTS & LABS", icon: HardDrive },
];

export const InfrastructureSidebar: React.FC<InfrastructureSidebarProps> = ({
  activeSubsystem,
  selectedNode,
  onSelectSubsystem,
  onSelectNode,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [activeTab, setActiveTab] = useState<"subsystems" | "services" | "nodes">("subsystems");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered Services List
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.toLowerCase().trim();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.domain && s.domain.toLowerCase().includes(q)) ||
        (s.node && s.node.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Filtered Nodes List
  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return topologyNodes;
    const q = searchQuery.toLowerCase().trim();
    return topologyNodes.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        (n.hostname && n.hostname.toLowerCase().includes(q)) ||
        n.category.toLowerCase().includes(q) ||
        (n.domain && n.domain.toLowerCase().includes(q)) ||
        (n.ip && n.ip.includes(q))
    );
  }, [searchQuery]);

  // Quick lookup from service to topology node
  const handleSelectService = (srv: ServiceItem) => {
    const target = topologyNodes.find(
      (n) =>
        n.id.toLowerCase() === srv.id.toLowerCase() ||
        n.name.toLowerCase() === srv.name.toLowerCase() ||
        (n.domain && srv.domain && n.domain.toLowerCase() === srv.domain.toLowerCase())
    );
    if (target) {
      onSelectNode(target);
    }
  };

  return (
    <aside
      className={`relative z-30 flex flex-col bg-warm-card/90 backdrop-blur-xl border-r border-warm transition-all duration-300 font-sans ${
        isCollapsed ? "w-14" : "w-80 sm:w-88"
      }`}
      aria-label="Infrastructure Index"
    >
      {/* Sidebar Header */}
      <div className="p-3 border-b border-warm flex items-center justify-between bg-warm-page/50">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-terracotta-500" />
            <span className="font-mono text-xs font-bold tracking-wider text-warm-primary uppercase">
              INFRASTRUCTURE INDEX
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-warm-secondary hover:text-warm-primary hover:bg-warm-page transition-colors mx-auto"
          title={isCollapsed ? "Expand Index Panel" : "Collapse Index Panel"}
          aria-label="Toggle Sidebar"
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-200 ${
              isCollapsed ? "" : "rotate-180"
            }`}
          />
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Index Tabs */}
          <div className="flex items-center px-3 border-b border-warm bg-warm-page/30 gap-1 text-[11px] font-mono">
            <button
              onClick={() => setActiveTab("subsystems")}
              className={`flex-1 py-2.5 text-center font-bold tracking-wider transition-colors border-b-2 ${
                activeTab === "subsystems"
                  ? "border-terracotta-500 text-terracotta-500"
                  : "border-transparent text-warm-secondary hover:text-warm-primary"
              }`}
            >
              LAYERS ({CATEGORY_ITEMS.length})
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`flex-1 py-2.5 text-center font-bold tracking-wider transition-colors border-b-2 ${
                activeTab === "services"
                  ? "border-terracotta-500 text-terracotta-500"
                  : "border-transparent text-warm-secondary hover:text-warm-primary"
              }`}
            >
              SERVICES ({services.length})
            </button>
            <button
              onClick={() => setActiveTab("nodes")}
              className={`flex-1 py-2.5 text-center font-bold tracking-wider transition-colors border-b-2 ${
                activeTab === "nodes"
                  ? "border-terracotta-500 text-terracotta-500"
                  : "border-transparent text-warm-secondary hover:text-warm-primary"
              }`}
            >
              NODES ({topologyNodes.length})
            </button>
          </div>

          {/* Quick Search */}
          <div className="p-3 border-b border-warm bg-warm-page/20">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-warm-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter index..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-warm-page border border-warm text-warm-primary placeholder:text-warm-secondary text-xs font-mono outline-none focus:border-terracotta-500 transition-colors"
              />
            </div>
          </div>

          {/* Scrollable Items List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
            {/* 1. SUBSYSTEM LAYERS */}
            {activeTab === "subsystems" && (
              <div className="space-y-1">
                {CATEGORY_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSubsystem === item.id;
                  const preset = subsystemPresets[item.id];
                  const nodeCount = preset?.highlightedNodes?.length || 0;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectSubsystem(item.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                        isActive
                          ? "bg-terracotta-500/15 border border-terracotta-500/40 text-warm-primary font-bold"
                          : "border border-transparent hover:bg-warm-page text-warm-secondary hover:text-warm-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 ${
                            isActive ? "text-terracotta-500" : "text-warm-secondary"
                          }`}
                        />
                        <span className="truncate font-mono text-xs">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-warm-page border border-warm text-warm-secondary">
                        {nodeCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. SERVICES LIST */}
            {activeTab === "services" && (
              <div className="space-y-1">
                {filteredServices.map((srv) => {
                  const isNodeSelected =
                    selectedNode?.id.toLowerCase() === srv.id.toLowerCase() ||
                    selectedNode?.name.toLowerCase() === srv.name.toLowerCase();

                  return (
                    <button
                      key={srv.id}
                      onClick={() => handleSelectService(srv)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                        isNodeSelected
                          ? "bg-terracotta-500/15 border border-terracotta-500 text-warm-primary font-bold shadow-sm"
                          : "border border-transparent hover:bg-warm-page text-warm-secondary hover:text-warm-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: srv.color }}
                        />
                        <div className="truncate">
                          <div className="text-xs font-mono font-medium text-warm-primary truncate">
                            {srv.name}
                          </div>
                          <div className="text-[10px] text-warm-secondary truncate font-mono">
                            {srv.node.split("·")[0]?.trim() || srv.node}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-warm-secondary flex-shrink-0">
                        <span>{srv.ram.split(" ")[0]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 3. NODES LIST */}
            {activeTab === "nodes" && (
              <div className="space-y-1">
                {filteredNodes.map((n) => {
                  const isSelected = selectedNode?.id === n.id;
                  return (
                    <button
                      key={n.id}
                      onClick={() => onSelectNode(n)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? "bg-terracotta-500/15 border border-terracotta-500 text-warm-primary font-bold shadow-sm"
                          : "border border-transparent hover:bg-warm-page text-warm-secondary hover:text-warm-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: n.color }}
                        />
                        <div className="truncate">
                          <div className="text-xs font-mono font-medium text-warm-primary truncate">
                            {n.hostname ? `${n.hostname} // ${n.name}` : n.name}
                          </div>
                          <div className="text-[10px] text-warm-secondary truncate font-mono">
                            Tier {n.tier} · {n.category}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-warm-secondary flex-shrink-0">
                        {n.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Summary Footer */}
          <div className="p-3 border-t border-warm bg-warm-page/50 font-mono text-[10px] text-warm-secondary flex items-center justify-between">
            <span>44 NODES · 34 SERVICES</span>
            <span className="text-terracotta-500 font-bold">ACTIVE MESH</span>
          </div>
        </>
      )}
    </aside>
  );
};
