"use client";

import React, { useState, useMemo } from "react";
import { services, ServiceItem } from "@/data/services";
import { topologyNodes, TopologyNode } from "@/data/infrastructure";
import {
  Search,
  Server,
  HardDrive,
  Cpu,
  ArrowUpRight,
  Code,
  Copy,
  Check,
  X,
} from "lucide-react";

interface ServiceDirectoryProps {
  onFocusNode: (node: TopologyNode) => void;
}

const CATEGORIES = [
  { id: "all", label: "ALL SERVICES" },
  { id: "ai", label: "AI & LLM" },
  { id: "networking", label: "NETWORKING" },
  { id: "security", label: "SECURITY" },
  { id: "monitoring", label: "MONITORING" },
  { id: "cloud", label: "CLOUD & NAS" },
  { id: "automation", label: "AUTOMATION" },
  { id: "devops", label: "DEVOPS & GIT" },
  { id: "media", label: "MEDIA SUITE" },
  { id: "productivity", label: "PRODUCTIVITY" },
  { id: "vms", label: "VIRTUAL MACHINES" },
];

export const ServiceDirectory: React.FC<ServiceDirectoryProps> = ({
  onFocusNode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.domain && item.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.ip && item.ip.includes(searchQuery));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleFocusService = (srv: ServiceItem) => {
    const target = topologyNodes.find(
      (n) =>
        n.id.toLowerCase() === srv.id.toLowerCase() ||
        n.name.toLowerCase() === srv.name.toLowerCase() ||
        (n.domain && srv.domain && n.domain.toLowerCase() === srv.domain.toLowerCase())
    );
    if (target) {
      onFocusNode(target);
      document.getElementById("topology")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="services"
      className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans"
    >
      {/* Header */}
      <div className="space-y-3 mb-10 text-left">
        <div className="text-xs font-mono font-bold tracking-widest text-terracotta-500 uppercase">
          SERVICE MATRIX & DIRECTORY
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-warm-primary leading-tight">
          34 Production Microservices & Workloads
        </h2>
        <p className="text-base text-warm-secondary max-w-3xl leading-relaxed">
          Comprehensive inventory of containerized services running across Proxmox x86_64 and Apple Silicon ARM64 hypervisors with strict resource limits.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 md:pb-0 font-mono text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-terracotta-500 text-sand-50 font-bold shadow-sm"
                    : "bg-warm-card border border-warm text-warm-secondary hover:text-warm-primary hover:bg-warm-page"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-warm-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, IP, domain..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-warm-card border border-warm text-warm-primary placeholder:text-warm-secondary text-xs font-mono outline-none focus:border-terracotta-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="p-5 rounded-2xl bg-warm-card border border-warm shadow-sm hover:border-terracotta-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Card Top Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: srv.color }}
                  />
                  <div>
                    <h3 className="font-serif font-bold text-base text-warm-primary">
                      {srv.name}
                    </h3>
                    <span className="text-[11px] font-mono text-warm-secondary">
                      {srv.domain || srv.ip}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleFocusService(srv)}
                  className="p-1.5 rounded-lg bg-warm-page border border-warm text-terracotta-500 hover:text-terracotta-600 transition-colors"
                  title="View in 3D Topology"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-warm-secondary leading-relaxed line-clamp-2">
                {srv.description}
              </p>

              {/* Host Node & Resource Badges */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-warm-page border border-warm text-warm-primary font-medium">
                  {srv.ram} RAM
                </span>
                <span className="px-2 py-0.5 rounded bg-warm-page border border-warm text-warm-secondary">
                  {srv.storage}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-warm flex items-center justify-between">
              <span className="text-[10px] font-mono text-warm-secondary truncate max-w-[180px]">
                {srv.node}
              </span>

              <button
                onClick={() => setActiveModalService(srv)}
                className="flex items-center gap-1 text-[11px] font-mono text-terracotta-500 hover:text-terracotta-600 font-bold"
              >
                <Code className="w-3 h-3" />
                <span>COMPOSE</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Compose Modal */}
      {activeModalService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/70 backdrop-blur-md font-sans"
          onClick={() => setActiveModalService(null)}
        >
          <div
            className="w-full max-w-2xl bg-warm-card border border-warm rounded-2xl shadow-2xl overflow-hidden flex flex-col text-warm-primary"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-warm flex items-center justify-between bg-warm-page/50">
              <div className="flex items-center gap-2.5 font-serif font-bold text-lg">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activeModalService.color }}
                />
                <span>{activeModalService.name} // Spec</span>
              </div>
              <button
                onClick={() => setActiveModalService(null)}
                className="p-1 rounded-lg text-warm-secondary hover:text-warm-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[460px] overflow-y-auto font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-warm-secondary text-[11px]">
                  Docker Compose Manifest / Proxmox Provisioning
                </span>
                <button
                  onClick={() => handleCopy(activeModalService.composeCode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warm-page border border-warm text-xs font-mono font-bold hover:border-terracotta-500"
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

              <pre className="p-4 rounded-xl bg-espresso-950 text-sand-100 overflow-x-auto border border-espresso-800 leading-relaxed">
                <code>{activeModalService.composeCode}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
