import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-architecture-blueprint',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

      <!-- Interactive Blueprint Tabs -->
      <div class="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2 font-sans">
        <button
          (click)="activeTab = 'vlan'"
          [class.bg-emerald-500]="activeTab === 'vlan'"
          [class.text-slate-950]="activeTab === 'vlan'"
          [class.font-bold]="activeTab === 'vlan'"
          [class.text-slate-300]="activeTab !== 'vlan'"
          [class.bg-obsidian-900]="activeTab !== 'vlan'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Matrice VLAN & Firewall' : 'VLAN & Firewall Matrix' }}
        </button>
        <button
          (click)="activeTab = 'power'"
          [class.bg-emerald-500]="activeTab === 'power'"
          [class.text-slate-950]="activeTab === 'power'"
          [class.font-bold]="activeTab === 'power'"
          [class.text-slate-300]="activeTab !== 'power'"
          [class.bg-obsidian-900]="activeTab !== 'power'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'UPS & Telemetrie Energie' : 'UPS & Power Telemetry' }}
        </button>
        <button
          (click)="activeTab = 'storage'"
          [class.bg-emerald-500]="activeTab === 'storage'"
          [class.text-slate-950]="activeTab === 'storage'"
          [class.font-bold]="activeTab === 'storage'"
          [class.text-slate-300]="activeTab !== 'storage'"
          [class.bg-obsidian-900]="activeTab !== 'storage'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Stocare ZFS & Pool-uri' : 'ZFS Storage Pools' }}
        </button>
        <button
          (click)="activeTab = 'cyber'"
          [class.bg-emerald-500]="activeTab === 'cyber'"
          [class.text-slate-950]="activeTab === 'cyber'"
          [class.font-bold]="activeTab === 'cyber'"
          [class.text-slate-300]="activeTab !== 'cyber'"
          [class.bg-obsidian-900]="activeTab !== 'cyber'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.t.tabCyber }}
        </button>
        <button
          (click)="activeTab = 'generator'"
          [class.bg-emerald-500]="activeTab === 'generator'"
          [class.text-slate-950]="activeTab === 'generator'"
          [class.font-bold]="activeTab === 'generator'"
          [class.text-slate-300]="activeTab !== 'generator'"
          [class.bg-obsidian-900]="activeTab !== 'generator'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Generator IaC & Runbooks' : 'IaC Generator & Runbooks' }}
        </button>
        <button
          (click)="activeTab = 'chaos'"
          [class.bg-emerald-500]="activeTab === 'chaos'"
          [class.text-slate-950]="activeTab === 'chaos'"
          [class.font-bold]="activeTab === 'chaos'"
          [class.text-slate-300]="activeTab !== 'chaos'"
          [class.bg-obsidian-900]="activeTab !== 'chaos'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Ingineria Haosului & Reziliență' : 'Chaos & Resiliency' }}
        </button>
        <button
          (click)="activeTab = 'observability'"
          [class.bg-emerald-500]="activeTab === 'observability'"
          [class.text-slate-950]="activeTab === 'observability'"
          [class.font-bold]="activeTab === 'observability'"
          [class.text-slate-300]="activeTab !== 'observability'"
          [class.bg-obsidian-900]="activeTab !== 'observability'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Observabilitate LGTM & SLO' : 'LGTM & SLO Metrics' }}
        </button>
        <button
          (click)="activeTab = 'glossary'"
          [class.bg-emerald-500]="activeTab === 'glossary'"
          [class.text-slate-950]="activeTab === 'glossary'"
          [class.font-bold]="activeTab === 'glossary'"
          [class.text-slate-300]="activeTab !== 'glossary'"
          [class.bg-obsidian-900]="activeTab !== 'glossary'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Glosar Tehnic' : 'Technical Glossary' }}
        </button>
      </div>

      <!-- TAB 1: VLAN MATRIX -->
      @if (activeTab === 'vlan') {
        <div class="space-y-6">
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
        </div>
      }

      <!-- TAB 2: POWER & UPS TELEMETRY -->
      @if (activeTab === 'power') {
        <div class="space-y-6">
          <!-- Live Telemetry KPI Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-lg space-y-2">
              <div class="text-[10px] text-slate-400 uppercase">Input Voltage</div>
              <div class="text-2xl font-bold text-emerald-400">231.4 V AC</div>
              <div class="text-[11px] text-slate-300">Pure Sine Wave 50.0 Hz</div>
            </div>
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-lg space-y-2">
              <div class="text-[10px] text-slate-400 uppercase">Battery Charge</div>
              <div class="text-2xl font-bold text-emerald-400">100% (13.7V)</div>
              <div class="text-[11px] text-slate-300">100Ah Deep-Cycle AGM</div>
            </div>
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-lg space-y-2">
              <div class="text-[10px] text-slate-400 uppercase">Estimated Autonomy</div>
              <div class="text-2xl font-bold text-emerald-400">~245 Mins</div>
              <div class="text-[11px] text-slate-300">Active Load: 84 Watts</div>
            </div>
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-lg space-y-2">
              <div class="text-[10px] text-slate-400 uppercase">Efficiency PUE</div>
              <div class="text-2xl font-bold text-emerald-400">1.14 PUE</div>
              <div class="text-[11px] text-slate-300">Sub-100W Baseline Cluster</div>
            </div>
          </div>

          <!-- NUT Graceful Shutdown Sequence -->
          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <h3 class="font-serif font-bold text-slate-50 text-base">Network UPS Tools (NUT) Graceful Sequential Shutdown</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
              <div class="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <span class="text-emerald-400 font-bold">Step 1: Non-Critical</span>
                <p class="text-slate-300 text-[11px] font-sans">Stop Media (Jellyfin CT 109) & Nextcloud</p>
              </div>
              <div class="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <span class="text-emerald-400 font-bold">Step 2: Databases</span>
                <p class="text-slate-300 text-[11px] font-sans">Flush & Stop PostgreSQL & OMV NFS Pool</p>
              </div>
              <div class="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <span class="text-emerald-400 font-bold">Step 3: Core VMs</span>
                <p class="text-slate-300 text-[11px] font-sans">Gracefully stop Windows Server 2025 & OPNsense</p>
              </div>
              <div class="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <span class="text-emerald-400 font-bold">Step 4: Host Poweroff</span>
                <p class="text-slate-300 text-[11px] font-sans">Proxmox VE executes poweroff cleanly</p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 3: ZFS STORAGE -->
      @if (activeTab === 'storage') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <div class="flex items-center justify-between border-b border-obsidian-750 pb-3">
              <h3 class="font-bold text-sm text-slate-50">rpool (Local NVMe SSD)</h3>
              <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">ONLINE · 512GB</span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-slate-300">
                <span>ZSTD Compression Ratio:</span>
                <span class="font-bold text-emerald-400">1.84x</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>ARC Cache Hit Rate:</span>
                <span class="font-bold text-emerald-400">98.6%</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Database Block Alignment:</span>
                <span class="font-bold text-slate-100">recordsize=16k</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>SSD Health (TBW Life Expectancy):</span>
                <span class="font-bold text-emerald-400">99.1% Remaining (S.M.A.R.T. Passed)</span>
              </div>
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <div class="flex items-center justify-between border-b border-obsidian-750 pb-3">
              <h3 class="font-bold text-sm text-slate-50">datapool (OMV ZFS Mirror)</h3>
              <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">ONLINE · 500GB</span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-slate-300">
                <span>Storage Role:</span>
                <span class="font-bold text-slate-100">NFS/SMB Share + vzdump Backups</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Media Block Size:</span>
                <span class="font-bold text-slate-100">recordsize=1M (Jellyfin & Kiwix)</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Offline Archive:</span>
                <span class="font-bold text-emerald-400">Kiwix Wikipedia ZIM (100% Offline)</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>ZFS Scrub Scheduler:</span>
                <span class="font-bold text-slate-200">1st Sunday of Month (0 Errors)</span>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 4: CYBERLAB -->
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

      <!-- TAB 5: IAC GENERATOR & RUNBOOKS -->
      @if (activeTab === 'generator') {
        <div class="space-y-6 font-mono text-xs">
          <!-- Visual Generator Form -->
          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <h3 class="font-serif font-bold text-slate-50 text-base">Terraform Proxmox LXC Manifest Generator</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="text-[10px] text-slate-400 uppercase">Hostname</label>
                <input type="text" [(ngModel)]="genHostname" class="w-full mt-1 p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-700 text-slate-100 text-xs" />
              </div>
              <div>
                <label class="text-[10px] text-slate-400 uppercase">VMID</label>
                <input type="number" [(ngModel)]="genVmid" class="w-full mt-1 p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-700 text-slate-100 text-xs" />
              </div>
              <div>
                <label class="text-[10px] text-slate-400 uppercase">RAM (MB)</label>
                <input type="number" [(ngModel)]="genRam" class="w-full mt-1 p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-700 text-slate-100 text-xs" />
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex justify-between items-center text-[10px] text-slate-400 uppercase">
                <span>Generated Terraform Manifest</span>
                <button (click)="copyGen()" class="text-emerald-400 hover:text-emerald-300 font-bold">{{ isGenCopied ? 'COPIED!' : 'COPY CODE' }}</button>
              </div>
              <pre class="p-4 rounded-xl bg-obsidian-950 border border-obsidian-750 text-slate-200 text-[11px] overflow-x-auto leading-relaxed"><code>{{ generatedTerraformCode }}</code></pre>
            </div>
          </div>
        </div>
      }

      <!-- TAB 6: CHAOS ENGINEERING -->
      @if (activeTab === 'chaos') {
        <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4 font-mono text-xs">
          <h3 class="font-serif font-bold text-slate-50 text-base">Chaos Engineering Simulator & Resilience Runner</h3>
          <p class="text-slate-300 font-sans text-xs">Inject controlled synthetic stress to validate Prometheus Alertmanager thresholds and automated failover.</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-2">
              <div class="font-bold text-emerald-400">100% CPU Stress</div>
              <p class="text-[11px] text-slate-400 font-sans">Simulates heavy workload spikes across all 8 hyperthreads.</p>
              <div class="text-[10px] bg-obsidian-950 p-2 rounded border border-obsidian-800 text-slate-300">./scripts/chaos/chaos_runner.sh cpu-stress 60</div>
            </div>
            <div class="p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-2">
              <div class="font-bold text-emerald-400">150ms Network Latency</div>
              <p class="text-[11px] text-slate-400 font-sans">Injects netem latency to test Tempo distributed tracing spans.</p>
              <div class="text-[10px] bg-obsidian-950 p-2 rounded border border-obsidian-800 text-slate-300">./scripts/chaos/chaos_runner.sh network-latency 30 eth0 150ms</div>
            </div>
            <div class="p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-2">
              <div class="font-bold text-emerald-400">15% Packet Loss</div>
              <p class="text-[11px] text-slate-400 font-sans">Tests TCP retransmission and client retry resilience.</p>
              <div class="text-[10px] bg-obsidian-950 p-2 rounded border border-obsidian-800 text-slate-300">./scripts/chaos/chaos_runner.sh packet-loss 30 eth0 15%</div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 7: LGTM OBSERVABILITY & SLO -->
      @if (activeTab === 'observability') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <h3 class="font-bold text-sm text-slate-50">Service Level Objectives (SLO / SLA)</h3>
            <div class="space-y-2.5">
              <div class="flex justify-between text-slate-300">
                <span>Core Services Uptime (90 Days):</span>
                <span class="font-bold text-emerald-400">99.98% SLA (Uptime Kuma)</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>DNS Internal Latency (p99):</span>
                <span class="font-bold text-emerald-400">1.8 ms</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>DORA Deployment Frequency:</span>
                <span class="font-bold text-emerald-400">Daily Automated GitOps</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>DORA Lead Time for Changes:</span>
                <span class="font-bold text-emerald-400">&lt; 3.5 Minutes</span>
              </div>
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <h3 class="font-bold text-sm text-slate-50">LGTM OpenTelemetry Telemetry Pipeline</h3>
            <div class="space-y-2 text-slate-300">
              <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between">
                <span>Prometheus TSDB</span>
                <span class="text-emerald-400 font-bold">:9090</span>
              </div>
              <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between">
                <span>Grafana Loki Log Streams</span>
                <span class="text-emerald-400 font-bold">:3100</span>
              </div>
              <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between">
                <span>Grafana Tempo Distributed Tracing</span>
                <span class="text-emerald-400 font-bold">:3200 (OTLP :4317/:4318)</span>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 8: TECHNICAL GLOSSARY -->
      @if (activeTab === 'glossary') {
        <div class="space-y-4 font-sans text-xs">
          <input
            type="text"
            [(ngModel)]="glossarySearch"
            [placeholder]="ts.isRomanian ? 'Filtrează termenii din glosar (ex: ZFS, eBPF, Passkeys, NUT)...' : 'Filter glossary terms (e.g. ZFS, eBPF, Passkeys, NUT)...'"
            class="w-full p-3 rounded-xl bg-obsidian-900 border border-obsidian-700 text-slate-100 text-xs font-sans outline-none focus:border-emerald-500"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (g of filteredGlossary; track g.term) {
              <div class="p-4 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-1.5 shadow-md">
                <div class="font-bold text-slate-50 font-mono text-sm text-emerald-400">{{ g.term }}</div>
                <p class="text-slate-300 font-sans leading-relaxed">{{ g.def }}</p>
              </div>
            }
          </div>
        </div>
      }

    </section>
  `
})
export class ArchitectureBlueprintComponent {
  ts = inject(TranslationService);
  activeTab: 'vlan' | 'power' | 'storage' | 'cyber' | 'generator' | 'chaos' | 'observability' | 'glossary' = 'vlan';

  genHostname = 'custom-app';
  genVmid = 120;
  genRam = 512;
  isGenCopied = false;
  glossarySearch = '';

  get generatedTerraformCode(): string {
    return `module "lxc_${this.genHostname}" {
  source       = "../modules/proxmox_lxc"
  target_node  = "proxmox"
  vmid         = ${this.genVmid}
  hostname     = "${this.genHostname}"
  cores        = 2
  memory       = ${this.genRam}
  disk_size    = "8G"
  ip_address   = "192.168.1.${this.genVmid}/24"
  gateway      = "192.168.1.1"
  vlan_tag     = 20
  unprivileged = true
  tags         = ["terraform", "custom", "homelab"]
}`;
  }

  copyGen() {
    navigator.clipboard.writeText(this.generatedTerraformCode);
    this.isGenCopied = true;
    setTimeout(() => this.isGenCopied = false, 2000);
  }

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
      nodes: 'NPM Ingress, Vaultwarden, Immich, Nextcloud, Home Assistant, Gitea, Ollama (CT 110)',
      firewallPolicy: 'Strict forward authentication via Authentik (CT 108)'
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

  glossary = [
    { term: 'ZFS', def: 'Advanced 128-bit file system and logical volume manager with native checksums, copy-on-write, and ZSTD compression.' },
    { term: 'eBPF', def: 'Extended Berkeley Packet Filter allowing safe kernel-level observability (Tetragon & Falco) without modifying kernel source.' },
    { term: 'Passkeys', def: 'FIDO2 / WebAuthn cryptographic credentials providing passwordless and phishing-resistant zero-trust authentication.' },
    { term: 'NUT', def: 'Network UPS Tools providing continuous monitoring and graceful sequential shutdown for Coldex UPS batteries.' },
    { term: 'Ollama', def: 'Lightweight GPU LLM execution engine serving models like Qwen2.5-Coder and Llama-3.2 locally on GTX 1050 Ti.' },
    { term: 'Talos Linux', def: 'Immutable, zero-SSH, API-managed minimal Linux operating system designed strictly for running Kubernetes.' },
    { term: 'T-Pot', def: 'Multi-honeypot platform deploying honeypots (Cowrie, Dionaea, RDP) in an isolated DMZ with automated threat feeds.' },
    { term: 'CrowdSec', def: 'Collaborative open-source security engine analyzing logs to automatically ban malicious IPs across all ingress routes.' }
  ];

  get filteredGlossary() {
    const q = this.glossarySearch.toLowerCase().trim();
    if (!q) return this.glossary;
    return this.glossary.filter(g => g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q));
  }
}
