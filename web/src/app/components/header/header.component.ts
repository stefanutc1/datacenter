import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="w-full border-b border-obsidian-750 bg-[#0c0e11]/90 backdrop-blur-xl sticky top-0 z-40 font-sans">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center relative">
        
        <!-- Navigation Links -->
        <nav class="flex items-center justify-center gap-6 sm:gap-8 font-sans text-xs font-medium text-slate-300">
          <a href="#overview" class="hover:text-slate-100 transition-colors">{{ ts.t.navOverview }}</a>
          <a href="#topology-section" class="hover:text-slate-100 transition-colors">{{ ts.t.navTopology }}</a>
          <a href="#hardware" class="hover:text-slate-100 transition-colors">{{ ts.t.navHardware }}</a>
          <a href="#services" class="hover:text-slate-100 transition-colors">{{ ts.t.navServices }}</a>
          <a href="#about" class="hover:text-slate-100 transition-colors">About & Gallery</a>
          <a href="#cyber" (click)="onNavCyber()" class="hover:text-slate-100 transition-colors">Cyber & DFIR</a>
          <a href="#blueprint" class="hover:text-slate-100 transition-colors">Blueprint</a>
        </nav>

      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() searchTriggered = new EventEmitter<void>();

  ts = inject(TranslationService);

  onNavCyber() {
    window.location.hash = 'cyber';
    const el = document.getElementById('cyber') || document.getElementById('blueprint');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
