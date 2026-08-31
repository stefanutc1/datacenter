import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-architecture-blueprint',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="blueprint" class="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      
      <!-- Section Header -->
      <div class="space-y-2 mb-8">
        <div class="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
          {{ ts.t.bpTag }}
        </div>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-slate-50 tracking-tight">
          {{ ts.t.bpTitle }}
        </h2>
        <p class="text-sm text-slate-300 max-w-3xl font-sans font-normal leading-relaxed">
          {{ ts.t.bpDesc }}
        </p>
      </div>

      <!-- Blueprint Tabs -->
      <div class="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2 font-sans">
        <button
          (click)="activeTab = 'vlan'"
          [class.bg-emerald-500]="activeTab === 'vlan'"
          [class.text-slate-950]="activeTab === 'vlan'"
          [class.font-bold]="activeTab === 'vlan'"
          [class.text-slate-300]="activeTab !== 'vlan'"
          [class.bg-obsidian-900]="activeTab !== 'vlan'"
          class="px-4 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.t.tabVlan }}
        </button>
        <button
          (click)="activeTab = 'cyber'"
          [class.bg-emerald-500]="activeTab === 'cyber'"
          [class.text-slate-950]="activeTab === 'cyber'"
          [class.font-bold]="activeTab === 'cyber'"
          [class.text-slate-300]="activeTab !== 'cyber'"
          [class.bg-obsidian-900]="activeTab !== 'cyber'"
          class="px-4 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.t.tabCyber }}
        </button>
        <button
          (click)="activeTab = 'memory'"
          [class.bg-emerald-500]="activeTab === 'memory'"
          [class.text-slate-950]="activeTab === 'memory'"
          [class.font-bold]="activeTab === 'memory'"
          [class.text-slate-300]="activeTab !== 'memory'"
          [class.bg-obsidian-900]="activeTab !== 'memory'"
          class="px-4 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.t.tabMemory }}
        </button>
        <button
          (click)="activeTab = 'ai'"
          [class.bg-emerald-500]="activeTab === 'ai'"
          [class.text-slate-950]="activeTab === 'ai'"
          [class.font-bold]="activeTab === 'ai'"
          [class.text-slate-300]="activeTab !== 'ai'"
          [class.bg-obsidian-900]="activeTab !== 'ai'"
          class="px-4 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.t.tabAi }}
        </button>
        <button
          (click)="activeTab = 'devsecops'"
          [class.bg-emerald-500]="activeTab === 'devsecops'"
          [class.text-slate-950]="activeTab === 'devsecops'"
          [class.font-bold]="activeTab === 'devsecops'"
          [class.text-slate-300]="activeTab !== 'devsecops'"
          [class.bg-obsidian-900]="activeTab !== 'devsecops'"
          class="px-4 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.t.tabDevSecOps }}
        </button>
      </div>

      <!-- TAB 1: VLAN MATRIX -->
      @if (activeTab === 'vlan') {
        <div class="rounded-2xl bg-obsidian-850/90 border border-obsidian-750 shadow-xl overflow-hidden font-mono text-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-obsidian-750 bg-obsidian-900 text-slate-300 text-[11px] uppercase tracking-wider">
                  <th class="p-4">VLAN ID</th>
                  <th class="p-4">Network Segment</th>
                  <th class="p-4">Subnet CIDR</th>
                  <th class="p-4">Gateway</th>
                  <th class="p-4">Attached Workloads</th>
                  <th class="p-4">Security Policy</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-obsidian-750/70">
                @for (vlan of vlanMatrix; track vlan.id) {
                  <tr class="hover:bg-obsidian-750/40 transition-colors">
                    <td class="p-4 font-bold text-emerald-400 whitespace-nowrap">{{ vlan.id }}</td>
                    <td class="p-4 font-medium text-slate-100">{{ vlan.name }}</td>
                    <td class="p-4 text-slate-300 whitespace-nowrap">{{ vlan.subnet }}</td>
                    <td class="p-4 text-slate-300 whitespace-nowrap">{{ vlan.gateway }}</td>
                    <td class="p-4 text-slate-200">{{ vlan.nodes }}</td>
                    <td class="p-4 text-slate-400">{{ vlan.firewallPolicy }}</td>
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
            <div class="p-6 rounded-2xl bg-obsidian-850/90 border border-obsidian-750 shadow-xl space-y-3.5 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between border-b border-obsidian-750 pb-3">
                  <h3 class="font-serif font-bold text-slate-50 text-base tracking-wide">
                    {{ pillar.title }}
                  </h3>
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                    {{ pillar.badge }}
                  </span>
                </div>

                <p class="text-xs text-slate-300 leading-relaxed font-sans font-normal">
                  {{ pillar.description }}
                </p>

                <!-- Tools List (IBM Plex Mono) -->
                <div class="space-y-1.5 pt-1">
                  <div class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Technologies & Tooling</div>
                  <div class="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    @for (tool of pillar.tools; track tool) {
                      <span class="px-2 py-0.5 rounded bg-obsidian-900 border border-obsidian-750 text-slate-200">
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
            <div class="p-6 rounded-2xl bg-obsidian-850/90 border border-obsidian-750 shadow-xl space-y-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="font-bold text-sm text-slate-50 font-mono">{{ b.node }}</h3>
                  <div class="text-[11px] text-slate-400 mt-0.5">Physical Ceiling: {{ b.totalRam }}</div>
                </div>
                <div class="text-right">
                  <span class="text-base font-bold text-emerald-400">{{ b.allocatedRam }}</span>
                  <div class="text-[10px] text-slate-400">{{ b.usagePercent }}% Allocated</div>
                </div>
              </div>

              <!-- Bar -->
              <div class="w-full h-2 rounded-full bg-obsidian-900 overflow-hidden border border-obsidian-750">
                <div class="h-full bg-emerald-500 rounded-full" [style.width]="b.usagePercent + '%'"></div>
              </div>

              <div class="space-y-1.5 pt-2">
                <div class="text-[10px] uppercase text-slate-400 tracking-wider">Allocated Workloads</div>
                @for (item of b.breakdown; track item.name) {
                  <div class="py-1.5 flex items-center justify-between border-b border-obsidian-750/70 text-[11px]">
                    <span class="text-slate-200 truncate">{{ item.name }}</span>
                    <span class="text-emerald-400 font-bold flex-shrink-0">{{ item.ram }}</span>
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
            <div class="p-5 rounded-2xl bg-obsidian-850/90 border border-obsidian-750 shadow-xl space-y-3 flex flex-col justify-between">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-emerald-400">{{ c.tier }}</span>
                  <span class="text-[10px] text-slate-400">{{ c.latency }}</span>
                </div>
                <div class="font-bold text-slate-100 text-xs">{{ c.provider }}</div>
                <p class="text-xs text-slate-300 font-sans leading-relaxed pt-1 font-normal">
                  {{ c.role }}
                </p>
              </div>
            </div>
          }
        </div>
      }

      <!-- TAB 5: DEVSECOPS & IMMUTABILITY -->
      @if (activeTab === 'devsecops') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-xs">
          @for (item of devSecOpsGrid; track item.title) {
            <div class="p-6 rounded-2xl bg-obsidian-850/90 border border-obsidian-750 shadow-xl space-y-3 flex flex-col justify-between">
              <div class="space-y-2.5">
                <div class="flex items-center justify-between border-b border-obsidian-750 pb-2.5">
                  <h3 class="font-serif font-bold text-slate-50 text-base">{{ item.title }}</h3>
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{{ item.badge }}</span>
                </div>
                <p class="text-xs text-slate-300 font-sans leading-relaxed font-normal">{{ item.description }}</p>
              </div>
              <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 font-mono text-[11px] text-emerald-400">
                {{ item.implementation }}
              </div>
            </div>
          }
        </div>
      }

    </section>
  `
})
export class ArchitectureBlueprintComponent {
  ts = inject(TranslationService);
  activeTab: 'vlan' | 'cyber' | 'memory' | 'ai' | 'devsecops' = 'vlan';

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
      nodes: 'NPM Ingress, Vaultwarden, Immich, Nextcloud, Home Assistant, Gitea, Kiwix',
      firewallPolicy: 'Strict forward authentication via Authelia (CT 108)'
    },
    {
      id: 'VLAN 30',
      name: 'Cyber Security & Sandboxes (CyberLab)',
      subnet: '192.168.30.0/24',
      gateway: '192.168.1.132:8443',
      nodes: 'Wazuh XDR SIEM (1514), Suricata IDS, Atomic Red Team, CAPEv2 / Cuckoo Sandbox (Win10 + INetSim)',
      firewallPolicy: 'Promiscuous SPAN mirror port, no outbound WAN access for sandboxes'
    },
    {
      id: 'VLAN 40',
      name: 'DMZ Deception & Honeypots',
      subnet: '192.168.40.0/24',
      gateway: '192.168.1.132 (OPNsense)',
      nodes: 'T-Pot Cluster (Cowrie SSH, Dionaea, RDP honeypot, Honeytrap)',
      firewallPolicy: 'Completely isolated DMZ; automated AbuseIPDB firewall blocking'
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
      tools: ['Windows Server 2025', 'Active Directory (AD DS)', 'Group Policy (GPO)', 'Linux (Debian / Ubuntu / Alpine / Talos)', 'Virtual Machines (KVM / Proxmox / UTM)']
    },
    {
      title: 'Networking & Packet Analysis',
      badge: 'Network & DPI',
      description: 'L2/L3 segmentation, stateful traffic filtering, promiscuous port mirroring, packet inspection, and protocol analysis.',
      tools: ['Networking TCP/IP', 'Wireshark', 'tcpdump', 'VLAN 802.1Q', 'WireGuard VPN', 'OPNsense Firewall']
    },
    {
      title: 'SIEM, Deception & Honeypots',
      badge: 'SOC & Honeynet',
      description: 'Centralized security event ingestion, real-time alert correlation, compliance monitoring, and T-Pot multi-honeypot deployment.',
      tools: ['Wazuh Manager (SIEM/XDR)', 'T-Pot (Cowrie / Dionaea / RDP)', 'Splunk', 'Elastic (ELK Stack)', 'Microsoft Sentinel', 'Grafana Loki']
    },
    {
      title: 'Endpoint & Perimeter Defense',
      badge: 'EDR / IDS / IPS',
      description: 'Host-based monitoring, process creation tracking, deep packet inspection, and real-time network anomaly blocking.',
      tools: ['EDR Telemetry', 'Suricata IDS/IPS', 'Snort', 'Sysmon (Windows)', 'CrowdSec Agent', 'Auditd FIM', 'Falco / Tetragon eBPF']
    },
    {
      title: 'Vulnerability & Adversary Emulation',
      badge: 'Offensive Testing',
      description: 'Port scanning, network vulnerability identification, web application penetration testing, and automated adversary simulation.',
      tools: ['Atomic Red Team (MITRE ATT&CK)', 'Nmap', 'Nessus', 'OpenVAS', 'Burp Suite', 'BloodHound']
    },
    {
      title: 'Threat Intel & Detection Rules',
      badge: 'Detection Eng.',
      description: 'Structured threat sharing, automated indicator of compromise (IoC) extraction, and vendor-agnostic detection signatures.',
      tools: ['Sigma Rules', 'YARA Rules', 'MISP Threat Sharing', 'Snort Rulesets', 'CyberChef', 'OPNsense IoC Exporter']
    },
    {
      title: 'Digital Forensics & Malware Analysis',
      badge: 'DFIR & Reverse Eng.',
      description: 'Air-gapped triage environment for memory acquisition, disk artifact analysis, binary disassembly, and dynamic sandbox debugging.',
      tools: ['CAPEv2 / Cuckoo (Win10 + INetSim)', 'Volatility (Memory Triage)', 'Autopsy (Disk Forensics)', 'Ghidra (NSA Decompiler)', 'IDA Pro', 'x64dbg']
    },
    {
      title: 'Automation, Scripting & SCM',
      badge: 'SecOps & DevSecOps',
      description: 'Automated threat hunting agents, incident response playbooks, triage collectors, and version-controlled configuration.',
      tools: ['PowerShell Core', 'Python 3.12 (FastAPI / Scapy)', 'Git', 'Ansible Hardening Playbooks', 'Woodpecker CI', 'Shuffle / n8n SOAR']
    }
  ];

  memoryBudgets = [
    {
      node: 'Node 1 — Proxmox Primary (Intel Core i3-10100F / GTX 1050 Ti)',
      totalRam: '8,192 MB DDR4',
      allocatedRam: '7,936 MB',
      usagePercent: 96,
      breakdown: [
        { name: 'Windows Server 2025 (VM 201 · Active Directory)', ram: '4,096 MB' },
        { name: 'Ollama GPU LLM Runtime (CT 115 · GTX 1050 Ti Passthrough)', ram: '2,048 MB' },
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
      allocatedRam: '2,336 MB',
      usagePercent: 57,
      breakdown: [
        { name: 'Monitoring Suite: Grafana / Prom / Loki (CT 107)', ram: '448 MB' },
        { name: 'Grafana Tempo Distributed Tracing (CT 118)', ram: '256 MB' },
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
      provider: 'Local Ollama GPU (GTX 1050 Ti 4GB VRAM)',
      latency: '35-90 ms',
      role: 'Zero-latency, air-gapped offline execution for Qwen2.5-Coder and DeepSeek-R1.'
    },
    {
      tier: 'Tier 2',
      provider: 'Google Gemini (Gemini 2.5 Flash)',
      latency: '200-400 ms',
      role: 'Primary multimodal reasoning, tool selection, and cluster diagnosis.'
    },
    {
      tier: 'Tier 3',
      provider: 'Groq LPU (Llama 3.3 70B)',
      latency: '80-150 ms',
      role: 'Ultra-low-latency classification and fast automated decision trees.'
    },
    {
      tier: 'Tier 4',
      provider: 'Local Ollama Metal (Apple M1 GPU)',
      latency: '50-120 ms',
      role: 'Secondary local GPU fallback on ARM64 if primary node is saturated.'
    }
  ];

  devSecOpsGrid = [
    {
      title: 'Infrastructure as Code (IaC)',
      badge: 'Terraform & Proxmox',
      description: 'Declarative LXC and VM provisioning via bpg/proxmox provider with Cloud-Init and strict resource quotas.',
      implementation: 'terraform/proxmox/ (LXC + VM + Talos)'
    },
    {
      title: 'Container & IaC Security Scanning',
      badge: 'Trivy & Gitleaks',
      description: 'Automated vulnerability scanning for Dockerfiles, SBOM generation, and secret detection on every git push.',
      implementation: '.github/workflows/security-scan.yml'
    },
    {
      title: 'Immutable Kubernetes OS',
      badge: 'Talos Linux',
      description: 'Zero-SSH, API-managed immutable operating system for Kubernetes nodes with encrypted rootfs.',
      implementation: 'kubernetes/talos/cluster.yaml'
    },
    {
      title: 'Disaster Recovery Validation',
      badge: 'Cold-Start vzdump CI',
      description: 'Automated script that restores the latest backup snapshot into an isolated DMZ VLAN to verify integrity.',
      implementation: 'scripts/disaster-recovery/dr_vzdump_restore.sh'
    },
    {
      title: 'Chaos Engineering Suite',
      badge: 'CPU & Netem Stress',
      description: 'Automated fault injection simulating 100% CPU spikes, packet loss, and latency to test alerting and failover.',
      implementation: 'scripts/chaos/chaos_runner.sh'
    },
    {
      title: 'Kernel-Level eBPF Observability',
      badge: 'Cilium Tetragon & Falco',
      description: 'Real-time detection of suspicious system calls, privilege escalation, and unauthorized network connections.',
      implementation: 'cyber/ebpf/ (Tetragon + Falco rules)'
    }
  ];
}
