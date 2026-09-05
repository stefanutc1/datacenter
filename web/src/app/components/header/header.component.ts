import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="w-full border-b border-obsidian-750 bg-[#0c0e11]/90 backdrop-blur-xl sticky top-0 z-40 font-sans">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        
        <!-- Left: Brand Title -->
        <a href="#overview" class="flex items-center gap-2 text-slate-100 font-bold text-sm tracking-tight hover:text-slate-300 transition-colors w-28">
          <span class="w-2 h-2 rounded-full bg-slate-400"></span>
          <span>Datacenter</span>
        </a>

        <!-- Center: Navigation Links -->
        <nav class="flex items-center justify-center gap-6 sm:gap-8 font-sans text-xs font-medium text-slate-300 flex-1">
          <a href="#overview" class="hover:text-slate-100 transition-colors">{{ ts.t.navOverview }}</a>
          <a href="#topology-section" class="hover:text-slate-100 transition-colors">{{ ts.t.navTopology }}</a>
          <a href="#hardware" class="hover:text-slate-100 transition-colors">{{ ts.t.navHardware }}</a>
          <a href="#services" class="hover:text-slate-100 transition-colors">{{ ts.t.navServices }}</a>
          <a href="#about" class="hover:text-slate-100 transition-colors">About & Gallery</a>
          <a href="#blueprint" class="hover:text-slate-100 transition-colors">{{ ts.t.navBlueprint }}</a>
        </nav>

        <!-- Right: Quick Search Shortcut (Cmd+K / Ctrl+K) -->
        <div class="flex items-center gap-3 justify-end">
          <button
            (click)="searchTriggered.emit()"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-750 hover:border-slate-600 text-slate-300 hover:text-slate-100 text-xs font-mono transition-all shadow-inner group"
            title="Press Cmd+K or Ctrl+K to search"
          >
            <span class="text-[11px] text-slate-400 group-hover:text-slate-200">Search</span>
            <kbd class="px-1.5 py-0.5 rounded bg-obsidian-800 border border-obsidian-700 text-[10px] text-slate-400 group-hover:text-slate-200">⌘K</kbd>
          </button>
        </div>

      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() searchTriggered = new EventEmitter<void>();

  ts = inject(TranslationService);
}
