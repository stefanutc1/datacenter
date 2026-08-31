"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { topologyNodes, TopologyNode, SubsystemCategory } from "@/data/infrastructure";
import { services, ServiceItem } from "@/data/services";
import { Search, Terminal, ArrowRight, X, Sparkles, Server, Shield, Globe, Zap } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (node: TopologyNode) => void;
  onSelectSubsystem: (subsystem: SubsystemCategory) => void;
  onResetView: () => void;
}

interface CommandAction {
  id: string;
  type: "command" | "node" | "subsystem";
  title: string;
  subtitle: string;
  category?: string;
  icon?: any;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectNode,
  onSelectSubsystem,
  onResetView,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery("");
    }
  }, [isOpen]);

  // Build command actions list
  const allActions: CommandAction[] = useMemo(() => {
    const list: CommandAction[] = [];

    // System Navigation Commands
    list.push(
      {
        id: "cmd-reset",
        type: "command",
        title: "reset view",
        subtitle: "Reset 3D camera to global cluster overview",
        icon: Globe,
        action: () => {
          onResetView();
          onClose();
        },
      },
      {
        id: "cmd-compute",
        type: "subsystem",
        title: "go compute",
        subtitle: "Inspect dual hypervisors and KVM virtualization tier",
        icon: Server,
        action: () => {
          onSelectSubsystem("compute");
          onClose();
        },
      },
      {
        id: "cmd-security",
        type: "subsystem",
        title: "go security",
        subtitle: "Focus on OPNsense, Wazuh XDR SIEM, and Suricata IPS",
        icon: Shield,
        action: () => {
          onSelectSubsystem("security");
          onClose();
        },
      },
      {
        id: "cmd-elo",
        type: "subsystem",
        title: "go elo",
        subtitle: "Focus on ELO Autonomous AI control plane and LLM cascade",
        icon: Zap,
        action: () => {
          onSelectSubsystem("elo");
          onClose();
        },
      },
      {
        id: "cmd-edge",
        type: "subsystem",
        title: "go edge",
        subtitle: "Focus on ESP32 microcontrollers and physical IoT sensors",
        icon: Sparkles,
        action: () => {
          onSelectSubsystem("edge");
          onClose();
        },
      }
    );

    // Add all 44 Topology Nodes
    topologyNodes.forEach((node) => {
      list.push({
        id: `node-${node.id}`,
        type: "node",
        title: node.hostname ? `${node.hostname} // ${node.name}` : node.name,
        subtitle: `${node.sublabel || node.domain || node.ip || ""} · Tier ${node.tier} (${node.category})`,
        category: node.category,
        action: () => {
          onSelectNode(node);
          onClose();
        },
      });
    });

    return list;
  }, [onClose, onResetView, onSelectNode, onSelectSubsystem]);

  // Filter actions based on query
  const filteredActions = useMemo(() => {
    if (!query.trim()) return allActions.slice(0, 10);
    const q = query.toLowerCase().trim();
    return allActions
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          (item.category && item.category.toLowerCase().includes(q))
      )
      .slice(0, 12);
  }, [allActions, query]);

  // Keyboard navigation inside palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? filteredActions.length - 1 : prev - 1
        );
      } else if (e.key === "Enter" && filteredActions[selectedIndex]) {
        e.preventDefault();
        filteredActions[selectedIndex].action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-espresso-950/60 backdrop-blur-md font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-warm-card border border-warm rounded-2xl shadow-2xl overflow-hidden text-warm-primary animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-warm flex items-center gap-3 bg-warm-page/50">
          <Terminal className="w-5 h-5 text-terracotta-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search nodes, hostnames, IPs, or type 'go security'..."
            className="w-full bg-transparent border-none outline-none font-mono text-sm text-warm-primary placeholder:text-warm-secondary"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-warm-secondary hover:text-warm-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 rounded bg-warm-page text-[10px] font-mono border border-warm text-warm-secondary">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-warm-secondary">
              No matching infrastructure nodes or commands found for "{query}".
            </div>
          ) : (
            filteredActions.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-terracotta-500/15 border border-terracotta-500/40 text-warm-primary"
                      : "border border-transparent hover:bg-warm-page text-warm-secondary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? "bg-terracotta-500 text-sand-50"
                          : "bg-warm-page text-warm-secondary"
                      }`}
                    >
                      {item.icon ? (
                        <item.icon className="w-4 h-4" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-warm-primary">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-warm-secondary">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected
                        ? "text-terracotta-500 translate-x-0.5"
                        : "text-warm-secondary/40"
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="p-3 border-t border-warm bg-warm-page/60 flex items-center justify-between text-[10px] font-mono text-warm-secondary">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-warm-card border border-warm">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-warm-card border border-warm">↵</kbd> Select
            </span>
          </div>
          <span>HOMELAB DIGITAL TWIN // CLI</span>
        </div>
      </div>
    </div>
  );
};
