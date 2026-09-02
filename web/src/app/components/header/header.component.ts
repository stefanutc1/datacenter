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
        
        <!-- Left: Navigation Links -->
        <nav class="flex items-center gap-6 font-sans text-xs font-medium text-slate-300">
          <a href="#overview" class="hover:text-emerald-400 transition-colors">{{ ts.t.navOverview }}</a>
          <a href="#topology-section" class="hover:text-emerald-400 transition-colors">{{ ts.t.navTopology }}</a>
          <a href="#hardware" class="hover:text-emerald-400 transition-colors">{{ ts.t.navHardware }}</a>
          <a href="#services" class="hover:text-emerald-400 transition-colors">{{ ts.t.navServices }}</a>
          <a href="#about" class="hover:text-emerald-400 transition-colors">{{ ts.isRomanian ? 'Despre & Galerie' : 'About & Gallery' }}</a>
          <a href="#blueprint" class="hover:text-emerald-400 transition-colors">{{ ts.t.navBlueprint }}</a>
        </nav>

        <!-- Right: Language Switcher [ RO | EN ] -->
        <div class="flex items-center gap-3">
          
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

        </div>

      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() searchTriggered = new EventEmitter<void>();

  ts = inject(TranslationService);
}
