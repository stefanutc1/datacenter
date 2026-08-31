import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="w-full pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-obsidian-750 font-sans">
      
      <!-- Top Tag (Geist Sans) -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-850 border border-obsidian-700 text-xs font-sans font-medium text-emerald-400 mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Infrastructure Architecture & Digital Twin</span>
      </div>

      <!-- Main Headline (Newsreader Serif) -->
      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-slate-50 tracking-tight leading-[1.15] max-w-5xl mb-6">
        A heterogeneous bare-metal compute cluster, private cloud, and cyber defense proving ground.
      </h1>

      <!-- Description (Geist Sans) -->
      <p class="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-3xl mb-10 font-normal">
        An engineering record and interactive digital twin spanning Apple Silicon ARM64, Intel x86_64 virtualization with Windows Server Active Directory, ZFS storage pools, zero-trust network segmentation, and autonomous AI cluster orchestration.
      </p>

      <!-- 4 Architectural Highlight Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        
        <div class="p-5 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 space-y-2 hover:border-obsidian-600 transition-colors shadow-lg">
          <div class="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider">Physical Compute</div>
          <div class="text-2xl font-serif font-bold text-slate-50">4 Nodes</div>
          <p class="text-xs text-slate-300 font-sans leading-relaxed">
            Intel i3-10100F (GTX 1050 Ti), Apple M1 Silicon, ASUS Celeron OMV NAS, and AMD Athlon II k3s.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 space-y-2 hover:border-obsidian-600 transition-colors shadow-lg">
          <div class="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider">Virtualization</div>
          <div class="text-2xl font-serif font-bold text-slate-50">2 Hypervisors</div>
          <p class="text-xs text-slate-300 font-sans leading-relaxed">
            Proxmox VE x86_64 & ARM64 hosting OPNsense, Windows Server 2025, and 21 LXC containers.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 space-y-2 hover:border-obsidian-600 transition-colors shadow-lg">
          <div class="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider">Microservices</div>
          <div class="text-2xl font-serif font-bold text-slate-50">34 Workloads</div>
          <p class="text-xs text-slate-300 font-sans leading-relaxed">
            Containerized services spanning storage, media streaming, CI/CD, Git, and telemetry.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 space-y-2 hover:border-obsidian-600 transition-colors shadow-lg">
          <div class="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider">Cyber & DFIR</div>
          <div class="text-2xl font-serif font-bold text-slate-50">SOC & Lab</div>
          <p class="text-xs text-slate-300 font-sans leading-relaxed">
            Wazuh SIEM/XDR, Suricata/Snort IDS, Sysmon, and air-gapped Volatility & Ghidra reverse engineering.
          </p>
        </div>

      </div>

    </section>
  `
})
export class OverviewComponent {}
