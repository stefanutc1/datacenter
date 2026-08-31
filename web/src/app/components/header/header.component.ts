import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Language } from '../../services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="sticky top-0 z-40 w-full bg-[#0c0e11]/95 backdrop-blur-xl border-b border-obsidian-750 font-sans text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <!-- Logo / Title (Clean Geist Sans) -->
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <a href="#" class="flex items-baseline gap-2.5 text-white hover:text-emerald-400 transition-colors">
            <span class="font-sans font-bold text-lg tracking-tight">Homelab</span>
            <span class="font-sans text-xs text-slate-400 font-normal hidden sm:inline">{{ ts.t.sublabelTag }}</span>
          </a>
        </div>

        <!-- Center Nav Links (Geist Sans) -->
        <nav class="hidden md:flex items-center gap-6 text-slate-300 font-medium text-xs tracking-normal font-sans">
          <a href="#overview" class="hover:text-white transition-colors">{{ ts.t.navOverview }}</a>
          <a href="#topology-section" class="hover:text-white transition-colors">{{ ts.t.navTopology }}</a>
          <a href="#services" class="hover:text-white transition-colors">{{ ts.t.navServices }}</a>
          <a href="#hardware" class="hover:text-white transition-colors">{{ ts.t.navHardware }}</a>
          <a href="#blueprint" class="hover:text-white transition-colors">{{ ts.t.navBlueprint }}</a>
        </nav>

        <!-- Right Controls: Status & Language Toggle & Theme Toggle & GitHub -->
        <div class="flex items-center gap-3 font-sans">
          
          <!-- Language Switcher RO / EN -->
          <div class="flex items-center p-0.5 rounded-lg bg-obsidian-850 border border-obsidian-700 font-mono text-[11px]">
            <button
              (click)="setLang('ro')"
              [class.bg-emerald-500]="ts.currentLang() === 'ro'"
              [class.text-slate-950]="ts.currentLang() === 'ro'"
              [class.font-bold]="ts.currentLang() === 'ro'"
              [class.text-slate-400]="ts.currentLang() !== 'ro'"
              class="px-2 py-1 rounded transition-all"
            >
              RO
            </button>
            <button
              (click)="setLang('en')"
              [class.bg-emerald-500]="ts.currentLang() === 'en'"
              [class.text-slate-950]="ts.currentLang() === 'en'"
              [class.font-bold]="ts.currentLang() === 'en'"
              [class.text-slate-400]="ts.currentLang() !== 'en'"
              class="px-2 py-1 rounded transition-all"
            >
              EN
            </button>
          </div>

          <div class="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-850 border border-obsidian-700 text-slate-300 text-xs font-medium font-sans">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{{ ts.t.statusClusterActive }}</span>
          </div>

          <!-- Light / Dark Theme Toggle -->
          <button
            (click)="toggleTheme()"
            class="p-2 rounded-lg bg-obsidian-850 border border-obsidian-700 text-slate-300 hover:text-white hover:border-emerald-500/50 transition-colors"
            title="Toggle Light / Dark mode"
            aria-label="Toggle Theme"
          >
            {{ isDark ? '☀' : '☾' }}
          </button>

          <a
            href="https://github.com/stefanutc1/homelab"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-medium transition-all text-xs font-sans"
          >
            GitHub
          </a>
        </div>

      </div>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  ts = inject(TranslationService);
  isDark = true;

  ngOnInit() {
    this.isDark = document.documentElement.classList.contains('dark');
  }

  setLang(lang: Language) {
    this.ts.setLanguage(lang);
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }
}
