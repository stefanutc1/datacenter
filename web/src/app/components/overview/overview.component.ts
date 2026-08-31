import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="w-full pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-clay-800/40">
      
      <!-- Top Tag -->
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clay-850 border border-clay-700/50 text-[11px] font-mono text-terracotta-400 mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-terracotta-500 animate-pulse"></span>
        <span>INFRASTRUCTURE ARCHITECTURE & DIGITAL TWIN</span>
      </div>

      <!-- Main Headline (Newsreader Serif) -->
      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-sand-50 tracking-tight leading-[1.15] max-w-5xl mb-6">
        A heterogeneous bare-metal compute cluster, private cloud, and cyber defense proving ground.
      </h1>

      <!-- Description (Geist Sans) -->
      <p class="text-base sm:text-lg text-sand-300 font-sans leading-relaxed max-w-3xl mb-10 font-normal">
        An engineering record and interactive digital twin spanning Apple Silicon ARM64, Intel x86_64 virtualization with Windows Server Active Directory, ZFS storage pools, zero-trust network segmentation, and autonomous AI cluster orchestration.
      </p>

      <!-- 4 Architectural Highlight Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="p-5 rounded-2xl bg-clay-900/60 border border-clay-700/40 space-y-2">
          <div class="text-[11px] font-mono text-sand-400 uppercase tracking-wider">Physical Compute</div>
          <div class="text-2xl font-serif font-bold text-sand-50">4 Nodes</div>
          <p class="text-xs text-sand-300 font-sans leading-relaxed">
            Intel i3-10100F (GTX 1050 Ti), Apple M1 Silicon, ASUS Celeron OMV NAS, and AMD Athlon II k3s.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-clay-900/60 border border-clay-700/40 space-y-2">
          <div class="text-[11px] font-mono text-sand-400 uppercase tracking-wider">Virtualization</div>
          <div class="text-2xl font-serif font-bold text-sand-50">2 Hypervisors</div>
          <p class="text-xs text-sand-300 font-sans leading-relaxed">
            Proxmox VE x86_64 & ARM64 hosting OPNsense, Windows Server 2025, and 21 LXC containers.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-clay-900/60 border border-clay-700/40 space-y-2">
          <div class="text-[11px] font-mono text-sand-400 uppercase tracking-wider">Microservices</div>
          <div class="text-2xl font-serif font-bold text-sand-50">34 Workloads</div>
          <p class="text-xs text-sand-300 font-sans leading-relaxed">
            Containerized services spanning storage, media streaming, CI/CD, Git, and telemetry.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-clay-900/60 border border-clay-700/40 space-y-2">
          <div class="text-[11px] font-mono text-sand-400 uppercase tracking-wider">Cyber & DFIR</div>
          <div class="text-2xl font-serif font-bold text-sand-50">SOC & Lab</div>
          <p class="text-xs text-sand-300 font-sans leading-relaxed">
            Wazuh SIEM/XDR, Suricata/Snort IDS, Sysmon, and air-gapped Volatility & Ghidra reverse engineering.
          </p>
        </div>

      </div>

    </section>
  `
})
export class OverviewComponent {}
