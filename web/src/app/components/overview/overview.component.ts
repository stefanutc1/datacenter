import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="w-full pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-obsidian-750 font-sans">
      
      <!-- Top Tag (Geist Sans) -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-850 border border-obsidian-700 text-xs font-sans font-medium text-emerald-400 mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>{{ ts.t.heroTag }}</span>
      </div>

      <!-- Main Headline (Newsreader Serif) -->
      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-slate-50 tracking-tight leading-[1.15] max-w-5xl mb-6">
        {{ ts.t.heroTitle }}
      </h1>

      <!-- Description (Geist Sans) -->
      <p class="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-3xl mb-10 font-normal">
        {{ ts.t.heroDescription }}
      </p>

      <!-- 4 Architectural Highlight Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        
        <div class="p-5 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 space-y-2 hover:border-obsidian-600 transition-colors shadow-lg">
          <div class="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider">{{ ts.t.metricComputeTitle }}</div>
          <div class="text-2xl font-serif font-bold text-slate-50">{{ ts.t.metricComputeCount }}</div>
          <p class="text-xs text-slate-300 font-sans leading-relaxed">
            {{ ts.t.metricComputeDesc }}
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 space-y-2 hover:border-obsidian-600 transition-colors shadow-lg">
          <div class="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider">{{ ts.t.metricVirtTitle }}</div>
          <div class="text-2xl font-serif font-bold text-slate-50">{{ ts.t.metricVirtCount }}</div>
          <p class="text-xs text-slate-300 font-sans leading-relaxed">
            {{ ts.t.metricVirtDesc }}
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 space-y-2 hover:border-obsidian-600 transition-colors shadow-lg">
          <div class="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider">{{ ts.t.metricServicesTitle }}</div>
          <div class="text-2xl font-serif font-bold text-slate-50">{{ ts.t.metricServicesCount }}</div>
          <p class="text-xs text-slate-300 font-sans leading-relaxed">
            {{ ts.t.metricServicesDesc }}
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 space-y-2 hover:border-obsidian-600 transition-colors shadow-lg">
          <div class="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider">{{ ts.t.metricCyberTitle }}</div>
          <div class="text-2xl font-serif font-bold text-slate-50">{{ ts.t.metricCyberCount }}</div>
          <p class="text-xs text-slate-300 font-sans leading-relaxed">
            {{ ts.t.metricCyberDesc }}
          </p>
        </div>

      </div>

    </section>
  `
})
export class OverviewComponent {
  ts = inject(TranslationService);
}
