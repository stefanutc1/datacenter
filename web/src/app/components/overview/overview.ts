import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="w-full pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-obsidian-750 font-sans text-center">
      
      <!-- Main Headline (Newsreader Serif) -->
      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-slate-50 tracking-tight leading-[1.15] max-w-5xl mx-auto mb-6">
        {{ ts.t.heroTitle }}
      </h1>

      <!-- Description (Geist Sans) -->
      <p class="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-3xl mx-auto mb-12 font-normal">
        {{ ts.t.heroDescription }}
      </p>

      <!-- 4 Architectural Highlight Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans text-left">
        
        <div (click)="scrollTo('hardware')" class="p-5 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 space-y-2 hover:border-slate-500/60 transition-all shadow-lg cursor-pointer group">
          <div class="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{{ ts.t.metricComputeTitle }}</span>
            <span class="text-[10px] font-sans text-slate-500 group-hover:text-slate-300 transition-colors">↗</span>
          </div>
          <div class="text-2xl font-sans font-bold text-slate-50">{{ ts.t.metricComputeCount }}</div>
          <p class="text-xs text-slate-300 font-sans leading-relaxed">
            {{ ts.t.metricComputeDesc }}
          </p>
        </div>

        <div (click)="scrollTo('topology-section')" class="p-5 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 space-y-2 hover:border-slate-500/60 transition-all shadow-lg cursor-pointer group">
          <div class="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{{ ts.t.metricVirtTitle }}</span>
            <span class="text-[10px] font-sans text-slate-500 group-hover:text-slate-300 transition-colors">↗</span>
          </div>
          <div class="text-2xl font-sans font-bold text-slate-50">{{ ts.t.metricVirtCount }}</div>
          <p class="text-xs text-slate-300 font-sans leading-relaxed">
            {{ ts.t.metricVirtDesc }}
          </p>
        </div>

        <div (click)="scrollTo('services')" class="p-5 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 space-y-2 hover:border-slate-500/60 transition-all shadow-lg cursor-pointer group">
          <div class="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{{ ts.t.metricServicesTitle }}</span>
            <span class="text-[10px] font-sans text-slate-500 group-hover:text-slate-300 transition-colors">↗</span>
          </div>
          <div class="text-2xl font-sans font-bold text-slate-50">{{ ts.t.metricServicesCount }}</div>
          <p class="text-xs text-slate-300 font-sans leading-relaxed">
            {{ ts.t.metricServicesDesc }}
          </p>
        </div>

        <div (click)="onCyberClick()" class="p-5 rounded-2xl bg-obsidian-850/80 border border-obsidian-750 space-y-2 hover:border-slate-500/60 transition-all shadow-lg cursor-pointer group">
          <div class="text-[11px] font-sans font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              <span>{{ ts.t.metricCyberTitle }}</span>
            </span>
            <span class="text-[10px] font-sans text-slate-500 group-hover:text-slate-300 transition-colors">↗</span>
          </div>
          <div class="text-2xl font-sans font-bold text-slate-50">{{ ts.t.metricCyberCount }}</div>
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

  scrollTo(targetId: string) {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  onCyberClick() {
    window.location.hash = 'cyber';
    const el = document.getElementById('cyber') || document.getElementById('blueprint');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
