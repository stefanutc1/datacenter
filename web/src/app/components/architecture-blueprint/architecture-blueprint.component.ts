import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-architecture-blueprint',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="blueprint" class="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      
      <div class="space-y-2 mb-8">
        <div class="text-xs font-mono font-bold tracking-widest text-terracotta-400 uppercase">
          ENGINEERING BLUEPRINT & NETWORK SCHEMATICS
        </div>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-sand-50 tracking-tight">
          Cluster Architecture Blueprint
        </h2>
        <p class="text-sm text-sand-300 max-w-3xl font-sans font-normal leading-relaxed">
          Technical specifications for VLAN isolation, cyber defense toolchains, digital forensics (DFIR), hypervisor RAM allocation budgets, and AI fallback cascades.
        </p>
      </div>

      <!-- Blueprint Tabs -->
      <div class="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2 font-sans">
        <button
          (click)="activeTab = 'vlan'"
          [class.bg-terracotta-500]="activeTab === 'vlan'"
          [class.text-sand-50]="activeTab === 'vlan'"
          [class.font-semibold]="activeTab === 'vlan'"
          [class.text-sand-300]="activeTab !== 'vlan'"
          [class.bg-[#1c1611]]="activeTab !== 'vlan'"
          class="px-4 py-2 rounded-xl text-xs font-medium border border-clay-700/50 transition-all whitespace-nowrap"
        >
          VLAN Segmentation Matrix
        </button>
        <button
          (click)="activeTab = 'cyber'"
          [class.bg-terracotta-500]="activeTab === 'cyber'"
          [class.text-sand-50]="activeTab === 'cyber'"
          [class.font-semibold]="activeTab === 'cyber'"
          [class.text-sand-300]="activeTab !== 'cyber'"
          [class.bg-[#1c1611]]="activeTab !== 'cyber'"
          class="px-4 py-2 rounded-xl text-xs font-medium border border-clay-700/50 transition-all whitespace-nowrap"
        >
          Cyber & DFIR Forensics Stack
        </button>
        <button
          (click)="activeTab = 'memory'"
          [class.bg-terracotta-500]="activeTab === 'memory'"
          [class.text-sand-50]="activeTab === 'memory'"
          [class.font-semibold]="activeTab === 'memory'"
          [class.text-sand-300]="activeTab !== 'memory'"
          [class.bg-[#1c1611]]="activeTab !== 'memory'"
          class="px-4 py-2 rounded-xl text-xs font-medium border border-clay-700/50 transition-all whitespace-nowrap"
        >
          RAM Allocation Budgets
        </button>
        <button
          (click)="activeTab = 'ai'"
          [class.bg-terracotta-500]="activeTab === 'ai'"
          [class.text-sand-50]="activeTab === 'ai'"
          [class.font-semibold]="activeTab === 'ai'"
          [class.text-sand-300]="activeTab !== 'ai'"
          [class.bg-[#1c1611]]="activeTab !== 'ai'"
          class="px-4 py-2 rounded-xl text-xs font-medium border border-clay-700/50 transition-all whitespace-nowrap"
        >
          AI Routing Cascade (ELO)
        </button>
      </div>

      <!-- TAB 1: VLAN MATRIX -->
      @if (activeTab === 'vlan') {
        <div class="rounded-2xl bg-[#1a140f] border border-clay-700/40 shadow-xl overflow-hidden font-mono text-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-clay-700/40 bg-[#211b15] text-sand-300 text-[11px] uppercase tracking-wider">
                  <th class="p-4">VLAN ID</th>
                  <th class="p-4">Network Segment</th>
                  <th class="p-4">Subnet CIDR</th>
                  <th class="p-4">Gateway</th>
                  <th class="p-4">Attached Workloads</th>
                  <th class="p-4">Security Policy</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-clay-800/40">
                @for (vlan of vlanMatrix; track vlan.id) {
                  <tr class="hover:bg-clay-800/30 transition-colors">
                    <td class="p-4 font-bold text-terracotta-400 whitespace-nowrap">{{ vlan.id }}</td>
                    <td class="p-4 font-medium text-sand-100">{{ vlan.name }}</td>
                    <td class="p-4 text-sand-300 whitespace-nowrap">{{ vlan.subnet }}</td>
                    <td class="p-4 text-sand-300 whitespace-nowrap">{{ vlan.gateway }}</td>
                    <td class="p-4 text-sand-200">{{ vlan.nodes }}</td>
                    <td class="p-4 text-sand-400">{{ vlan.firewallPolicy }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- TAB 2: CYBER & DFIR FORENSICS STACK -->
      @if (activeTab === 'cyber') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-xs">
          @for (pillar of cyberPillars; track pillar.title) {
            <div class="p-6 rounded-2xl bg-[#1a140f] border border-clay-700/40 shadow-xl space-y-3.5 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between border-b border-clay-700/30 pb-3">
                  <h3 class="font-serif font-bold text-sand-50 text-base tracking-wide">
                    {{ pillar.title }}
                  </h3>
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-terracotta-500/15 text-terracotta-400 border border-terracotta-500/30 uppercase">
                    {{ pillar.badge }}
                  </span>
                </div>

                <p class="text-xs text-sand-300 leading-relaxed font-sans">
                  {{ pillar.description }}
                </p>

                <!-- Tools List -->
                <div class="space-y-1.5 pt-1">
                  <div class="text-[10px] font-mono text-sand-400 uppercase tracking-wider">Technologies & Tooling</div>
                  <div class="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    @for (tool of pillar.tools; track tool) {
                      <span class="px-2 py-0.5 rounded bg-[#241c15] border border-clay-700/40 text-sand-200">
                        {{ tool }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- TAB 3: RAM BUDGETS -->
      @if (activeTab === 'memory') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          @for (b of memoryBudgets; track b.node) {
            <div class="p-6 rounded-2xl bg-[#1a140f] border border-clay-700/40 shadow-xl space-y-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="font-bold text-sm text-sand-50 font-mono">{{ b.node }}</h3>
                  <div class="text-[11px] text-sand-400 mt-0.5">Physical Ceiling: {{ b.totalRam }}</div>
                </div>
                <div class="text-right">
                  <span class="text-base font-bold text-terracotta-400">{{ b.allocatedRam }}</span>
                  <div class="text-[10px] text-sand-400">{{ b.usagePercent }}% Allocated</div>
                </div>
              </div>

              <!-- Bar -->
              <div class="w-full h-2 rounded-full bg-[#241c15] overflow-hidden border border-clay-700/30">
                <div class="h-full bg-terracotta-500 rounded-full" [style.width]="b.usagePercent + '%'"></div>
              </div>

              <div class="space-y-1.5 pt-2">
                <div class="text-[10px] uppercase text-sand-400 tracking-wider">Allocated Workloads</div>
                @for (item of b.breakdown; track item.name) {
                  <div class="py-1.5 flex items-center justify-between border-b border-clay-800/40 text-[11px]">
                    <span class="text-sand-200 truncate">{{ item.name }}</span>
                    <span class="text-terracotta-400 font-bold flex-shrink-0">{{ item.ram }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- TAB 4: AI CASCADE -->
      @if (activeTab === 'ai') {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          @for (c of eloCascade; track c.tier) {
            <div class="p-5 rounded-2xl bg-[#1a140f] border border-clay-700/40 shadow-xl space-y-3 flex flex-col justify-between">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-terracotta-400">{{ c.tier }}</span>
                  <span class="text-[10px] text-sand-400">{{ c.latency }}</span>
                </div>
                <div class="font-bold text-sand-100 text-xs">{{ c.provider }}</div>
                <p class="text-xs text-sand-300 font-sans leading-relaxed pt-1">
                  {{ c.role }}
                </p>
              </div>
            </div>
          }
        </div>
      }

    </section>
  `
})
export class ArchitectureBlueprintComponent {
  activeTab: 'vlan' | 'cyber' | 'memory' | 'ai' = 'vlan';

  vlanMatrix = [
    {
      id: 'VLAN 10',
      name: 'Management & Storage Subnet',
      subnet: '192.168.1.0/24',
      gateway: '192.168.1.1',
      nodes: 'Proxmox Core (x86_64), OMV NAS, Managed Switches',
      firewallPolicy: 'Isolated from IoT & Guest subnets'
    },
    {
      id: 'VLAN 20',
      name: 'Core Microservices & Applications',
      subnet: '192.168.1.0/24 & 192.168.64.0/24',
      gateway: '192.168.1.132 (OPNsense)',
      nodes: 'NPM Ingress, Vaultwarden, Immich, Nextcloud, Home Assistant, Gitea',
      firewallPolicy: 'Strict forward authentication via Authelia (CT 108)'
    },
    {
      id: 'VLAN 30',
      name: 'Cyber Security & Sandboxes (CyberLab)',
      subnet: '192.168.30.0/24',
      gateway: '192.168.1.132:8443',
      nodes: 'Wazuh XDR SIEM (1514), Suricata & Snort IDS/IPS, Kali & Remnux DFIR VMs',
      firewallPolicy: 'Promiscuous SPAN mirror port, no outbound WAN access for sandboxes'
    },
    {
      id: 'VLAN 50',
      name: 'IoT & Physical Edge Devices',
      subnet: '192.168.50.0/24',
      gateway: '192.168.1.132',
      nodes: 'ESP32 mmWave Radar, ESP32 Irrigation Relays, Zigbee Gateway',
      firewallPolicy: 'MQTT communication strictly restricted to Home Assistant (CT 106)'
    }
  ];

  cyberPillars = [
    {
      title: 'Operating Systems & Virtualization',
      badge: 'Compute & AD',
      description: 'Bare-metal virtualization and isolated testbeds hosting enterprise domain infrastructure and offensive/defensive virtual machines.',
      tools: ['Windows Server 2025', 'Active Directory (AD DS)', 'Group Policy (GPO)', 'Linux (Debian / Ubuntu / Alpine / Arch)', 'Virtual Machines (KVM / Proxmox / UTM)']
    },
    {
      title: 'Networking & Packet Analysis',
      badge: 'Network & DPI',
      description: 'L2/L3 segmentation, stateful traffic filtering, promiscuous port mirroring, packet inspection, and protocol analysis.',
      tools: ['Networking TCP/IP', 'Wireshark', 'tcpdump', 'VLAN 802.1Q', 'WireGuard VPN', 'OPNsense Firewall']
    },
    {
      title: 'SIEM & Log Aggregation',
      badge: 'SOC & Telemetry',
      description: 'Centralized security event ingestion, real-time alert correlation, compliance monitoring, and integration with modern enterprise SIEMs.',
      tools: ['Wazuh Manager (SIEM/XDR)', 'Splunk', 'Elastic (ELK Stack)', 'Microsoft Sentinel', 'Grafana Loki']
    },
    {
      title: 'Endpoint & Perimeter Defense',
      badge: 'EDR / IDS / IPS',
      description: 'Host-based monitoring, process creation tracking, deep packet inspection, and real-time network anomaly blocking.',
      tools: ['EDR Telemetry', 'Suricata IDS/IPS', 'Snort', 'Sysmon (Windows)', 'CrowdSec Agent', 'Auditd FIM']
    },
    {
      title: 'Vulnerability & Web Assessment',
      badge: 'Offensive Testing',
      description: 'Port scanning, network vulnerability identification, web application penetration testing, and identity path mapping.',
      tools: ['Nmap', 'Nessus', 'OpenVAS', 'Burp Suite', 'BloodHound', 'Atomic Red Team (MITRE ATT&CK)']
    },
    {
      title: 'Threat Intel & Detection Rules',
      badge: 'Detection Eng.',
      description: 'Structured threat sharing, automated indicator of compromise (IoC) extraction, and vendor-agnostic detection signatures.',
      tools: ['Sigma Rules', 'YARA Rules', 'MISP Threat Sharing', 'Snort Rulesets', 'CyberChef']
    },
    {
      title: 'Digital Forensics & Malware Analysis',
      badge: 'DFIR & Reverse Eng.',
      description: 'Air-gapped triage environment for memory acquisition, disk artifact analysis, binary disassembly, and dynamic debugging.',
      tools: ['Volatility (Memory Triage)', 'Autopsy (Disk Forensics)', 'Ghidra (NSA Decompiler)', 'IDA Pro', 'x64dbg', 'PEStudio']
    },
    {
      title: 'Automation, Scripting & SCM',
      badge: 'SecOps & DevSecOps',
      description: 'Automated threat hunting agents, incident response playbooks, triage collectors, and version-controlled configuration.',
      tools: ['PowerShell Core', 'Python 3.12 (FastAPI / Scapy)', 'Git', 'Ansible Hardening Playbooks', 'Woodpecker CI']
    }
  ];

  memoryBudgets = [
    {
      node: 'Node 1 — Proxmox Primary (Intel Core i3-10100F / GTX 1050 Ti)',
      totalRam: '8,192 MB DDR4',
      allocatedRam: '7,808 MB',
      usagePercent: 95,
      breakdown: [
        { name: 'Windows Server 2025 (VM 201 · Active Directory)', ram: '4,096 MB' },
        { name: 'OPNsense Firewall (VM 200 · Suricata/Snort)', ram: '1,024 MB' },
        { name: 'Immich Photos AI (CT 103)', ram: '896 MB' },
        { name: 'Jellyfin Media Suite (CT 109)', ram: '896 MB' },
        { name: 'Home Assistant Core (CT 106)', ram: '384 MB' },
        { name: 'n8n Automation (CT 107)', ram: '384 MB' },
        { name: 'Nginx Proxy Manager (CT 100)', ram: '112 MB' },
        { name: 'Other Core LXCs (CT 101, 104, 105, 108)', ram: '416 MB' }
      ]
    },
    {
      node: 'Node 3 — Proxmox Secondary (Apple M1 ARM64)',
      totalRam: '4,096 MB Dedicated (8GB Unified)',
      allocatedRam: '2,080 MB',
      usagePercent: 51,
      breakdown: [
        { name: 'Monitoring Suite: Grafana / Prom / Loki (CT 107)', ram: '448 MB' },
        { name: 'Woodpecker CI Engine (CT 110)', ram: '192 MB' },
        { name: 'Gitea Git Forge (CT 109)', ram: '160 MB' },
        { name: 'Actual Budget (CT 101)', ram: '160 MB' },
        { name: 'Trilium Notes (CT 102)', ram: '160 MB' },
        { name: 'ChangeDetection Monitor (CT 103)', ram: '160 MB' },
        { name: 'Other Utility LXCs (CT 100, 104, 105, 106, 108)', ram: '496 MB' }
      ]
    }
  ];

  eloCascade = [
    {
      tier: 'Tier 1',
      provider: 'Google Gemini (Gemini 2.5 Flash)',
      latency: '200-400 ms',
      role: 'Primary multimodal reasoning, tool selection, and cluster diagnosis.'
    },
    {
      tier: 'Tier 2',
      provider: 'Groq LPU (Llama 3.3 70B)',
      latency: '80-150 ms',
      role: 'Ultra-low-latency classification and fast automated decision trees.'
    },
    {
      tier: 'Tier 3',
      provider: 'OpenRouter Free Pool',
      latency: '400-800 ms',
      role: 'Secondary multi-model routing failover if rate limits occur.'
    },
    {
      tier: 'Tier 4',
      provider: 'Local Ollama (Apple Metal GPU)',
      latency: '50-120 ms',
      role: 'Air-gapped offline fallback execution without public WAN access.'
    }
  ];
}
