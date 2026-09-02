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
        
        <!-- Left spacer to maintain perfect mathematical center for nav links -->
        <div class="w-20 hidden md:block"></div>

        <!-- Center: Navigation Links -->
        <nav class="flex items-center justify-center gap-6 sm:gap-8 font-sans text-xs font-medium text-slate-300 flex-1">
          <a href="#overview" class="hover:text-slate-100 transition-colors">{{ ts.t.navOverview }}</a>
          <a href="#topology-section" class="hover:text-slate-100 transition-colors">{{ ts.t.navTopology }}</a>
          <a href="#hardware" class="hover:text-slate-100 transition-colors">{{ ts.t.navHardware }}</a>
          <a href="#services" class="hover:text-slate-100 transition-colors">{{ ts.t.navServices }}</a>
          <a href="#about" class="hover:text-slate-100 transition-colors">{{ ts.isRomanian ? 'Despre & Galerie' : 'About & Gallery' }}</a>
          <a href="#blueprint" class="hover:text-slate-100 transition-colors">{{ ts.t.navBlueprint }}</a>
        </nav>

        <!-- Right: Language Switcher [ RO | EN ] (Sleek Grey) -->
        <div class="flex items-center gap-3 w-20 justify-end">
          <div class="flex items-center p-0.5 rounded-xl bg-obsidian-900 border border-obsidian-750 font-sans text-xs shadow-inner">
            <button
              (click)="ts.setLanguage('ro')"
              [class.bg-obsidian-750]="ts.currentLang() === 'ro'"
              [class.text-slate-100]="ts.currentLang() === 'ro'"
              [class.font-semibold]="ts.currentLang() === 'ro'"
              [class.border]="ts.currentLang() === 'ro'"
              [class.border-obsidian-600]="ts.currentLang() === 'ro'"
              [class.shadow-sm]="ts.currentLang() === 'ro'"
              [class.text-slate-400]="ts.currentLang() !== 'ro'"
              [class.hover:text-slate-200]="ts.currentLang() !== 'ro'"
              class="px-2.5 py-1 rounded-lg transition-all"
              title="Comută în Limba Română"
            >
              RO
            </button>
            <button
              (click)="ts.setLanguage('en')"
              [class.bg-obsidian-750]="ts.currentLang() === 'en'"
              [class.text-slate-100]="ts.currentLang() === 'en'"
              [class.font-semibold]="ts.currentLang() === 'en'"
              [class.border]="ts.currentLang() === 'en'"
              [class.border-obsidian-600]="ts.currentLang() === 'en'"
              [class.shadow-sm]="ts.currentLang() === 'en'"
              [class.text-slate-400]="ts.currentLang() !== 'en'"
              [class.hover:text-slate-200]="ts.currentLang() !== 'en'"
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
