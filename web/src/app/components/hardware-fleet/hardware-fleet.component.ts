import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HARDWARE_NODES, HardwareNode } from '../../data/hardware.data';
import { TOPOLOGY_NODES, TopologyNode } from '../../data/topology.data';

@Component({
  selector: 'app-hardware-fleet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="hardware" class="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      
      <div class="space-y-2 mb-10">
        <div class="text-xs font-mono font-bold tracking-widest text-terracotta-400 uppercase">
          HETEROGENEOUS COMPUTE INFRASTRUCTURE
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold font-serif text-sand-50 tracking-tight">
          Physical Hardware Fleet (4 Nodes)
        </h2>
        <p class="text-sm text-sand-300 max-w-3xl font-sans">
          Multi-architecture bare-metal compute cluster spanning Intel x86_64 virtualization, Apple Silicon ARM64 UTM nodes, OpenMediaVault ZFS storage, and Kubernetes edge workers.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (hw of hardware; track hw.id) {
          <div class="p-6 rounded-2xl bg-[#1a140f] border border-clay-700/40 hover:border-terracotta-500/50 transition-all flex flex-col justify-between shadow-xl group">
            
            <div class="space-y-4">
              <!-- Top Row -->
              <div class="flex items-start justify-between gap-3 border-b border-clay-700/40 pb-4">
                <div>
                  <h3 class="text-xl font-bold font-serif text-sand-50 group-hover:text-terracotta-400 transition-colors">
                    {{ hw.name }}
                  </h3>
                  <div class="text-xs font-mono text-sand-400 mt-0.5">
                    {{ hw.role }}
                  </div>
                </div>
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {{ hw.status }}
                </span>
              </div>

              <!-- Technical Specs Grid -->
              <div class="grid grid-cols-2 gap-3 font-mono text-xs">
                <div class="p-3 rounded-xl bg-[#241c15] border border-clay-700/30">
                  <div class="text-[10px] text-sand-400 uppercase">Processor</div>
                  <div class="text-xs font-bold text-sand-100 mt-0.5 truncate">{{ hw.cpu }}</div>
                </div>
                <div class="p-3 rounded-xl bg-[#241c15] border border-clay-700/30">
                  <div class="text-[10px] text-sand-400 uppercase">Operating System</div>
                  <div class="text-xs font-bold text-sand-300 mt-0.5 truncate">{{ hw.os }}</div>
                </div>
                <div class="p-3 rounded-xl bg-[#241c15] border border-clay-700/30">
                  <div class="text-[10px] text-sand-400 uppercase">RAM Ceiling</div>
                  <div class="text-xs font-bold text-terracotta-400 mt-0.5">{{ hw.ram }}</div>
                </div>
                <div class="p-3 rounded-xl bg-[#241c15] border border-clay-700/30">
                  <div class="text-[10px] text-sand-400 uppercase">Storage Pool</div>
                  <div class="text-xs font-bold text-sand-100 mt-0.5 truncate">{{ hw.storage }}</div>
                </div>
              </div>

              <!-- Workloads Hosted -->
              <div class="space-y-2 pt-2">
                <div class="text-xs font-mono uppercase tracking-wider text-sand-400">
                  Hosted Virtual Workloads ({{ hw.workloads.length }})
                </div>
                <div class="space-y-1 font-mono text-xs">
                  @for (w of hw.workloads; track w) {
                    <div class="p-2 rounded-lg bg-[#241c15]/60 border border-clay-700/30 flex items-center gap-2 text-sand-200 text-[11px]">
                      <span class="w-1.5 h-1.5 rounded-full bg-terracotta-500 flex-shrink-0"></span>
                      <span class="truncate">{{ w }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Focus in 3D Button -->
            <div class="pt-5 mt-4 border-t border-clay-700/30 flex items-center justify-between">
              <span class="font-mono text-xs text-sand-400">{{ hw.ip }}</span>
              <button
                (click)="focusHardwareNode(hw)"
                class="text-xs font-mono text-terracotta-400 hover:text-terracotta-300 font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>LOCATE SERVER IN 3D</span>
                <span>→</span>
              </button>
            </div>

          </div>
        }
      </div>

    </section>
  `
})
export class HardwareFleetComponent {
  @Output() nodeFocused = new EventEmitter<TopologyNode>();

  hardware: HardwareNode[] = HARDWARE_NODES;

  focusHardwareNode(hw: HardwareNode) {
    const found = TOPOLOGY_NODES.find(n => n.id === hw.id);
    if (found) {
      this.nodeFocused.emit(found);
      const topEl = document.getElementById('topology-section');
      if (topEl) topEl.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
