import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="w-full border-b border-obsidian-750 bg-[#0c0e11]/90 backdrop-blur-xl sticky top-0 z-40 font-sans">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <!-- Left: Logo & Digital Twin Pill -->
        <div class="flex items-center gap-3.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm shadow-sm">
            H
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="font-sans font-bold text-base text-slate-50 tracking-tight">Homelab</span>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                PROD
              </span>
            </div>
            <span class="text-[11px] font-sans font-normal text-slate-400">
              {{ ts.t.sublabelTag }}
            </span>
          </div>
        </div>

        <!-- Middle: Navigation Links -->
        <nav class="hidden md:flex items-center gap-6 font-sans text-xs font-medium text-slate-300">
          <a href="#overview" class="hover:text-emerald-400 transition-colors">{{ ts.t.navOverview }}</a>
          <a href="#topology-section" class="hover:text-emerald-400 transition-colors">{{ ts.t.navTopology }}</a>
          <a href="#hardware" class="hover:text-emerald-400 transition-colors">{{ ts.t.navHardware }}</a>
          <a href="#services" class="hover:text-emerald-400 transition-colors">{{ ts.t.navServices }}</a>
          <a href="#blueprint" class="hover:text-emerald-400 transition-colors">{{ ts.t.navBlueprint }}</a>
        </nav>

        <!-- Right: Command Palette Search & Language Switcher [ RO | EN ] -->
        <div class="flex items-center gap-3">
          
          <!-- Cmd+K Search Trigger Button -->
          <button
            (click)="searchTriggered.emit()"
            class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-750 hover:border-emerald-500/50 text-slate-300 text-xs font-mono transition-all shadow-inner group"
            title="Deschide Căutarea Globală (Cmd+K)"
          >
            <span class="text-emerald-400 font-bold">⌘K</span>
            <span class="text-slate-400 group-hover:text-slate-200 text-[11px]">{{ ts.isRomanian ? 'Căutare...' : 'Search...' }}</span>
          </button>

          <!-- Interactive Language Toggle -->
          <div class="flex items-center p-0.5 rounded-xl bg-obsidian-900 border border-obsidian-750 font-mono text-xs shadow-inner">
            <button
              (click)="ts.setLanguage('ro')"
              [class.bg-emerald-500]="ts.currentLang() === 'ro'"
              [class.text-slate-950]="ts.currentLang() === 'ro'"
              [class.font-bold]="ts.currentLang() === 'ro'"
              [class.text-slate-400]="ts.currentLang() !== 'ro'"
              [class.hover:text-slate-100]="ts.currentLang() !== 'ro'"
              class="px-2.5 py-1 rounded-lg transition-all"
              title="Comută în Limba Română"
            >
              RO
            </button>
            <button
              (click)="ts.setLanguage('en')"
              [class.bg-emerald-500]="ts.currentLang() === 'en'"
              [class.text-slate-950]="ts.currentLang() === 'en'"
              [class.font-bold]="ts.currentLang() === 'en'"
              [class.text-slate-400]="ts.currentLang() !== 'en'"
              [class.hover:text-slate-100]="ts.currentLang() !== 'en'"
              class="px-2.5 py-1 rounded-lg transition-all"
              title="Switch to English"
            >
              EN
            </button>
          </div>

          <!-- Live Cluster Status Pill -->
          <div class="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-750 font-mono text-xs text-slate-300 shadow-inner">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{{ ts.t.statusClusterActive }}</span>
          </div>

        </div>

      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() searchTriggered = new EventEmitter<void>();

  ts = inject(TranslationService);
}
