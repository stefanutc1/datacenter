import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HARDWARE_NODES, HardwareNode } from '../../data/hardware.data';
import { TOPOLOGY_NODES, TopologyNode } from '../../data/topology.data';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-hardware-fleet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="hardware" class="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      
      <!-- Section Header -->
      <div class="space-y-2 mb-10">
        <div class="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
          {{ ts.t.hwTag }}
        </div>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-slate-50 tracking-tight">
          {{ ts.t.hwTitle }}
        </h2>
        <p class="text-sm text-slate-300 max-w-3xl font-sans font-normal leading-relaxed">
          {{ ts.t.hwDesc }}
        </p>
      </div>

      <!-- 4 Hardware Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
        @for (hw of hardware; track hw.id) {
          <div class="p-6 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 hover:border-obsidian-600 transition-all flex flex-col justify-between shadow-xl group">
            
            <div class="space-y-4">
              <!-- Top Row: Name, Machine & Status -->
              <div class="flex items-start justify-between gap-3 border-b border-obsidian-750 pb-4">
                <div>
                  <div class="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    {{ hw.machine }}
                  </div>
                  <h3 class="text-xl font-serif font-bold text-slate-50 group-hover:text-emerald-400 transition-colors mt-0.5">
                    {{ hw.name }}
                  </h3>
                  <div class="text-xs text-slate-300 font-sans mt-1">
                    {{ hw.role }}
                  </div>
                </div>
                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                  {{ hw.status }}
                </span>
              </div>

              <!-- Technical Specs Grid (IBM Plex Mono) -->
              <div class="grid grid-cols-2 gap-2.5 font-mono text-xs">
                
                <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750">
                  <div class="text-[10px] text-slate-400 uppercase">{{ ts.t.hwCpu }}</div>
                  <div class="text-xs font-bold text-slate-100 mt-0.5 truncate" [title]="hw.cpu">{{ hw.cpu }}</div>
                </div>

                <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750">
                  <div class="text-[10px] text-slate-400 uppercase">{{ ts.t.hwOs }}</div>
                  <div class="text-xs font-bold text-slate-200 mt-0.5 truncate" [title]="hw.os">{{ hw.os }}</div>
                </div>

                <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750">
                  <div class="text-[10px] text-slate-400 uppercase">{{ ts.t.hwRam }}</div>
                  <div class="text-xs font-bold text-emerald-400 mt-0.5 truncate" [title]="hw.ram">{{ hw.ram }}</div>
                </div>

                <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750">
                  <div class="text-[10px] text-slate-400 uppercase">{{ ts.t.hwStorage }}</div>
                  <div class="text-xs font-bold text-slate-100 mt-0.5 truncate" [title]="hw.storage">{{ hw.storage }}</div>
                </div>

                @if (hw.gpu) {
                  <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750 col-span-2 sm:col-span-1">
                    <div class="text-[10px] text-slate-400 uppercase">{{ ts.t.hwGpu }}</div>
                    <div class="text-xs font-bold text-slate-100 mt-0.5 truncate" [title]="hw.gpu">{{ hw.gpu }}</div>
                  </div>
                }

                @if (hw.psu) {
                  <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750 col-span-2 sm:col-span-1">
                    <div class="text-[10px] text-slate-400 uppercase">{{ ts.t.hwPsu }}</div>
                    <div class="text-xs font-bold text-slate-100 mt-0.5 truncate">{{ hw.psu }}</div>
                  </div>
                }

              </div>

              <!-- Workloads Hosted on this Node -->
              <div class="space-y-2 pt-2 font-mono">
                <div class="text-xs uppercase tracking-wider text-slate-400">
                  {{ ts.t.hwHostedWorkloads }} ({{ hw.workloads.length }})
                </div>
                <div class="space-y-1 text-xs">
                  @for (w of hw.workloads; track w) {
                    <div class="p-2 rounded-lg bg-obsidian-900/80 border border-obsidian-750 flex items-center gap-2 text-slate-200 text-[11px]">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                      <span class="truncate">{{ w }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Bottom Row: IP & 3D Focus Link -->
            <div class="pt-5 mt-4 border-t border-obsidian-750 flex items-center justify-between font-mono">
              <span class="text-xs text-slate-400">{{ hw.ip }}</span>
              <button
                (click)="focusHardwareNode(hw)"
                class="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>{{ ts.t.btnLocate3D }}</span>
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

  ts = inject(TranslationService);
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
