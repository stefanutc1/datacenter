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
        <div class="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
          HETEROGENEOUS COMPUTE INFRASTRUCTURE
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold text-white font-mono tracking-tight">
          Physical Hardware Fleet (4 Nodes)
        </h2>
        <p class="text-sm text-slate-400 max-w-3xl">
          Multi-architecture bare-metal compute cluster spanning Intel x86_64 virtualization, Apple Silicon ARM64 UTM nodes, OpenMediaVault ZFS storage, and Kubernetes edge workers.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (hw of hardware; track hw.id) {
          <div class="p-6 rounded-2xl bg-[#0d131f] border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between shadow-xl group">
            
            <div class="space-y-4">
              <!-- Top Row -->
              <div class="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h3 class="text-lg font-bold font-mono text-white group-hover:text-cyan-400 transition-colors">
                    {{ hw.name }}
                  </h3>
                  <div class="text-xs font-mono text-slate-400 mt-0.5">
                    {{ hw.role }}
                  </div>
                </div>
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {{ hw.status }}
                </span>
              </div>

              <!-- Technical Specs Grid -->
              <div class="grid grid-cols-2 gap-3 font-mono text-xs">
                <div class="p-3 rounded-xl bg-[#111a2a] border border-white/5">
                  <div class="text-[10px] text-slate-500 uppercase">Processor</div>
                  <div class="text-xs font-bold text-white mt-0.5 truncate">{{ hw.cpu }}</div>
                </div>
                <div class="p-3 rounded-xl bg-[#111a2a] border border-white/5">
                  <div class="text-[10px] text-slate-500 uppercase">Operating System</div>
                  <div class="text-xs font-bold text-slate-300 mt-0.5 truncate">{{ hw.os }}</div>
                </div>
                <div class="p-3 rounded-xl bg-[#111a2a] border border-white/5">
                  <div class="text-[10px] text-slate-500 uppercase">RAM Ceiling</div>
                  <div class="text-xs font-bold text-cyan-400 mt-0.5">{{ hw.ram }}</div>
                </div>
                <div class="p-3 rounded-xl bg-[#111a2a] border border-white/5">
                  <div class="text-[10px] text-slate-500 uppercase">Storage Pool</div>
                  <div class="text-xs font-bold text-white mt-0.5 truncate">{{ hw.storage }}</div>
                </div>
              </div>

              <!-- Workloads Hosted -->
              <div class="space-y-2 pt-2">
                <div class="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Hosted Virtual Workloads ({{ hw.workloads.length }})
                </div>
                <div class="space-y-1 font-mono text-xs">
                  @for (w of hw.workloads; track w) {
                    <div class="p-2 rounded-lg bg-[#111a2a]/60 border border-white/5 flex items-center gap-2 text-slate-300 text-[11px]">
                      <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0"></span>
                      <span class="truncate">{{ w }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Focus in 3D Button -->
            <div class="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
              <span class="font-mono text-xs text-slate-500">{{ hw.ip }}</span>
              <button
                (click)="focusHardwareNode(hw)"
                class="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 transition-colors"
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
