import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopologyNode, TOPOLOGY_NODES } from '../../data/topology.data';
import { SERVICES_DATA, ServiceItem } from '../../data/services.data';

@Component({
  selector: 'app-node-inspector',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (node) {
      <div class="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#0c121e]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col font-sans text-slate-200 transition-all duration-300">
        
        <!-- Inspector Header -->
        <div class="p-5 border-b border-white/10 flex items-start justify-between gap-4 bg-[#080d17]/80">
          <div class="flex items-center gap-3.5">
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm border border-white/20 shadow-md"
              [style.background-color]="node.color + '25'"
              [style.color]="node.color"
            >
              {{ node.id.substring(0, 4).toUpperCase() }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-bold text-lg text-white font-mono leading-tight">
                  {{ node.name }}
                </h2>
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {{ node.status }}
                </span>
              </div>
              <div class="text-xs text-slate-400 font-mono mt-0.5">
                {{ node.sublabel || node.ip }}
              </div>
            </div>
          </div>

          <button
            (click)="close.emit()"
            class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Inspector"
          >
            ✕
          </button>
        </div>

        <!-- Tab Selector -->
        <div class="flex items-center px-4 border-b border-white/10 bg-[#080d17]/50 gap-2 font-mono text-xs">
          <button
            (click)="activeTab = 'spec'"
            [class.border-cyan-400]="activeTab === 'spec'"
            [class.text-cyan-400]="activeTab === 'spec'"
            [class.font-bold]="activeTab === 'spec'"
            [class.border-transparent]="activeTab !== 'spec'"
            [class.text-slate-400]="activeTab !== 'spec'"
            class="py-3 px-3 border-b-2 transition-colors"
          >
            SPECIFICATION
          </button>
          <button
            (click)="activeTab = 'cascade'"
            [class.border-cyan-400]="activeTab === 'cascade'"
            [class.text-cyan-400]="activeTab === 'cascade'"
            [class.font-bold]="activeTab === 'cascade'"
            [class.border-transparent]="activeTab !== 'cascade'"
            [class.text-slate-400]="activeTab !== 'cascade'"
            class="py-3 px-3 border-b-2 transition-colors"
          >
            RELATIONSHIPS
          </button>
          <button
            (click)="activeTab = 'manifest'"
            [class.border-cyan-400]="activeTab === 'manifest'"
            [class.text-cyan-400]="activeTab === 'manifest'"
            [class.font-bold]="activeTab === 'manifest'"
            [class.border-transparent]="activeTab !== 'manifest'"
            [class.text-slate-400]="activeTab !== 'manifest'"
            class="py-3 px-3 border-b-2 transition-colors"
          >
            MANIFEST
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          
          <!-- TAB 1: SPECIFICATION -->
          @if (activeTab === 'spec') {
            <div class="space-y-4">
              <!-- System Role -->
              <div class="p-4 rounded-xl bg-[#111927] border border-white/10 space-y-1.5">
                <div class="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  FUNCTION & ARCHITECTURAL ROLE
                </div>
                <p class="text-xs text-slate-300 leading-relaxed">
                  {{ node.role }}
                </p>
              </div>

              <!-- Hardware Allocations -->
              @if (node.hardware) {
                <div class="space-y-2">
                  <div class="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Host & Capacity Allocation
                  </div>
                  <div class="grid grid-cols-2 gap-2.5 font-mono">
                    <div class="p-3 rounded-lg bg-[#111927] border border-white/10">
                      <div class="text-[10px] text-slate-400 uppercase">Compute Host</div>
                      <div class="text-xs font-bold text-white truncate">{{ node.hardware.node }}</div>
                    </div>
                    <div class="p-3 rounded-lg bg-[#111927] border border-white/10">
                      <div class="text-[10px] text-slate-400 uppercase">RAM Ceiling</div>
                      <div class="text-xs font-bold text-cyan-400">{{ node.hardware.ram }}</div>
                    </div>
                    <div class="p-3 rounded-lg bg-[#111927] border border-white/10">
                      <div class="text-[10px] text-slate-400 uppercase">Storage Pool</div>
                      <div class="text-xs font-bold text-white truncate">{{ node.hardware.storage }}</div>
                    </div>
                    <div class="p-3 rounded-lg bg-[#111927] border border-white/10">
                      <div class="text-[10px] text-slate-400 uppercase">Tier Level</div>
                      <div class="text-xs font-bold text-white">Tier {{ node.tier }} ({{ node.category }})</div>
                    </div>
                  </div>
                </div>
              }

              <!-- Network Endpoints -->
              <div class="space-y-2">
                <div class="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Network Configuration
                </div>
                <div class="p-3.5 rounded-xl bg-[#111927] border border-white/10 space-y-2 font-mono text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">IP Address</span>
                    <span class="font-bold text-white">{{ node.ip }}</span>
                  </div>
                  @if (node.port) {
                    <div class="flex items-center justify-between">
                      <span class="text-slate-400">Exposed Port</span>
                      <span class="font-bold text-cyan-400">:{{ node.port }}</span>
                    </div>
                  }
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">Subsystem</span>
                    <span class="font-bold text-slate-300 uppercase">{{ node.category }}</span>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- TAB 2: RELATIONSHIP CASCADE -->
          @if (activeTab === 'cascade') {
            <div class="space-y-5">
              <div class="text-xs font-mono uppercase tracking-wider text-slate-400">
                End-to-End Relationship Chain
              </div>

              <div class="p-4 rounded-xl bg-[#111927] border border-white/10 space-y-3 font-mono text-xs">
                <!-- 1. Workload -->
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Workload Node</div>
                    <div class="font-bold text-white">{{ node.name }}</div>
                  </div>
                </div>

                <div class="ml-3 pl-3 border-l border-white/15 h-3"></div>

                <!-- 2. Host -->
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Virtualization Host</div>
                    <div class="font-bold text-white">{{ node.hardware?.node || 'Proxmox Core' }}</div>
                  </div>
                </div>

                <div class="ml-3 pl-3 border-l border-white/15 h-3"></div>

                <!-- 3. Security Perimeter -->
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Security Boundary</div>
                    <div class="font-bold text-white">OPNsense · Suricata IPS · Authelia</div>
                  </div>
                </div>

                <div class="ml-3 pl-3 border-l border-white/15 h-3"></div>

                <!-- 4. Observability -->
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Telemetry Monitoring</div>
                    <div class="font-bold text-white">Prometheus TSDB · Grafana · Wazuh SIEM</div>
                  </div>
                </div>
              </div>

              <!-- Connected Mesh Nodes -->
              <div class="space-y-2">
                <div class="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Connected Mesh Nodes ({{ connectedNodes.length }})</span>
                  <span class="text-[10px] text-cyan-400">CLICK TO JUMP</span>
                </div>

                <div class="grid grid-cols-1 gap-2">
                  @for (conn of connectedNodes; track conn.id) {
                    <button
                      (click)="selectConnected.emit(conn)"
                      class="w-full flex items-center justify-between p-3 rounded-lg bg-[#111927] border border-white/10 hover:border-cyan-400/60 text-left transition-all group"
                    >
                      <div class="flex items-center gap-2.5 truncate">
                        <span class="w-2 h-2 rounded-full" [style.background-color]="conn.color"></span>
                        <div class="truncate">
                          <div class="font-mono text-xs font-bold text-white group-hover:text-cyan-400 truncate">
                            {{ conn.name }}
                          </div>
                          <div class="font-mono text-[10px] text-slate-400 truncate">
                            {{ conn.sublabel || conn.ip }}
                          </div>
                        </div>
                      </div>
                      <span class="font-mono text-xs text-slate-500 group-hover:text-cyan-400">→</span>
                    </button>
                  }
                </div>
              </div>
            </div>
          }

          <!-- TAB 3: MANIFEST -->
          @if (activeTab === 'manifest') {
            <div class="space-y-3 font-mono">
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase tracking-wider text-slate-400">
                  Container Manifest Spec
                </span>
                <button
                  (click)="copyManifest()"
                  class="px-2.5 py-1 rounded bg-white/10 hover:bg-cyan-500 hover:text-black text-xs text-white transition-colors font-bold"
                >
                  {{ isCopied ? 'COPIED!' : 'COPY SPEC' }}
                </button>
              </div>

              <pre class="p-4 rounded-xl bg-[#080d17] text-cyan-300 text-[11px] overflow-x-auto border border-white/10 leading-relaxed"><code>{{ manifestCode }}</code></pre>
            </div>
          }

        </div>
      </div>
    }
  `
})
export class NodeInspectorComponent {
  @Input() node: TopologyNode | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() selectConnected = new EventEmitter<TopologyNode>();

  activeTab: 'spec' | 'cascade' | 'manifest' = 'spec';
  isCopied = false;

  get connectedNodes(): TopologyNode[] {
    if (!this.node) return [];
    return this.node.connections
      .map(id => TOPOLOGY_NODES.find(n => n.id === id))
      .filter((n): n is TopologyNode => Boolean(n));
  }

  get manifestCode(): string {
    if (!this.node) return '';
    const srv = SERVICES_DATA.find(s => s.id === this.node?.id || s.name.toLowerCase() === this.node?.name.toLowerCase());
    if (srv) return srv.composeCode;

    return `# Node Infrastructure Spec: ${this.node.name}\nnode_id: ${this.node.id}\nhost: ${this.node.hardware?.node || 'Cluster Host'}\nram_allocation: ${this.node.hardware?.ram || 'Standard'}\nstorage_pool: ${this.node.hardware?.storage || 'Standard'}\nip_endpoint: ${this.node.ip}\nstatus: ${this.node.status}`;
  }

  copyManifest() {
    navigator.clipboard.writeText(this.manifestCode);
    this.isCopied = true;
    setTimeout(() => this.isCopied = false, 2000);
  }
}
