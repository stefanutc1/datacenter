<template>
 <div class="wiki-container">
 <header class="wiki-header">
 <div class="header-left">
 <span class="logo-icon"></span>
 <div class="brand">
 <h1>{{ t('hub_title') }}</h1>
 <span class="version-tag">{{ t('hub_tag') }}</span>
 </div>
 </div>
 <div class="header-right">
 <div class="lang-selector-pill">
 <button class="lang-choice" :class="{ active: currentLang === 'ro' }" @click="setLanguage('ro')">ro</button>
 <span class="lang-div">/</span>
 <button class="lang-choice" :class="{ active: currentLang === 'en' }" @click="setLanguage('en')">en</button>
 </div>

 <div class="search-box">
 <span class="search-icon"></span>
 <input v-model="searchQuery" type="text" :placeholder="t('search_placeholder')" />
 <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn"></button>
 </div>
 <a href="https://github.com/stefannut/OpenID-MITM-Phishing-Forensics" target="_blank" class="github-link">
 {{ t('repo_link') }}
 </a>
 </div>
 </header>

 <div class="wiki-body">
 <aside class="wiki-sidebar">
 <div class="sidebar-section">
 <h3>{{ t('dossiers_title') }}</h3>
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
 <h3>{{ t('intel_title') }}</h3>
 <ul class="nav-list">
 <li :class="{ active: activeTab === 'iocs' }" @click="activeTab = 'iocs'">
 <span class="nav-icon"></span>
 <span class="nav-title">{{ t('nav_iocs') }} ({{ iocs.length }})</span>
 </li>
 <li :class="{ active: activeTab === 'mitre' }" @click="activeTab = 'mitre'">
 <span class="nav-icon"></span>
 <span class="nav-title">{{ t('nav_mitre') }}</span>
 </li>
 </ul>
 </div>

 <div class="sidebar-footer">
 <p>{{ t('investigator') }} <strong>@stefannut</strong></p>
 <p>{{ t('classification') }}</p>
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
 <h2>{{ t('ioc_header_title') }}</h2>
 <p>{{ t('ioc_header_sub') }}</p>
 </div>
 <div class="ioc-table-wrapper">
 <table class="ioc-table">
 <thead>
 <tr>
 <th>{{ t('th_type') }}</th>
 <th>{{ t('th_indicator') }}</th>
 <th>{{ t('th_desc') }}</th>
 <th>{{ t('th_status') }}</th>
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
 <h2>{{ t('mitre_title') }}</h2>
 <p>{{ t('mitre_sub') }}</p>
 </div>
 <div class="mitre-grid">
 <div class="mitre-card">
 <span class="t-badge">T1566.002 / T1566.004</span>
 <h4>{{ t('t1_title') }}</h4>
 <p>{{ t('t1_desc') }}</p>
 </div>
 <div class="mitre-card">
 <span class="t-badge">T1557.001 / T1556</span>
 <h4>{{ t('t2_title') }}</h4>
 <p>{{ t('t2_desc') }}</p>
 </div>
 <div class="mitre-card">
 <span class="t-badge">T1098 / T1027</span>
 <h4>{{ t('t3_title') }}</h4>
 <p>{{ t('t3_desc') }}</p>
 </div>
 </div>
 </div>
 </main>
 </div>
 </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { marked } from 'marked';
import { articles, iocList } from './data/wikiData.js';
import { currentLang, setLanguage, t } from './i18n.js';

const activeTab = ref('docs');
const allArticles = ref(articles);
const iocs = ref(iocList);

function getDefaultArticle() {
 const matching = articles.find(a => a.id.toLowerCase().includes(currentLang.value));
 return matching || articles[0];
}

const selectedArticle = ref(getDefaultArticle());
const searchQuery = ref('');

watch(currentLang, () => {
 selectedArticle.value = getDefaultArticle();
});

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
.brand h1 { font-size: 18px; font-weight: 700; color: var(--text-primary); text-transform: lowercase; }
.version-tag { font-size: 11px; font-family: var(--font-mono); color: var(--accent-cyan); text-transform: lowercase; }
.header-right { display: flex; align-items: center; gap: 16px; }

.lang-selector-pill {
 display: flex;
 align-items: center;
 gap: 3px;
 background: var(--bg-primary);
 border: 1px solid var(--border-color);
 padding: 3px 8px;
 border-radius: 6px;
 font-family: var(--font-mono);
 font-size: 11px;
}

.lang-choice {
 background: transparent;
 border: none;
 color: var(--text-muted);
 font-family: inherit;
 font-size: 11px;
 cursor: pointer;
 padding: 1px 4px;
 border-radius: 3px;
 text-transform: lowercase;
}

.lang-choice.active {
 color: var(--text-primary);
 background: var(--accent-primary-light, #8e5e63);
 font-weight: 700;
}

.lang-div {
 color: var(--text-muted);
 opacity: 0.5;
}

.search-box { display: flex; align-items: center; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 6px 12px; gap: 8px; }
.search-box input { background: transparent; border: none; color: var(--text-primary); outline: none; font-size: 13px; width: 240px; text-transform: lowercase; }
.clear-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }
.github-link { font-size: 13px; font-weight: 600; color: var(--text-secondary); background: var(--bg-card); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color); text-transform: lowercase; }
.github-link:hover { color: var(--text-primary); border-color: var(--accent-cyan); text-decoration: none; }

.wiki-body { display: flex; flex: 1; overflow: hidden; }
.wiki-sidebar { width: 300px; background: var(--bg-secondary); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto; padding: 16px 0; }
.sidebar-section { padding: 0 16px; margin-bottom: 24px; }
.sidebar-section h3 { font-size: 11px; text-transform: lowercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 8px; }
.nav-list { list-style: none; }
.nav-list li { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; color: var(--text-secondary); margin-bottom: 4px; transition: all 0.15s ease; text-transform: lowercase; }
.nav-list li:hover { background: var(--bg-hover); color: var(--text-primary); }
.nav-list li.active { background: var(--bg-card); color: var(--accent-cyan); font-weight: 600; border-left: 3px solid var(--accent-cyan); }
.sidebar-footer { padding: 16px; border-top: 1px solid var(--border-color); font-size: 11px; color: var(--text-muted); }

.wiki-content { flex: 1; overflow-y: auto; padding: 32px 48px; background: var(--bg-primary); }
.article-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.badge { font-size: 11px; font-family: var(--font-mono); background: rgba(56, 189, 248, 0.1); color: var(--accent-cyan); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.3); text-transform: lowercase; }
.summary-text { font-size: 13px; color: var(--text-secondary); }

.iocs-view, .mitre-view { max-width: 1000px; }
.view-header { margin-bottom: 24px; }
.view-header h2 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; text-transform: lowercase; }
.view-header p { font-size: 13px; color: var(--text-muted); }

.ioc-table-wrapper { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
.ioc-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
.ioc-table th { background: var(--bg-card); padding: 12px 16px; font-size: 11px; text-transform: lowercase; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
.ioc-table td { padding: 12px 16px; border-bottom: 1px solid var(--border-color); color: var(--text-secondary); }
.ioc-table tr:last-child td { border-bottom: none; }
.type-pill { background: rgba(56, 189, 248, 0.1); color: var(--accent-cyan); font-family: var(--font-mono); font-size: 11px; padding: 2px 6px; border-radius: 4px; text-transform: lowercase; }
.status-badge { background: rgba(239, 68, 68, 0.1); color: #ef4444; font-size: 11px; padding: 2px 6px; border-radius: 4px; text-transform: lowercase; }

.mitre-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.mitre-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; }
.t-badge { display: inline-block; font-family: var(--font-mono); font-size: 11px; color: var(--accent-cyan); margin-bottom: 8px; font-weight: 600; }
.mitre-card h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; text-transform: lowercase; }
.mitre-card p { font-size: 12px; color: var(--text-secondary); line-height: 1.5; }
</style>
