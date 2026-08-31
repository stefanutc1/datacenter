import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SERVICES_DATA, ServiceItem } from '../../data/services.data';
import { TOPOLOGY_NODES, TopologyNode } from '../../data/topology.data';

@Component({
  selector: 'app-service-matrix',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="services" class="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div class="space-y-2">
          <div class="text-xs font-mono font-bold tracking-widest text-terracotta-400 uppercase">
            MICROSERVICES CATALOG & WORKLOAD ROSTER
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold font-serif text-sand-50 tracking-tight">
            Active Containerized Services ({{ services.length }})
          </h2>
          <p class="text-sm text-sand-300 max-w-2xl font-sans">
            Live microservices, databases, and sandboxes deployed across Proxmox x86_64 and ARM64 Apple M1 hypervisors with allocated RAM and storage pools.
          </p>
        </div>

        <!-- Search Bar -->
        <div class="w-full md:w-72">
          <input
            type="text"
            [value]="searchQuery"
            (input)="onSearch($event)"
            placeholder="Search service, port, host..."
            class="w-full px-4 py-2.5 rounded-xl bg-[#1c1611] border border-clay-700/50 text-sand-100 placeholder:text-sand-400 font-mono text-xs outline-none focus:border-terracotta-500 transition-colors shadow-inner"
          />
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2 font-mono">
        @for (cat of categories; track cat.id) {
          <button
            (click)="activeCategory = cat.id"
            [class.bg-terracotta-500]="activeCategory === cat.id"
            [class.text-sand-50]="activeCategory === cat.id"
            [class.font-bold]="activeCategory === cat.id"
            [class.text-sand-300]="activeCategory !== cat.id"
            [class.bg-[#1c1611]]="activeCategory !== cat.id"
            [class.hover:text-sand-50]="activeCategory !== cat.id"
            class="px-3.5 py-2 rounded-xl text-xs border border-clay-700/50 transition-all whitespace-nowrap"
          >
            {{ cat.label }}
          </button>
        }
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (srv of filteredServices; track srv.id) {
          <div class="p-5 rounded-2xl bg-[#1a140f] border border-clay-700/40 hover:border-terracotta-500/50 transition-all flex flex-col justify-between group shadow-lg">
            
            <div class="space-y-3.5">
              <!-- Top Row: Icon & Status -->
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[#241c15] border border-clay-700/40 p-2 flex items-center justify-center">
                    <img [src]="'icons/' + srv.icon + '.svg'" [alt]="srv.name" class="w-full h-full object-contain" (error)="onImgError($event)" />
                  </div>
                  <div>
                    <h3 class="font-serif font-bold text-sand-50 text-base group-hover:text-terracotta-400 transition-colors">
                      {{ srv.name }}
                    </h3>
                    <div class="text-[11px] font-mono text-sand-400">
                      {{ srv.domain }}
                    </div>
                  </div>
                </div>

                <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {{ srv.status }}
                </span>
              </div>

              <!-- Description -->
              <p class="text-xs text-sand-300 leading-relaxed font-sans">
                {{ srv.description }}
              </p>

              <!-- Hardware Allocations -->
              <div class="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div class="p-2 rounded-lg bg-[#241c15] border border-clay-700/30">
                  <div class="text-[9px] text-sand-400 uppercase">RAM Ceiling</div>
                  <div class="font-bold text-terracotta-400">{{ srv.ram }}</div>
                </div>
                <div class="p-2 rounded-lg bg-[#241c15] border border-clay-700/30">
                  <div class="text-[9px] text-sand-400 uppercase">Storage Pool</div>
                  <div class="font-bold text-sand-200">{{ srv.storage }}</div>
                </div>
              </div>

              <div class="p-2 rounded-lg bg-[#241c15] border border-clay-700/30 font-mono text-[11px] text-sand-300 flex items-center justify-between">
                <span>{{ srv.node }}</span>
                @if (srv.port > 0) {
                  <span class="text-terracotta-400 font-bold">:{{ srv.port }}</span>
                }
              </div>
            </div>

            <!-- Focus in 3D Button -->
            <div class="pt-4 mt-4 border-t border-clay-700/30 flex items-center justify-between">
              <button
                (click)="focusNodeInTopology(srv)"
                class="text-xs font-mono text-terracotta-400 hover:text-terracotta-300 font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>LOCATE IN 3D MESH</span>
                <span>→</span>
              </button>
            </div>

          </div>
        }
      </div>

    </section>
  `
})
export class ServiceMatrixComponent {
  @Output() nodeFocused = new EventEmitter<TopologyNode>();

  services: ServiceItem[] = SERVICES_DATA;
  searchQuery = '';
  activeCategory = 'all';

  categories = [
    { id: 'all', label: 'ALL SERVICES' },
    { id: 'core', label: 'CORE INFRASTRUCTURE' },
    { id: 'storage', label: 'STORAGE & SYNC' },
    { id: 'media', label: 'MEDIA & STREAMING' },
    { id: 'monitoring', label: 'OBSERVABILITY' },
    { id: 'security', label: 'SECURITY & SSO' },
    { id: 'automation', label: 'AUTOMATION & IOT' },
    { id: 'cyber', label: 'THREAT HUNTING' }
  ];

  get filteredServices(): ServiceItem[] {
    return this.services.filter(s => {
      const matchCat = this.activeCategory === 'all' || s.category === this.activeCategory;
      const q = this.searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.node.toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q) ||
        String(s.port).includes(q);

      return matchCat && matchSearch;
    });
  }

  onSearch(e: Event) {
    this.searchQuery = (e.target as HTMLInputElement).value;
  }

  onImgError(e: Event) {
    (e.target as HTMLElement).style.display = 'none';
  }

  focusNodeInTopology(srv: ServiceItem) {
    const found = TOPOLOGY_NODES.find(n =>
      n.id === srv.id ||
      n.name.toLowerCase().includes(srv.name.toLowerCase()) ||
      (n.port && n.port === srv.port)
    );
    if (found) {
      this.nodeFocused.emit(found);
      const topEl = document.getElementById('topology-section');
      if (topEl) topEl.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
