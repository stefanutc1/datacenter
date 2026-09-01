import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopologyNode, TOPOLOGY_NODES } from '../../data/topology.data';
import { SERVICES_DATA, ServiceItem } from '../../data/services.data';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-node-inspector',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (node) {
      <div class="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#0c0e11]/95 backdrop-blur-2xl border-l border-obsidian-750 shadow-2xl flex flex-col font-sans text-slate-200 transition-all duration-300">
        
        <!-- Inspector Header -->
        <div class="p-5 border-b border-obsidian-750 flex items-start justify-between gap-4 bg-obsidian-950/80">
          <div class="flex items-center gap-3.5">
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm border border-obsidian-700 shadow-md"
              [style.background-color]="node.color + '20'"
              [style.color]="node.color"
            >
              {{ node.id.substring(0, 4).toUpperCase() }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-sans font-bold text-xl text-slate-50 leading-tight">
                  {{ node.name }}
                </h2>
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
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
            class="p-2 rounded-lg text-slate-400 hover:text-slate-50 hover:bg-obsidian-800 transition-colors"
            aria-label="Close Inspector"
          >
            ✕
          </button>
        </div>

        <!-- Tab Selector -->
        <div class="flex items-center px-4 border-b border-obsidian-750 bg-obsidian-950/50 gap-2 font-mono text-xs">
          <button
            (click)="activeTab = 'spec'"
            [class.border-emerald-500]="activeTab === 'spec'"
            [class.text-emerald-400]="activeTab === 'spec'"
            [class.font-bold]="activeTab === 'spec'"
            [class.border-transparent]="activeTab !== 'spec'"
            [class.text-slate-400]="activeTab !== 'spec'"
            class="py-3 px-3 border-b-2 transition-colors"
          >
            {{ ts.t.inspectorSpec }}
          </button>
          <button
            (click)="activeTab = 'cascade'"
            [class.border-emerald-500]="activeTab === 'cascade'"
            [class.text-emerald-400]="activeTab === 'cascade'"
            [class.font-bold]="activeTab === 'cascade'"
            [class.border-transparent]="activeTab !== 'cascade'"
            [class.text-slate-400]="activeTab !== 'cascade'"
            class="py-3 px-3 border-b-2 transition-colors"
          >
            {{ ts.t.inspectorCascade }}
          </button>
          <button
            (click)="activeTab = 'manifest'"
            [class.border-emerald-500]="activeTab === 'manifest'"
            [class.text-emerald-400]="activeTab === 'manifest'"
            [class.font-bold]="activeTab === 'manifest'"
            [class.border-transparent]="activeTab !== 'manifest'"
            [class.text-slate-400]="activeTab !== 'manifest'"
            class="py-3 px-3 border-b-2 transition-colors"
          >
            {{ ts.t.inspectorManifest }}
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          
          <!-- TAB 1: SPECIFICATION -->
          @if (activeTab === 'spec') {
            <div class="space-y-4 font-sans">
              <!-- System Role -->
              <div class="p-4 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-2">
                <div class="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  {{ ts.t.inspectorRole }}
                </div>
                <p class="text-xs text-slate-200 leading-relaxed font-normal">
                  {{ node.role }}
                </p>
                @if (node.tags && node.tags.length > 0) {
                  <div class="flex flex-wrap gap-1.5 pt-1 border-t border-obsidian-750/60">
                    @for (tag of node.tags; track tag) {
                      <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-obsidian-900 border border-obsidian-700 text-emerald-400">
                        #{{ tag }}
                      </span>
                    }
                  </div>
                }
              </div>

              <!-- Hardware Allocations -->
              @if (node.hardware) {
                <div class="space-y-2 font-mono">
                  <div class="text-xs uppercase tracking-wider text-slate-400">
                    {{ ts.t.inspectorHostAllocation }}
                  </div>
                  <div class="grid grid-cols-2 gap-2.5">
                    <div class="p-3 rounded-lg bg-obsidian-850 border border-obsidian-750">
                      <div class="text-[10px] text-slate-400 uppercase">{{ ts.t.inspectorComputeHost }}</div>
                      <div class="text-xs font-bold text-slate-100 truncate">{{ node.hardware.node }}</div>
                    </div>
                    <div class="p-3 rounded-lg bg-obsidian-850 border border-obsidian-750">
                      <div class="text-[10px] text-slate-400 uppercase">{{ ts.t.srvRamCeiling }}</div>
                      <div class="text-xs font-bold text-emerald-400">{{ node.hardware.ram }}</div>
                    </div>
                    <div class="p-3 rounded-lg bg-obsidian-850 border border-obsidian-750">
                      <div class="text-[10px] text-slate-400 uppercase">{{ ts.t.srvStoragePool }}</div>
                      <div class="text-xs font-bold text-slate-100 truncate">{{ node.hardware.storage }}</div>
                    </div>
                    <div class="p-3 rounded-lg bg-obsidian-850 border border-obsidian-750">
                      <div class="text-[10px] text-slate-400 uppercase">{{ ts.t.inspectorTierLevel }}</div>
                      <div class="text-xs font-bold text-slate-100">Tier {{ node.tier }} ({{ node.category }})</div>
                    </div>
                  </div>
                </div>
              }

              <!-- Network Endpoints -->
              <div class="space-y-2 font-mono">
                <div class="text-xs uppercase tracking-wider text-slate-400">
                  {{ ts.t.inspectorNetworkConfig }}
                </div>
                <div class="p-3.5 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">{{ ts.t.inspectorIp }}</span>
                    <span class="font-bold text-slate-100">{{ node.ip }}</span>
                  </div>
                  @if (node.port) {
                    <div class="flex items-center justify-between">
                      <span class="text-slate-400">{{ ts.t.inspectorPort }}</span>
                      <span class="font-bold text-emerald-400">:{{ node.port }}</span>
                    </div>
                  }
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">{{ ts.t.inspectorSubsystem }}</span>
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
                {{ ts.t.inspectorRelationshipChain }}
              </div>

              <div class="p-4 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-3 font-mono text-xs">
                <!-- 1. Workload -->
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Workload Node</div>
                    <div class="font-bold text-slate-100">{{ node.name }}</div>
                  </div>
                </div>

                <div class="ml-3 pl-3 border-l border-obsidian-700 h-3"></div>

                <!-- 2. Host -->
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Virtualization Host</div>
                    <div class="font-bold text-slate-100">{{ node.hardware?.node || 'Proxmox Core' }}</div>
                  </div>
                </div>

                <div class="ml-3 pl-3 border-l border-obsidian-700 h-3"></div>

                <!-- 3. Security Perimeter -->
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Security Boundary</div>
                    <div class="font-bold text-slate-100">OPNsense · Suricata IPS · Authelia</div>
                  </div>
                </div>

                <div class="ml-3 pl-3 border-l border-obsidian-700 h-3"></div>

                <!-- 4. Observability -->
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase">Telemetry Monitoring</div>
                    <div class="font-bold text-slate-100">Prometheus TSDB · Grafana · Tempo · Wazuh</div>
                  </div>
                </div>
              </div>

              <!-- Connected Mesh Nodes -->
              <div class="space-y-2 font-mono">
                <div class="text-xs uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>{{ ts.t.inspectorConnectedNodes }} ({{ connectedNodes.length }})</span>
                  <span class="text-[10px] text-emerald-400">CLICK TO JUMP</span>
                </div>

                <div class="grid grid-cols-1 gap-2">
                  @for (conn of connectedNodes; track conn.id) {
                    <button
                      (click)="selectConnected.emit(conn)"
                      class="w-full flex items-center justify-between p-3 rounded-lg bg-obsidian-850 border border-obsidian-750 hover:border-emerald-500/60 text-left transition-all group"
                    >
                      <div class="flex items-center gap-2.5 truncate">
                        <span class="w-2 h-2 rounded-full" [style.background-color]="conn.color"></span>
                        <div class="truncate">
                          <div class="font-mono text-xs font-bold text-slate-100 group-hover:text-emerald-400 truncate">
                            {{ conn.name }}
                          </div>
                          <div class="font-mono text-[10px] text-slate-400 truncate">
                            {{ conn.sublabel || conn.ip }}
                          </div>
                        </div>
                      </div>
                      <span class="font-mono text-xs text-slate-500 group-hover:text-emerald-400">→</span>
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
                  class="px-2.5 py-1 rounded bg-obsidian-800 hover:bg-emerald-500 hover:text-slate-950 text-xs text-slate-200 transition-colors font-bold"
                >
                  {{ isCopied ? ts.t.inspectorCopied : ts.t.inspectorCopySpec }}
                </button>
              </div>

              <pre class="p-4 rounded-xl bg-obsidian-950 text-slate-200 text-[11px] overflow-x-auto border border-obsidian-750 leading-relaxed font-mono"><code>{{ manifestCode }}</code></pre>
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

  ts = inject(TranslationService);
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
