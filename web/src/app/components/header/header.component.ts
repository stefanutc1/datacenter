import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="sticky top-0 z-40 w-full bg-[#080d17]/90 backdrop-blur-xl border-b border-white/10 font-mono text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <!-- Logo / Title -->
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <a href="#" class="font-bold text-sm text-white tracking-wider hover:text-cyan-400 transition-colors">
            HOMELAB <span class="text-slate-400 font-normal hidden sm:inline">// INFRASTRUCTURE DIGITAL TWIN</span>
          </a>
        </div>

        <!-- Center Nav Links -->
        <nav class="hidden md:flex items-center gap-6 text-slate-400">
          <a href="#topology-section" class="hover:text-cyan-400 transition-colors">3D TOPOLOGY</a>
          <a href="#services" class="hover:text-cyan-400 transition-colors">SERVICES (34)</a>
          <a href="#hardware" class="hover:text-cyan-400 transition-colors">HARDWARE (4)</a>
          <a href="#blueprint" class="hover:text-cyan-400 transition-colors">BLUEPRINT</a>
        </nav>

        <!-- Live Cluster Status -->
        <div class="flex items-center gap-3">
          <div class="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>SYSTEM OPERATIONAL</span>
          </div>

          <a
            href="https://github.com/stefanutc1/homelab"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold transition-all"
          >
            GITHUB REPO
          </a>
        </div>

      </div>
    </header>
  `
})
export class HeaderComponent {}
