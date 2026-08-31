"use client";

import React, { useState, useMemo } from "react";
import { services, ServiceItem } from "@/data/services";
import { Search, ExternalLink, Copy, Check, Server, Layers, Cpu, HardDrive, Code, X } from "lucide-react";

export const ServicesCatalogSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeComposeService, setActiveComposeService] = useState<ServiceItem | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Services (33)" },
    { id: "vms", label: "Virtual Machines (2)" },
    { id: "networking", label: "Network & Ingress" },
    { id: "security", label: "Security & SIEM" },
    { id: "management", label: "Cluster Management" },
    { id: "automation", label: "Automation & Home" },
    { id: "media", label: "Media & Storage" },
    { id: "monitoring", label: "Monitoring & Observability" },
    { id: "ai", label: "AI & Intelligence" },
  ];

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.containerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.domain && s.domain.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="services" className="py-16 sm:py-24 border-b border-sand-300 dark:border-espresso-800 bg-sand-100 dark:bg-espresso-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-terracotta-600 dark:text-terracotta-400 font-semibold">
              <Layers className="w-4 h-4" />
              <span>Production Workload Directory</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-espresso-900 dark:text-sand-100 tracking-tight">
              Workload Catalog &amp; Resource Allocations
            </h2>
            <p className="text-sm sm:text-base text-espresso-600 dark:text-sand-300 leading-relaxed font-sans">
              All 33 containers and virtual machines running across the homelab with precise RAM and NVMe/HDD storage metrics.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-400 dark:text-sand-500" />
            <input
              type="text"
              placeholder="Search services, tags, ports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sand-50 dark:bg-espresso-900 border border-sand-300 dark:border-espresso-700 text-xs font-mono text-espresso-900 dark:text-sand-100 placeholder:text-espresso-400 dark:placeholder:text-sand-500 focus:outline-none focus:border-terracotta-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-terracotta-500 text-white font-semibold shadow-sm"
                  : "bg-sand-200/80 dark:bg-espresso-800 text-espresso-600 dark:text-sand-300 hover:bg-sand-300 dark:hover:bg-espresso-700 border border-sand-300 dark:border-espresso-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl p-5 warm-card flex flex-col justify-between space-y-4"
            >
              {/* Card Top */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="code-font text-[11px] font-semibold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-wider">
                      {service.containerName} • {service.node}
                    </span>
                    <h3 className="font-editorial text-lg font-bold text-espresso-900 dark:text-sand-100 leading-snug">
                      {service.name}
                    </h3>
                  </div>

                  <span
                    className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: service.color }}
                  />
                </div>

                <p className="text-xs text-espresso-600 dark:text-sand-300 line-clamp-2 leading-relaxed font-sans">
                  {service.description}
                </p>
              </div>

              {/* Hardware Allocations Bar */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-sand-200 dark:border-espresso-800 text-xs font-mono">
                <div className="p-2 rounded-lg bg-sand-200/50 dark:bg-espresso-900/60 border border-sand-300/60 dark:border-espresso-800">
                  <div className="flex items-center gap-1 text-[10px] text-espresso-500 dark:text-sand-400">
                    <Cpu className="w-3 h-3 text-amber-500" />
                    <span>Allocated RAM</span>
                  </div>
                  <div className="font-bold text-espresso-900 dark:text-sand-100 mt-0.5">
                    {service.ram}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-sand-200/50 dark:bg-espresso-900/60 border border-sand-300/60 dark:border-espresso-800">
                  <div className="flex items-center gap-1 text-[10px] text-espresso-500 dark:text-sand-400">
                    <HardDrive className="w-3 h-3 text-purple-500" />
                    <span>Allocated Storage</span>
                  </div>
                  <div className="font-bold text-espresso-900 dark:text-sand-100 mt-0.5">
                    {service.storage}
                  </div>
                </div>
              </div>

              {/* Card Footer: Endpoints & Compose */}
              <div className="flex items-center justify-between pt-2 border-t border-sand-200 dark:border-espresso-800 text-xs font-mono">
                <div className="flex items-center gap-2">
                  {service.domain ? (
                    <a
                      href={`http://${service.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terracotta-600 dark:text-terracotta-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>{service.domain}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-espresso-500 dark:text-sand-400">
                      {service.ip}:{service.port}
                    </span>
                  )}
                </div>

                {service.composeCode && (
                  <button
                    onClick={() => setActiveComposeService(service)}
                    className="p-1.5 rounded-md hover:bg-sand-200 dark:hover:bg-espresso-800 text-espresso-600 dark:text-sand-400 hover:text-espresso-900 dark:hover:text-sand-100 transition-colors"
                    title="View Compose Config"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Compose Code Modal */}
        {activeComposeService && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl warm-card border border-sand-300 dark:border-espresso-700 shadow-2xl flex flex-col overflow-hidden bg-sand-50 dark:bg-espresso-900">
              <div className="p-5 border-b border-sand-200 dark:border-espresso-800 flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-xl font-bold text-espresso-900 dark:text-sand-100">
                    {activeComposeService.name}
                  </h3>
                  <p className="text-xs font-mono text-espresso-500 dark:text-sand-400 mt-0.5">
                    docker-compose.yml configuration
                  </p>
                </div>
                <button
                  onClick={() => setActiveComposeService(null)}
                  className="p-2 rounded-lg text-espresso-500 hover:text-espresso-900 dark:hover:text-sand-100 hover:bg-sand-200 dark:hover:bg-espresso-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <pre className="p-4 rounded-xl bg-espresso-950 text-sand-200 font-mono text-xs overflow-x-auto leading-relaxed border border-espresso-800">
                  <code>{activeComposeService.composeCode}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
