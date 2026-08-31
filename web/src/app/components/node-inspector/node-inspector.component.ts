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
      <div class="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#1a140f]/95 backdrop-blur-2xl border-l border-clay-700/50 shadow-2xl flex flex-col font-sans text-sand-200 transition-all duration-300">
        
        <!-- Inspector Header -->
        <div class="p-5 border-b border-clay-700/40 flex items-start justify-between gap-4 bg-[#140f0b]/80">
          <div class="flex items-center gap-3.5">
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm border border-clay-600/40 shadow-md"
              [style.background-color]="node.color + '25'"
              [style.color]="node.color"
            >
              {{ node.id.substring(0, 4).toUpperCase() }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-serif font-bold text-xl text-sand-50 leading-tight">
                  {{ node.name }}
                </h2>
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {{ node.status }}
                </span>
              </div>
              <div class="text-xs text-sand-400 font-mono mt-0.5">
                {{ node.sublabel || node.ip }}
              </div>
            </div>
          </div>

          <button
            (click)="close.emit()"
            class="p-2 rounded-lg text-sand-400 hover:text-sand-50 hover:bg-clay-800/60 transition-colors"
            aria-label="Close Inspector"
          >
            ✕
          </button>
        </div>

        <!-- Tab Selector -->
        <div class="flex items-center px-4 border-b border-clay-700/40 bg-[#140f0b]/50 gap-2 font-mono text-xs">
          <button
            (click)="activeTab = 'spec'"
            [class.border-terracotta-500]="activeTab === 'spec'"
            [class.text-terracotta-400]="activeTab === 'spec'"
            [class.font-bold]="activeTab === 'spec'"
            [class.border-transparent]="activeTab !== 'spec'"
            [class.text-sand-400]="activeTab !== 'spec'"
            class="py-3 px-3 border-b-2 transition-colors"
          >
            SPECIFICATION
          </button>
          <button
            (click)="activeTab = 'cascade'"
            [class.border-terracotta-500]="activeTab === 'cascade'"
            [class.text-terracotta-400]="activeTab === 'cascade'"
            [class.font-bold]="activeTab === 'cascade'"
            [class.border-transparent]="activeTab !== 'cascade'"
            [class.text-sand-400]="activeTab !== 'cascade'"
            class="py-3 px-3 border-b-2 transition-colors"
          >
            RELATIONSHIPS
          </button>
          <button
            (click)="activeTab = 'manifest'"
            [class.border-terracotta-500]="activeTab === 'manifest'"
            [class.text-terracotta-400]="activeTab === 'manifest'"
            [class.font-bold]="activeTab === 'manifest'"
            [class.border-transparent]="activeTab !== 'manifest'"
            [class.text-sand-400]="activeTab !== 'manifest'"
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
              <div class="p-4 rounded-xl bg-[#211b15] border border-clay-700/40 space-y-1.5">
                <div class="text-[10px] font-mono uppercase tracking-widest text-terracotta-400 font-bold">
                  FUNCTION & ARCHITECTURAL ROLE
                </div>
                <p class="text-xs text-sand-200 leading-relaxed font-sans">
                  {{ node.role }}
                </p>
              </div>

              <!-- Hardware Allocations -->
              @if (node.hardware) {
                <div class="space-y-2">
                  <div class="text-xs font-mono uppercase tracking-wider text-sand-400">
                    Host & Capacity Allocation
                  </div>
                  <div class="grid grid-cols-2 gap-2.5 font-mono">
                    <div class="p-3 rounded-lg bg-[#211b15] border border-clay-700/40">
                      <div class="text-[10px] text-sand-400 uppercase">Compute Host</div>
                      <div class="text-xs font-bold text-sand-100 truncate">{{ node.hardware.node }}</div>
                    </div>
                    <div class="p-3 rounded-lg bg-[#211b15] border border-clay-700/40">
                      <div class="text-[10px] text-sand-400 uppercase">RAM Ceiling</div>
                      <div class="text-xs font-bold text-terracotta-400">{{ node.hardware.ram }}</div>
                    </div>
                    <div class="p-3 rounded-lg bg-[#211b15] border border-clay-700/40">
                      <div class="text-[10px] text-sand-400 uppercase">Storage Pool</div>
                      <div class="text-xs font-bold text-sand-100 truncate">{{ node.hardware.storage }}</div>
                    </div>
                    <div class="p-3 rounded-lg bg-[#211b15] border border-clay-700/40">
                      <div class="text-[10px] text-sand-400 uppercase">Tier Level</div>
                      <div class="text-xs font-bold text-sand-100">Tier {{ node.tier }} ({{ node.category }})</div>
                    </div>
                  </div>
                </div>
              }

              <!-- Network Endpoints -->
              <div class="space-y-2">
                <div class="text-xs font-mono uppercase tracking-wider text-sand-400">
                  Network Configuration
                </div>
                <div class="p-3.5 rounded-xl bg-[#211b15] border border-clay-700/40 space-y-2 font-mono text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-sand-400">IP Address</span>
                    <span class="font-bold text-sand-100">{{ node.ip }}</span>
                  </div>
                  @if (node.port) {
                    <div class="flex items-center justify-between">
                      <span class="text-sand-400">Exposed Port</span>
                      <span class="font-bold text-terracotta-400">:{{ node.port }}</span>
                    </div>
                  }
                  <div class="flex items-center justify-between">
                    <span class="text-sand-400">Subsystem</span>
                    <span class="font-bold text-sand-300 uppercase">{{ node.category }}</span>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- TAB 2: RELATIONSHIP CASCADE -->
          @if (activeTab === 'cascade') {
            <div class="space-y-5">
              <div class="text-xs font-mono uppercase tracking-wider text-sand-400">
                End-to-End Relationship Chain
              </div>

              <div class="p-4 rounded-xl bg-[#211b15] border border-clay-700/40 space-y-3 font-mono text-xs">
                <!-- 1. Workload -->
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-terracotta-500"></span>
                  <div>
                    <div class="text-[10px] text-sand-400 uppercase">Workload Node</div>
                    <div class="font-bold text-sand-100">{{ node.name }}</div>
                  </div>
                </div>

                <div class="ml-3 pl-3 border-l border-clay-600/40 h-3"></div>

                <!-- 2. Host -->
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-amethyst-500" style="background-color: #a87db8"></span>
                  <div>
                    <div class="text-[10px] text-sand-400 uppercase">Virtualization Host</div>
                    <div class="font-bold text-sand-100">{{ node.hardware?.node || 'Proxmox Core' }}</div>
                  </div>
                </div>

                <div class="ml-3 pl-3 border-l border-clay-600/40 h-3"></div>

                <!-- 3. Security Perimeter -->
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-warm" style="background-color: #d4973b"></span>
                  <div>
                    <div class="text-[10px] text-sand-400 uppercase">Security Boundary</div>
                    <div class="font-bold text-sand-100">OPNsense · Suricata IPS · Authelia</div>
                  </div>
                </div>

                <div class="ml-3 pl-3 border-l border-clay-600/40 h-3"></div>

                <!-- 4. Observability -->
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-sage-warm" style="background-color: #6e9e75"></span>
                  <div>
                    <div class="text-[10px] text-sand-400 uppercase">Telemetry Monitoring</div>
                    <div class="font-bold text-sand-100">Prometheus TSDB · Grafana · Wazuh SIEM</div>
                  </div>
                </div>
              </div>

              <!-- Connected Mesh Nodes -->
              <div class="space-y-2">
                <div class="text-xs font-mono uppercase tracking-wider text-sand-400 flex items-center justify-between">
                  <span>Connected Mesh Nodes ({{ connectedNodes.length }})</span>
                  <span class="text-[10px] text-terracotta-400">CLICK TO JUMP</span>
                </div>

                <div class="grid grid-cols-1 gap-2">
                  @for (conn of connectedNodes; track conn.id) {
                    <button
                      (click)="selectConnected.emit(conn)"
                      class="w-full flex items-center justify-between p-3 rounded-lg bg-[#211b15] border border-clay-700/40 hover:border-terracotta-500/60 text-left transition-all group"
                    >
                      <div class="flex items-center gap-2.5 truncate">
                        <span class="w-2 h-2 rounded-full" [style.background-color]="conn.color"></span>
                        <div class="truncate">
                          <div class="font-mono text-xs font-bold text-sand-100 group-hover:text-terracotta-400 truncate">
                            {{ conn.name }}
                          </div>
                          <div class="font-mono text-[10px] text-sand-400 truncate">
                            {{ conn.sublabel || conn.ip }}
                          </div>
                        </div>
                      </div>
                      <span class="font-mono text-xs text-sand-500 group-hover:text-terracotta-400">→</span>
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
                <span class="text-xs uppercase tracking-wider text-sand-400">
                  Container Manifest Spec
                </span>
                <button
                  (click)="copyManifest()"
                  class="px-2.5 py-1 rounded bg-clay-800 hover:bg-terracotta-500 hover:text-sand-50 text-xs text-sand-200 transition-colors font-bold"
                >
                  {{ isCopied ? 'COPIED!' : 'COPY SPEC' }}
                </button>
              </div>

              <pre class="p-4 rounded-xl bg-[#140f0b] text-sand-200 text-[11px] overflow-x-auto border border-clay-700/40 leading-relaxed"><code>{{ manifestCode }}</code></pre>
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
