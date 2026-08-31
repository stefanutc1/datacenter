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
      
      <!-- Section Header -->
      <div class="space-y-2 mb-10">
        <div class="text-xs font-mono font-bold tracking-widest text-terracotta-400 uppercase">
          PHYSICAL COMPUTE ARCHITECTURE & HARDWARE INVENTORY
        </div>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-sand-50 tracking-tight">
          Physical Hardware Fleet (4 Compute Nodes)
        </h2>
        <p class="text-sm text-sand-300 max-w-3xl font-sans font-normal leading-relaxed">
          Source of truth from <code class="text-xs font-mono bg-clay-850 px-1.5 py-0.5 rounded border border-clay-700/50 text-sand-200">hardware/hardware.md</code> — multi-architecture bare-metal infrastructure spanning Intel Core i3 virtualization, Apple Silicon M1 ARM64 UTM nodes, ASUS Celeron ZFS storage NAS, and AMD Athlon II Kubernetes worker.
        </p>
      </div>

      <!-- 4 Hardware Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        @for (hw of hardware; track hw.id) {
          <div class="p-6 rounded-2xl bg-[#1a140f] border border-clay-700/40 hover:border-terracotta-500/50 transition-all flex flex-col justify-between shadow-xl group">
            
            <div class="space-y-4">
              <!-- Top Row: Name, Machine & Status -->
              <div class="flex items-start justify-between gap-3 border-b border-clay-700/40 pb-4">
                <div>
                  <div class="text-[11px] font-mono text-terracotta-400 font-bold uppercase tracking-wider">
                    {{ hw.machine }}
                  </div>
                  <h3 class="text-xl font-serif font-bold text-sand-50 group-hover:text-terracotta-400 transition-colors mt-0.5">
                    {{ hw.name }}
                  </h3>
                  <div class="text-xs text-sand-300 font-sans mt-1">
                    {{ hw.role }}
                  </div>
                </div>
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                  {{ hw.status }}
                </span>
              </div>

              <!-- Technical Specs Grid -->
              <div class="grid grid-cols-2 gap-2.5 font-mono text-xs">
                
                <div class="p-3 rounded-xl bg-[#241c15] border border-clay-700/30">
                  <div class="text-[10px] text-sand-400 uppercase">Processor (CPU)</div>
                  <div class="text-xs font-bold text-sand-100 mt-0.5 truncate" [title]="hw.cpu">{{ hw.cpu }}</div>
                </div>

                <div class="p-3 rounded-xl bg-[#241c15] border border-clay-700/30">
                  <div class="text-[10px] text-sand-400 uppercase">Operating System</div>
                  <div class="text-xs font-bold text-sand-200 mt-0.5 truncate" [title]="hw.os">{{ hw.os }}</div>
                </div>

                <div class="p-3 rounded-xl bg-[#241c15] border border-clay-700/30">
                  <div class="text-[10px] text-sand-400 uppercase">RAM Capacity</div>
                  <div class="text-xs font-bold text-terracotta-400 mt-0.5 truncate" [title]="hw.ram">{{ hw.ram }}</div>
                </div>

                <div class="p-3 rounded-xl bg-[#241c15] border border-clay-700/30">
                  <div class="text-[10px] text-sand-400 uppercase">Storage Pool</div>
                  <div class="text-xs font-bold text-sand-100 mt-0.5 truncate" [title]="hw.storage">{{ hw.storage }}</div>
                </div>

                @if (hw.gpu) {
                  <div class="p-3 rounded-xl bg-[#241c15] border border-clay-700/30 col-span-2 sm:col-span-1">
                    <div class="text-[10px] text-sand-400 uppercase">Graphics / ML Accelerator</div>
                    <div class="text-xs font-bold text-sand-100 mt-0.5 truncate" [title]="hw.gpu">{{ hw.gpu }}</div>
                  </div>
                }

                @if (hw.psu) {
                  <div class="p-3 rounded-xl bg-[#241c15] border border-clay-700/30 col-span-2 sm:col-span-1">
                    <div class="text-[10px] text-sand-400 uppercase">Power Supply (PSU)</div>
                    <div class="text-xs font-bold text-sand-100 mt-0.5 truncate">{{ hw.psu }}</div>
                  </div>
                }

              </div>

              <!-- Workloads Hosted on this Node -->
              <div class="space-y-2 pt-2">
                <div class="text-xs font-mono uppercase tracking-wider text-sand-400">
                  Hosted Virtual Workloads & Services ({{ hw.workloads.length }})
                </div>
                <div class="space-y-1 font-mono text-xs">
                  @for (w of hw.workloads; track w) {
                    <div class="p-2 rounded-lg bg-[#241c15]/70 border border-clay-700/30 flex items-center gap-2 text-sand-200 text-[11px]">
                      <span class="w-1.5 h-1.5 rounded-full bg-terracotta-500 flex-shrink-0"></span>
                      <span class="truncate">{{ w }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Bottom Row: IP & 3D Focus Link -->
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
