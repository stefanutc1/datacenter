import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="sticky top-0 z-40 w-full bg-[#0c0e11]/95 backdrop-blur-xl border-b border-obsidian-750 font-sans text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <!-- Logo / Title -->
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <a href="#" class="flex items-baseline gap-2.5 text-slate-50 hover:text-emerald-400 transition-colors">
            <span class="font-serif font-bold text-xl tracking-tight">Homelab</span>
            <span class="font-mono text-[11px] text-slate-400 font-normal hidden sm:inline">// Infrastructure Digital Twin</span>
          </a>
        </div>

        <!-- Center Nav Links (Geist Sans) -->
        <nav class="hidden md:flex items-center gap-7 text-slate-300 font-medium text-xs tracking-normal">
          <a href="#overview" class="hover:text-slate-50 transition-colors">Overview</a>
          <a href="#topology-section" class="hover:text-slate-50 transition-colors">3D Topology</a>
          <a href="#services" class="hover:text-slate-50 transition-colors">Services (34)</a>
          <a href="#hardware" class="hover:text-slate-50 transition-colors">Hardware Fleet</a>
          <a href="#blueprint" class="hover:text-slate-50 transition-colors">Cyber & Architecture</a>
        </nav>

        <!-- Right Controls: Status & Theme Toggle & GitHub -->
        <div class="flex items-center gap-3 font-sans">
          <div class="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-obsidian-850 border border-obsidian-700 text-slate-200 text-xs font-medium font-mono">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>OPERATIONAL</span>
          </div>

          <!-- Light / Dark Theme Toggle -->
          <button
            (click)="toggleTheme()"
            class="p-2 rounded-lg bg-obsidian-850 border border-obsidian-700 text-slate-300 hover:text-slate-50 hover:border-emerald-500/50 transition-colors"
            title="Toggle Light / Dark mode"
            aria-label="Toggle Theme"
          >
            {{ isDark ? '☀' : '☾' }}
          </button>

          <a
            href="https://github.com/stefanutc1/homelab"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-medium transition-all text-xs font-mono"
          >
            GitHub
          </a>
        </div>

      </div>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  isDark = true;

  ngOnInit() {
    this.isDark = document.documentElement.classList.contains('dark');
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
