import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

interface PhotoItem {
  src: string;
  title: string;
  category: string;
  description: string;
  endpoint: string;
  badge: string;
}

@Component({
  selector: 'app-about-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-obsidian-750 font-sans">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>PORTFOLIO & LIVE LAB GALLERY</span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-serif text-slate-100 font-normal">
            {{ ts.isRomanian ? 'Despre Mine & Capturi Reale din Homelab' : 'About Me & Real Live Infrastructure' }}
          </h2>
        </div>
        <p class="text-xs sm:text-sm text-slate-400 font-sans max-w-xl leading-relaxed">
          {{ ts.isRomanian 
            ? 'Arhitectură complet implementată pe hardware fizic și mașini virtuale de producție de către @stefanutc1. Mai jos sunt capturile din panourile reale de management Grafana, Proxmox VE (x86_64 și ARM64 Apple M1), Pi-hole, Home Assistant și OPNsense.' 
            : 'Production-grade enterprise virtualization, security, and GitOps architecture built by @stefanutc1. Below are real-time captures from the live management interfaces across x86_64, ARM64 Apple Silicon, and key services.' }}
        </p>
      </div>

      <!-- About Me Engineer Bio Card -->
      <div class="mb-12 p-6 sm:p-8 rounded-3xl bg-[#0c0e11] border border-obsidian-750 shadow-2xl relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-emerald-400 text-xl shadow-inner">
                SN
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-bold text-slate-100">@stefanutc1</h3>
                <p class="text-xs font-mono text-emerald-400">DevOps & Infrastructure Architect · Homelab Engineering</p>
              </div>
            </div>
            <p class="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {{ ts.isRomanian
                ? 'Pasionat de sisteme distribuite, securitate zero-trust, virtualizare hibridă (x86_64 și ARM64 Apple Silicon) și automatizare GitOps (Terraform, Ansible, CI/CD). Acest homelab servește drept mediu sandbox enterprise pentru testarea stivelor complexe de microservicii, kernel hardening (FreeBSD / Linux) și observabilitate în timp real.'
                : 'Passionate about distributed systems, zero-trust perimeter defense, multi-architecture virtualization (x86_64 and Apple Silicon ARM64), and GitOps automation. This homelab powers live microservices, bare-metal telemetry, and real-time observability.' }}
            </p>
            <div class="flex flex-wrap gap-2 pt-2">
              <span class="px-2.5 py-1 rounded-lg bg-obsidian-800 text-slate-300 font-mono text-[11px] border border-obsidian-700">Proxmox VE 9.2 (x64 & ARM64)</span>
              <span class="px-2.5 py-1 rounded-lg bg-obsidian-800 text-slate-300 font-mono text-[11px] border border-obsidian-700">OPNsense 24.7 Hardened</span>
              <span class="px-2.5 py-1 rounded-lg bg-obsidian-800 text-slate-300 font-mono text-[11px] border border-obsidian-700">Grafana Enterprise & Prometheus</span>
              <span class="px-2.5 py-1 rounded-lg bg-obsidian-800 text-slate-300 font-mono text-[11px] border border-obsidian-700">Pi-hole DNS Sinkhole</span>
              <span class="px-2.5 py-1 rounded-lg bg-obsidian-800 text-slate-300 font-mono text-[11px] border border-obsidian-700">Home Assistant Core</span>
              <span class="px-2.5 py-1 rounded-lg bg-obsidian-800 text-slate-300 font-mono text-[11px] border border-obsidian-700">Suricata 8.0 & CrowdSec</span>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-obsidian-900 border border-obsidian-750 font-mono text-xs space-y-2.5 shadow-inner">
            <div class="text-slate-400 uppercase text-[10px] tracking-wider font-bold mb-1">Endpoints Rețea Locală</div>
            <div class="flex justify-between items-center text-slate-300">
              <span class="text-slate-400">Grafana:</span>
              <a href="http://192.168.1.132:3000" target="_blank" class="text-emerald-400 hover:underline">192.168.1.132:3000</a>
            </div>
            <div class="flex justify-between items-center text-slate-300">
              <span class="text-slate-400">PVE x86_64:</span>
              <a href="https://192.168.1.132:8006" target="_blank" class="text-emerald-400 hover:underline">192.168.1.132:8006</a>
            </div>
            <div class="flex justify-between items-center text-slate-300">
              <span class="text-slate-400">PVE ARM64:</span>
              <a href="https://192.168.64.14:8006" target="_blank" class="text-emerald-400 hover:underline">192.168.64.14:8006</a>
            </div>
            <div class="flex justify-between items-center text-slate-300">
              <span class="text-slate-400">OPNsense:</span>
              <a href="https://192.168.1.134:8443" target="_blank" class="text-emerald-400 hover:underline">192.168.1.134:8443</a>
            </div>
            <div class="flex justify-between items-center text-slate-300">
              <span class="text-slate-400">Pi-hole:</span>
              <a href="http://192.168.1.4:8080" target="_blank" class="text-emerald-400 hover:underline">192.168.1.4:8080</a>
            </div>
            <div class="flex justify-between items-center text-slate-300">
              <span class="text-slate-400">Home Assistant:</span>
              <a href="http://192.168.1.10:8123" target="_blank" class="text-emerald-400 hover:underline">192.168.1.10:8123</a>
            </div>
          </div>

        </div>
      </div>

      <!-- Photo Gallery Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (photo of photos; track photo.src) {
          <div 
            (click)="selectedPhoto.set(photo)"
            class="group cursor-pointer rounded-2xl bg-[#0c0e11] border border-obsidian-750 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 shadow-xl flex flex-col"
          >
            <!-- Image Thumbnail -->
            <div class="relative aspect-video w-full overflow-hidden bg-obsidian-950">
              <img 
                [src]="photo.src" 
                [alt]="photo.title"
                class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#0c0e11] via-transparent to-transparent opacity-80"></div>
              
              <!-- Badge -->
              <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-obsidian-900/90 border border-obsidian-700 text-emerald-400 shadow">
                {{ photo.badge }}
              </span>
            </div>

            <!-- Content -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400">{{ photo.category }}</span>
                <h4 class="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mt-0.5">
                  {{ photo.title }}
                </h4>
                <p class="text-xs text-slate-300 font-sans mt-1.5 line-clamp-2 leading-relaxed">
                  {{ photo.description }}
                </p>
              </div>
              <div class="pt-2 border-t border-obsidian-800 flex items-center justify-between font-mono text-[11px] text-slate-400">
                <span>{{ photo.endpoint }}</span>
                <span class="text-emerald-400 group-hover:translate-x-1 transition-transform">Zoom ↗</span>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Lightbox Zoom Modal -->
      @if (selectedPhoto(); as p) {
        <div 
          (click)="selectedPhoto.set(null)"
          class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div 
            (click)="$event.stopPropagation()"
            class="max-w-5xl w-full bg-obsidian-900 border border-obsidian-750 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <!-- Modal Header -->
            <div class="p-4 sm:p-5 border-b border-obsidian-750 flex items-center justify-between bg-obsidian-950 font-sans">
              <div>
                <span class="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">{{ p.category }}</span>
                <h3 class="text-lg font-bold text-slate-100">{{ p.title }}</h3>
              </div>
              <button 
                (click)="selectedPhoto.set(null)"
                class="w-8 h-8 rounded-full bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 flex items-center justify-center text-sm font-mono transition-colors"
              >
                ✕
              </button>
            </div>

            <!-- Modal Image -->
            <div class="flex-1 overflow-auto p-2 bg-black flex items-center justify-center">
              <img [src]="p.src" [alt]="p.title" class="max-w-full max-h-[65vh] object-contain rounded-lg" />
            </div>

            <!-- Modal Footer Details -->
            <div class="p-4 sm:p-5 border-t border-obsidian-750 bg-obsidian-950 font-sans text-xs text-slate-300 flex flex-col sm:flex-row justify-between gap-3">
              <p class="leading-relaxed max-w-2xl">{{ p.description }}</p>
              <div class="font-mono text-emerald-400 self-start sm:self-auto">{{ p.endpoint }}</div>
            </div>
          </div>
        </div>
      }

    </section>
  `
})
export class AboutGalleryComponent {
  ts = inject(TranslationService);
  selectedPhoto = signal<PhotoItem | null>(null);

  photos: PhotoItem[] = [
    {
      src: 'photos/grafana_nodes_dashboard.png',
      title: 'Grafana · Multi-Architecture Nodes (x86_64 & ARM64)',
      category: 'OBSERVABILITY & METRICS',
      description: 'Unified Grafana Enterprise dashboard tracking Proxmox VE hypervisors (Intel i3-10100F and Apple Silicon M1), 8-thread CPU timeline, ZRAM compression, and LXC container counts in English.',
      endpoint: '192.168.1.132:3000',
      badge: 'GRAFANA LIVE'
    },
    {
      src: 'photos/grafana_opnsense_dashboard.png',
      title: 'Grafana · OPNsense Perimeter Firewall & Threat Intel',
      category: 'OBSERVABILITY & SECURITY',
      description: 'Real-time security telemetry: Suricata 8.0 NIDS/IPS engine status, CrowdSec LAPI bouncer packet filter drops, Unbound DNS-over-TLS Quad9 resolver, and WAN/Inter-VLAN throughput.',
      endpoint: '192.168.1.132:3000',
      badge: 'SECURITY LIVE'
    },
    {
      src: 'photos/proxmox_ve_dashboard.png',
      title: 'Proxmox VE 9.2.10 · Primary x86_64 Hypervisor',
      category: 'VIRTUALIZATION & HYPERVISOR',
      description: 'Native Proxmox VE management interface on Node 1 (Intel i3-10100F, 8GB DDR4, 512GB SSD), managing KVM virtual machines (VM 200 OPNsense) and active LXC containers.',
      endpoint: '192.168.1.132:8006',
      badge: 'PVE X86_64'
    },
    {
      src: 'photos/proxmox_arm64_dashboard.png',
      title: 'Proxmox VE 9.2.9 · Secondary ARM64 Node (Apple Silicon M1)',
      category: 'VIRTUALIZATION & ARM64',
      description: 'Proxmox VE running on Apple Silicon M1 ARM64 UTM, orchestrating 48 microservice LXC containers (it-tools, gitea, woodpecker-ci, authelia, vaultwarden, stepca, ntfy, etc.).',
      endpoint: '192.168.64.14:8006',
      badge: 'PVE ARM64'
    },
    {
      src: 'photos/pihole_admin_dashboard.png',
      title: 'Pi-hole · DNS Sinkhole & Network Ad-Blocking',
      category: 'DNS & NETWORK PRIVACY',
      description: 'Network-wide DNS filter blocking telemetry and malware domains with FTL engine, tracking query statistics, client activity, and 89,947 gravity blocked domains.',
      endpoint: '192.168.1.4:8080',
      badge: 'PI-HOLE DNS'
    },
    {
      src: 'photos/homeassistant_dashboard.png',
      title: 'Home Assistant · IoT Automation & Control Hub',
      category: 'HOME AUTOMATION & IOT',
      description: 'Centralized home automation and smart IoT controller running in containerized environment on Node 1 with Lovelace user interface and multi-room management.',
      endpoint: '192.168.1.10:8123',
      badge: 'HOME ASSISTANT'
    },
    {
      src: 'photos/opnsense_suricata_defense.png',
      title: 'OPNsense · Suricata 8.0 NIDS/IPS Engine',
      category: 'CYBERSECURITY & THREAT DETECTION',
      description: 'Suricata Intrusion Detection System running in promiscuous PCAP live mode across WAN and VLAN interfaces with ET Open rules active.',
      endpoint: '192.168.1.134:8443',
      badge: 'SURICATA IDS'
    },
    {
      src: 'photos/opnsense_stats_dashboard.png',
      title: 'OPNsense · Core Firewall Administration',
      category: 'SECURITY & GATEWAY',
      description: 'FreeBSD Hardened perimeter gateway management interface providing routing, firewalling, and packet inspection at 192.168.1.134.',
      endpoint: '192.168.1.134:8443',
      badge: 'FIREWALL CORE'
    },
    {
      src: 'photos/opnsense_firewall_rules.png',
      title: 'OPNsense · VLAN Micro-Segmentation Policies (pf)',
      category: 'NETWORK SECURITY',
      description: 'Strict packet filter (pf) rules enforcing zero-trust isolation between VLAN 10 (Management), 20 (Services), 30 (IoT), 40 (DMZ), and 50 (Storage).',
      endpoint: '192.168.1.134:8443',
      badge: 'PF RULES'
    },
    {
      src: 'photos/opnsense_wireguard_vpn.png',
      title: 'OPNsense · WireGuard Kernel VPN Mesh',
      category: 'ZERO-TRUST NETWORKING',
      description: 'High-speed in-kernel WireGuard cryptographic tunnel providing remote zero-trust access into the homelab private subnet.',
      endpoint: '192.168.1.134:8443',
      badge: 'WIREGUARD VPN'
    },
    {
      src: 'photos/opnsense_unbound_dns.png',
      title: 'OPNsense · Unbound DNS-over-TLS (DoT)',
      category: 'PRIVACY & DNSSEC',
      description: 'Encrypted recursive DNS resolver forwarding port 853 queries to Quad9 and Cloudflare with strict DNSSEC validation.',
      endpoint: '192.168.1.134:8443',
      badge: 'DOT QUAD9'
    }
  ];
}
