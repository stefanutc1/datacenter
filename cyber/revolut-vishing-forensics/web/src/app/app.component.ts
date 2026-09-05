import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { articles, Article } from './data/wikiData';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="visualizer-container">
      <header class="header">
        <div class="brand">
          <span class="badge">ANGULAR DFIR VISUALIZER</span>
          <h1>Revolut Vishing & Telephony Fraud Forensics</h1>
          <p class="meta">Date: 10 August 2026 · Author: &#64;stefanutc1 · TLP:CLEAR</p>
        </div>
      </header>

      <div class="layout-grid">
        <aside class="sidebar">
          <div class="sidebar-title">Forensic Reports</div>
          <div class="article-list">
            <button
              *ngFor="let art of articlesList"
              (click)="selectArticle(art)"
              [class.active]="selectedArticle.id === art.id"
              class="article-btn"
            >
              <div class="art-title">{{ art.title }}</div>
              <div class="art-cat">{{ art.category }}</div>
            </button>
          </div>
        </aside>

        <main class="content-panel">
          <div class="content-header">
            <h2>{{ selectedArticle.title }}</h2>
            <span class="cat-pill">{{ selectedArticle.category }}</span>
          </div>
          <div class="content-body">
            <pre>{{ selectedArticle.content }}</pre>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .visualizer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .header {
      padding: 20px;
      background: var(--bg-surface);
      border: 1px solid var(--border-dim);
      border-radius: 8px;
    }
    .badge {
      display: inline-block;
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--accent-amber);
      margin-bottom: 6px;
      font-weight: 600;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-main);
    }
    .meta {
      font-size: 12px;
      font-family: 'Geist Mono', monospace;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .layout-grid {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;
    }
    .sidebar {
      background: var(--bg-surface);
      border: 1px solid var(--border-dim);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .sidebar-title {
      font-size: 11px;
      font-family: 'Geist Mono', monospace;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
    }
    .article-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .article-btn {
      text-align: left;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid var(--border-dim);
      background: var(--bg-card);
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .article-btn:hover {
      background: #1c212b;
      color: var(--text-main);
    }
    .article-btn.active {
      background: #1c212b;
      border-color: var(--accent-amber);
      color: var(--text-main);
    }
    .art-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-main);
    }
    .art-cat {
      font-size: 11px;
      font-family: 'Geist Mono', monospace;
      color: var(--accent-amber);
      margin-top: 2px;
    }
    .content-panel {
      background: var(--bg-surface);
      border: 1px solid var(--border-dim);
      border-radius: 8px;
      padding: 24px;
    }
    .content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-dim);
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    h2 {
      font-size: 20px;
      color: var(--text-main);
    }
    .cat-pill {
      font-size: 11px;
      font-family: 'Geist Mono', monospace;
      padding: 3px 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      color: var(--accent-amber);
    }
    .content-body pre {
      font-family: 'Geist Mono', monospace;
      font-size: 12px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
      color: #cbd5e1;
    }
  `]
})
export class AppComponent {
  articlesList = articles;
  selectedArticle = articles[0];

  selectArticle(art: Article) {
    this.selectedArticle = art;
  }
}
