import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="sticky top-0 z-40 w-full bg-[#14100c]/90 backdrop-blur-xl border-b border-clay-700/40 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <!-- Logo / Title -->
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full bg-terracotta-500 animate-pulse"></span>
          <a href="#" class="flex items-center gap-2 text-sand-50 hover:text-terracotta-400 transition-colors">
            <span class="font-sans font-extrabold text-base tracking-tight">Homelab</span>
            <span class="font-mono text-xs text-sand-400 font-normal hidden sm:inline">// Infrastructure Digital Twin</span>
          </a>
        </div>

        <!-- Center Nav Links -->
        <nav class="hidden md:flex items-center gap-7 text-sand-300 font-sans text-xs font-medium tracking-wide">
          <a href="#topology-section" class="hover:text-sand-50 transition-colors">3D TOPOLOGY</a>
          <a href="#services" class="hover:text-sand-50 transition-colors">SERVICES (34)</a>
          <a href="#hardware" class="hover:text-sand-50 transition-colors">HARDWARE (4)</a>
          <a href="#blueprint" class="hover:text-sand-50 transition-colors">BLUEPRINT</a>
        </nav>

        <!-- Right Controls: Status & Theme Toggle & GitHub -->
        <div class="flex items-center gap-3 font-sans">
          <div class="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-clay-900/60 border border-clay-700/40 text-sand-200 text-xs font-medium">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>SYSTEM OPERATIONAL</span>
          </div>

          <!-- Light / Dark Theme Toggle -->
          <button
            (click)="toggleTheme()"
            class="p-2 rounded-lg bg-clay-900/60 border border-clay-700/40 text-sand-300 hover:text-sand-50 hover:border-terracotta-500/50 transition-colors"
            title="Toggle Light / Dark mode"
            aria-label="Toggle Theme"
          >
            {{ isDark ? '☀' : '☾' }}
          </button>

          <a
            href="https://github.com/stefanutc1/homelab"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3.5 py-1.5 rounded-lg bg-terracotta-500/15 border border-terracotta-500/40 text-terracotta-400 hover:bg-terracotta-500 hover:text-sand-50 font-bold transition-all text-xs"
          >
            GITHUB REPO
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
