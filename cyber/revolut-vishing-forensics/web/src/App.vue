<template>
  <div class="wiki-container">
    <header class="wiki-header">
      <div class="header-left">
        <span class="logo-icon">📞</span>
        <div class="brand">
          <h1>Revolut Vishing Threat Operations Hub</h1>
          <span class="version-tag">Voice Phishing · Caller ID Spoofing · FinTech Fraud</span>
        </div>
      </div>
      <div class="header-right">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input v-model="searchQuery" type="text" placeholder="Search case study, IOCs, vectors..." />
          <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">✕</button>
        </div>
        <a href="https://github.com/stefannut/revolut-vishing-forensics" target="_blank" class="github-link">
          GitHub Repo ↗
        </a>
      </div>
    </header>

    <div class="wiki-body">
      <aside class="wiki-sidebar">
        <div class="sidebar-section">
          <h3>Forensic Dossiers</h3>
          <ul class="nav-list">
            <li
              v-for="article in filteredArticles"
              :key="article.id"
              :class="{ active: selectedArticle && selectedArticle.id === article.id && activeTab === 'docs' }"
              @click="selectArticle(article)"
            >
              <span class="nav-icon">{{ article.icon }}</span>
              <span class="nav-title">{{ article.title }}</span>
            </li>
          </ul>
        </div>

        <div class="sidebar-section">
          <h3>Threat Intel & Matrix</h3>
          <ul class="nav-list">
            <li :class="{ active: activeTab === 'iocs' }" @click="activeTab = 'iocs'">
              <span class="nav-icon">🎯</span>
              <span class="nav-title">IOC Matrix ({{ iocs.length }})</span>
            </li>
            <li :class="{ active: activeTab === 'mitre' }" @click="activeTab = 'mitre'">
              <span class="nav-icon">📊</span>
              <span class="nav-title">MITRE ATT&CK Explorer</span>
            </li>
          </ul>
        </div>

        <div class="sidebar-footer">
          <p>Investigator: <strong>@stefannut</strong></p>
          <p>TLP:CLEAR · Cyber Threat Intelligence</p>
        </div>
      </aside>

      <main class="wiki-content">
        <!-- DOCS TAB -->
        <div v-if="activeTab === 'docs' && selectedArticle" class="article-view">
          <div class="article-meta">
            <span class="badge">{{ selectedArticle.category }}</span>
            <span class="summary-text">{{ selectedArticle.summary }}</span>
          </div>
          <article class="markdown-body" v-html="renderedMarkdown"></article>
        </div>

        <!-- IOC TAB -->
        <div v-else-if="activeTab === 'iocs'" class="iocs-view">
          <div class="view-header">
            <h2>🎯 Indicators of Compromise (IOC) Matrix</h2>
            <p>Cryptographic hashes, telephony vectors, domain artifacts, and endpoint exposures.</p>
          </div>
          <div class="ioc-table-wrapper">
            <table class="ioc-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Indicator / Value</th>
                  <th>Threat Description</th>
                  <th>Triage Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ioc in filteredIocs" :key="ioc.indicator">
                  <td><span class="type-pill">{{ ioc.type }}</span></td>
                  <td><code>{{ ioc.indicator }}</code></td>
                  <td>{{ ioc.threat }}</td>
                  <td><span class="status-badge">{{ ioc.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- MITRE ATT&CK TAB -->
        <div v-else-if="activeTab === 'mitre'" class="mitre-view">
          <div class="view-header">
            <h2>📊 MITRE ATT&CK Enterprise Matrix Mapping</h2>
            <p>Adversary tactics, techniques, and procedures (TTPs) mapped to the enterprise framework.</p>
          </div>
          <div class="mitre-grid">
            <div class="mitre-card">
              <span class="t-badge">T1566.002 / T1566.004</span>
              <h4>Initial Access & Phishing</h4>
              <p>Delivery via targeted spearphishing lures on social networks, Discord direct messages, or spoofed telephony (Vishing).</p>
            </div>
            <div class="mitre-card">
              <span class="t-badge">T1557.001 / T1556</span>
              <h4>Credential Access & AiTM Relay</h4>
              <p>Real-time proxying of authentication challenges, harvesting of 2FA TOTP / 3DS tokens, and session cookie capture.</p>
            </div>
            <div class="mitre-card">
              <span class="t-badge">T1098 / T1027</span>
              <h4>Persistence & Defense Evasion</h4>
              <p>Account locking mechanisms, API key provisioning, User-Agent filtering, and minified obfuscated JavaScript bundles.</p>
            </div>
            <div class="mitre-card">
              <span class="t-badge">T1499 / T1496</span>
              <h4>Impact & Financial Expropriation</h4>
              <p>Unauthorized digital asset transfers, financial draining of cryptocurrency deposits, and account takeovers.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { marked } from 'marked';
import { articles, iocList } from './data/wikiData.js';

const activeTab = ref('docs');
const allArticles = ref(articles);
const iocs = ref(iocList);
const selectedArticle = ref(articles[0]);
const searchQuery = ref('');

const filteredArticles = computed(() => {
  if (!searchQuery.value) return allArticles.value;
  const q = searchQuery.value.toLowerCase();
  return allArticles.value.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.summary.toLowerCase().includes(q) ||
    a.content.toLowerCase().includes(q)
  );
});

const filteredIocs = computed(() => {
  if (!searchQuery.value) return iocs.value;
  const q = searchQuery.value.toLowerCase();
  return iocs.value.filter(i =>
    i.indicator.toLowerCase().includes(q) ||
    i.threat.toLowerCase().includes(q) ||
    i.type.toLowerCase().includes(q)
  );
});

const renderedMarkdown = computed(() => {
  if (!selectedArticle.value) return '';
  return marked.parse(selectedArticle.value.content);
});

function selectArticle(art) {
  selectedArticle.value = art;
  activeTab.value = 'docs';
}
</script>

<style scoped>
.wiki-container { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.wiki-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 24px; background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); }
.header-left { display: flex; align-items: center; gap: 12px; }
.logo-icon { font-size: 28px; }
.brand h1 { font-size: 18px; font-weight: 700; color: var(--text-primary); }
.version-tag { font-size: 11px; font-family: var(--font-mono); color: var(--accent-cyan); }
.header-right { display: flex; align-items: center; gap: 16px; }
.search-box { display: flex; align-items: center; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 6px 12px; gap: 8px; }
.search-box input { background: transparent; border: none; color: var(--text-primary); outline: none; font-size: 13px; width: 240px; }
.clear-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }
.github-link { font-size: 13px; font-weight: 600; color: var(--text-secondary); background: var(--bg-card); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); }
.github-link:hover { color: var(--text-primary); border-color: var(--accent-cyan); text-decoration: none; }

.wiki-body { display: flex; flex: 1; overflow: hidden; }
.wiki-sidebar { width: 300px; background: var(--bg-secondary); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto; padding: 16px 0; }
.sidebar-section { padding: 0 16px; margin-bottom: 24px; }
.sidebar-section h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 8px; }
.nav-list { list-style: none; }
.nav-list li { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; color: var(--text-secondary); margin-bottom: 4px; transition: all 0.15s ease; }
.nav-list li:hover { background: var(--bg-hover); color: var(--text-primary); }
.nav-list li.active { background: var(--bg-card); color: var(--accent-cyan); font-weight: 600; border-left: 3px solid var(--accent-cyan); }
.sidebar-footer { padding: 16px; border-top: 1px solid var(--border-color); font-size: 11px; color: var(--text-muted); }

.wiki-content { flex: 1; overflow-y: auto; padding: 32px 48px; background: var(--bg-primary); }
.article-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.badge { font-size: 11px; font-family: var(--font-mono); background: rgba(56, 189, 248, 0.1); color: var(--accent-cyan); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.3); }
.summary-text { font-size: 13px; color: var(--text-muted); }

.markdown-body :deep(h1) { font-size: 26px; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }
.markdown-body :deep(h2) { font-size: 20px; font-weight: 600; margin: 24px 0 12px; }
.markdown-body :deep(h3) { font-size: 16px; font-weight: 600; margin: 16px 0 8px; }
.markdown-body :deep(p) { margin-bottom: 14px; color: var(--text-secondary); }
.markdown-body :deep(ul), .markdown-body :deep(ol) { margin: 0 0 16px 24px; color: var(--text-secondary); }
.markdown-body :deep(li) { margin-bottom: 4px; }
.markdown-body :deep(pre) { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; padding: 16px; overflow-x: auto; margin: 16px 0; color: #e2e8f0; }
.markdown-body :deep(code) { background: rgba(255, 255, 255, 0.08); padding: 2px 6px; border-radius: 4px; font-size: 12px; color: var(--accent-cyan); }
.markdown-body :deep(table) { width: 100%; border-collapse: collapse; margin: 16px 0; }
.markdown-body :deep(th), .markdown-body :deep(td) { border: 1px solid var(--border-color); padding: 8px 12px; text-align: left; font-size: 13px; }
.markdown-body :deep(th) { background: var(--bg-secondary); }

.view-header { margin-bottom: 24px; }
.view-header h2 { font-size: 24px; margin-bottom: 6px; }
.view-header p { color: var(--text-muted); font-size: 14px; }

.ioc-table-wrapper { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
.ioc-table { width: 100%; border-collapse: collapse; }
.ioc-table th, .ioc-table td { padding: 12px 16px; border-bottom: 1px solid var(--border-color); text-align: left; font-size: 13px; }
.ioc-table th { background: var(--bg-card); color: var(--text-muted); text-transform: uppercase; font-size: 11px; }
.type-pill { font-size: 11px; font-family: var(--font-mono); background: rgba(56, 189, 248, 0.1); color: var(--accent-cyan); padding: 2px 6px; border-radius: 4px; }
.status-badge { font-size: 11px; font-family: var(--font-mono); color: var(--accent-emerald); }

.mitre-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.mitre-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; }
.t-badge { display: inline-block; font-size: 11px; font-family: var(--font-mono); color: var(--accent-red); background: rgba(248, 113, 113, 0.1); padding: 2px 6px; border-radius: 4px; margin-bottom: 8px; }
.mitre-card h4 { font-size: 16px; margin-bottom: 6px; }
.mitre-card p { font-size: 13px; color: var(--text-secondary); }
</style>
