<template>
  <div class="wiki-container">
    <!-- Header -->
    <header class="wiki-header">
      <div class="header-left">
        <div class="brand">
          <h1>homelab &amp; cyber wiki</h1>
          <span class="version-tag">iac &bull; self-hosted &bull; soc &amp; security ops</span>
        </div>
      </div>
      <div class="header-right">
        <div class="search-box">
          <svg class="search-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="search articles, services, vlans, tools..."
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">✕</button>
        </div>
        <a href="../" class="github-link dashboard-link">
          services dashboard
        </a>
        <a href="https://github.com/stefanutc1/homelab" target="_blank" class="github-link">
          github repo ↗
        </a>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="wiki-body">
      <!-- Sidebar -->
      <aside class="wiki-sidebar">
        <!-- Section 1: Homelab Infrastructure -->
        <div class="sidebar-section">
          <h3>homelab infrastructure</h3>
          <ul class="nav-list">
            <li
              v-for="article in filteredHomelabArticles"
              :key="article.id"
              :class="{ active: selectedArticle && selectedArticle.id === article.id && activeTab === 'docs' }"
              @click="selectArticle(article)"
            >
              <span class="nav-dot"></span>
              <span class="nav-title">{{ article.title }}</span>
            </li>
          </ul>
        </div>

        <!-- Section 2: Cyber Security Operations (NEW CATEGORY) -->
        <div class="sidebar-section">
          <h3>cyber security &amp; ops</h3>
          <ul class="nav-list">
            <li
              v-for="article in filteredCyberArticles"
              :key="article.id"
              :class="{ active: selectedArticle && selectedArticle.id === article.id && activeTab === 'docs' }"
              @click="selectArticle(article)"
            >
              <span class="nav-dot cyber-dot"></span>
              <span class="nav-title">{{ article.title }}</span>
            </li>
          </ul>
        </div>

        <!-- Section 3: Interactive Explorers -->
        <div class="sidebar-section">
          <h3>interactive tools</h3>
          <ul class="nav-list">
            <li
              :class="{ active: activeTab === 'services' }"
              @click="activeTab = 'services'"
            >
              <span class="nav-dot"></span>
              <span class="nav-title">services catalog ({{ services.length }})</span>
            </li>
            <li
              :class="{ active: activeTab === 'cybertools' }"
              @click="activeTab = 'cybertools'"
            >
              <span class="nav-dot cyber-dot"></span>
              <span class="nav-title">cyber security tools ({{ cyberTools.length }})</span>
            </li>
            <li
              :class="{ active: activeTab === 'topology' }"
              @click="activeTab = 'topology'"
            >
              <span class="nav-dot"></span>
              <span class="nav-title">vlan &amp; network matrix</span>
            </li>
          </ul>
        </div>

        <div class="sidebar-footer">
          <p>author: <strong>@stefanutc1</strong></p>
          <p>proxmox ve &bull; k3s &bull; soc / siem</p>
        </div>
      </aside>

      <!-- Content Area -->
      <main class="wiki-content">
        <!-- TAB 1: Markdown Documentation Reader -->
        <div v-if="activeTab === 'docs' && selectedArticle" class="article-view">
          <div class="article-meta">
            <span class="badge" :class="{ 'cyber-badge': selectedArticle.section === 'cyber' }">{{ selectedArticle.category }}</span>
            <span class="summary-text">{{ selectedArticle.summary }}</span>
          </div>
          <article class="markdown-body" v-html="renderedMarkdown"></article>
        </div>

        <!-- TAB 2: Interactive Homelab Services Catalog -->
        <div v-else-if="activeTab === 'services'" class="services-view">
          <div class="view-header">
            <h2>containerized services directory</h2>
            <p>real-time inventory of all docker compose services running on the homelab platform.</p>
            <div class="category-filters">
              <button
                v-for="cat in serviceCategories"
                :key="cat"
                :class="{ active: selectedCategory === cat }"
                @click="selectedCategory = cat"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <div class="services-grid">
            <div
              v-for="svc in filteredServices"
              :key="svc.name"
              class="service-card"
            >
              <div class="service-card-header">
                <div class="svc-logo-box">
                  <img v-if="svc.logo" :src="getLogoUrl(svc.logo)" :alt="svc.name" class="svc-logo-img" />
                  <span v-else class="svc-dot"></span>
                </div>
              </div>
              <h4>{{ svc.name }}</h4>
              <p class="svc-cat">{{ svc.category }}</p>
              <div class="svc-details">
                <div class="detail-row">
                  <span>domain (.lan):</span>
                  <a v-if="svc.domain" :href="svc.domainUrl" target="_blank" rel="noopener noreferrer" class="endpoint-link">
                    <code>{{ svc.domain }} ↗</code>
                  </a>
                </div>
                <div class="detail-row">
                  <span>direct ip:</span>
                  <a v-if="svc.ip" :href="svc.ipUrl" target="_blank" rel="noopener noreferrer" class="endpoint-link">
                    <code>{{ svc.ip }}:{{ svc.port }} ↗</code>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: Interactive Cyber Security Tools Matrix -->
        <div v-else-if="activeTab === 'cybertools'" class="services-view">
          <div class="view-header">
            <h2>cyber security &amp; soc arsenal</h2>
            <p>defensive siem/xdr stacks, network ids, offensive ctf tools, forensic collectors, and automated sast scanners.</p>
            <div class="category-filters">
              <button
                v-for="cat in cyberCategories"
                :key="cat"
                :class="{ active: selectedCyberCategory === cat }"
                @click="selectedCyberCategory = cat"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <div class="services-grid">
            <div
              v-for="tool in filteredCyberTools"
              :key="tool.name"
              class="service-card cyber-tool-card"
            >
              <div class="service-card-header">
                <div class="svc-logo-box">
                  <img v-if="tool.logo" :src="getLogoUrl(tool.logo)" :alt="tool.name" class="svc-logo-img" />
                  <span v-else class="svc-dot cyber-dot"></span>
                </div>
                <span class="status-pill" :class="tool.status">{{ tool.status }}</span>
              </div>
              <h4>{{ tool.name }}</h4>
              <p class="svc-cat">{{ tool.category }} &bull; {{ tool.type }}</p>
              <div class="svc-details">
                <div class="detail-row" v-if="tool.port > 0">
                  <span>port / protocol:</span>
                  <code>:{{ tool.port }}</code>
                </div>
                <div class="detail-row" v-else>
                  <span>execution mode:</span>
                  <code>cli / script harness</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 4: Network Topology & VLAN Matrix -->
        <div v-else-if="activeTab === 'topology'" class="topology-view">
          <div class="view-header">
            <h2>vlan &amp; network isolation matrix</h2>
            <p>granular layer-2 and layer-3 microsegmentation enforced via opnsense and proxmox virtual bridges.</p>
          </div>

          <div class="topology-grid">
            <div class="vlan-card vlan-1">
              <div class="vlan-tag">vlan 1</div>
              <h3>management zone</h3>
              <p><code>192.168.1.0/24</code> &bull; physical hypervisor &amp; ipmi</p>
              <ul>
                <li>proxmox ve host (pve.lan)</li>
                <li>managed l2/l3 network switches</li>
                <li>restricted to administrator mac address</li>
              </ul>
            </div>

            <div class="vlan-card vlan-10">
              <div class="vlan-tag">vlan 10</div>
              <h3>core infrastructure</h3>
              <p><code>192.168.10.0/24</code> &bull; ingress, dns, mesh vpn</p>
              <ul>
                <li>opnsense virtual router &amp; firewall</li>
                <li>nginx proxy manager (:80/:443/:81)</li>
                <li>authelia sso provider (:9091)</li>
                <li>pi-hole dns sinkhole (:53)</li>
              </ul>
            </div>

            <div class="vlan-card vlan-20">
              <div class="vlan-tag">vlan 20</div>
              <h3>application workloads</h3>
              <p><code>192.168.20.0/24</code> &bull; persistent application stacks</p>
              <ul>
                <li>immich, nextcloud, jellyfin</li>
                <li>prometheus, grafana, loki</li>
                <li>gitea, woodpecker ci, vaultwarden</li>
              </ul>
            </div>

            <div class="vlan-card vlan-30">
              <div class="vlan-tag">vlan 30</div>
              <h3>kubernetes cluster</h3>
              <p><code>192.168.30.0/24</code> &bull; k3s control plane &amp; workers</p>
              <ul>
                <li>k3s master &amp; worker nodes</li>
                <li>fluxcd gitops continuous engine</li>
                <li>pod overlay: <code>10.42.0.0/16</code></li>
              </ul>
            </div>

            <div class="vlan-card vlan-40">
              <div class="vlan-tag">vlan 40</div>
              <h3>iot &amp; edge nodes</h3>
              <p><code>192.168.40.0/24</code> &bull; esp32 &amp; home automation</p>
              <ul>
                <li>automated garden irrigation controller</li>
                <li>footprint occupancy sensor node</li>
                <li>home assistant mqtt gateway</li>
              </ul>
            </div>

            <div class="vlan-card vlan-cyber">
              <div class="vlan-tag cyber-tag">vlan 50 / cyberlab</div>
              <h3>soc &amp; offensive testbed</h3>
              <p><code>192.168.64.0/24</code> &bull; isolated security research</p>
              <ul>
                <li>wazuh xdr indexer &amp; dashboard (:1514/:443)</li>
                <li>suricata nids mirrored dmz inspection</li>
                <li>kali offensive &amp; windows 10 victim sandbox</li>
              </ul>
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
import { homelabArticles, cyberArticles, homelabServices, cyberlabTools } from './data/wikiData.js';

const activeTab = ref('docs');
const homelabDocs = ref(homelabArticles);
const cyberDocs = ref(cyberArticles);
const services = ref(homelabServices);
const cyberTools = ref(cyberlabTools);
const selectedArticle = ref(homelabArticles[0]);
const searchQuery = ref('');
const selectedCategory = ref('All');
const selectedCyberCategory = ref('All');

const selectArticle = (article) => {
  selectedArticle.value = article;
  activeTab.value = 'docs';
};

const filterList = (list) => {
  if (!searchQuery.value) return list;
  const q = searchQuery.value.toLowerCase();
  return list.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
  );
};

const filteredHomelabArticles = computed(() => filterList(homelabDocs.value));
const filteredCyberArticles = computed(() => filterList(cyberDocs.value));

const serviceCategories = computed(() => {
  const cats = new Set(services.value.map((s) => s.category));
  return ['All', ...Array.from(cats)];
});

const cyberCategories = computed(() => {
  const cats = new Set(cyberTools.value.map((s) => s.category));
  return ['All', ...Array.from(cats)];
});

const filteredServices = computed(() => {
  let list = services.value;
  if (selectedCategory.value !== 'All') {
    list = list.filter((s) => s.category === selectedCategory.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.domain && s.domain.toLowerCase().includes(q))
    );
  }
  return list;
});

const filteredCyberTools = computed(() => {
  let list = cyberTools.value;
  if (selectedCyberCategory.value !== 'All') {
    list = list.filter((t) => t.category === selectedCyberCategory.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q)
    );
  }
  return list;
});

const renderedMarkdown = computed(() => {
  if (!selectedArticle.value || !selectedArticle.value.content) return '';
  return marked.parse(selectedArticle.value.content);
});

const getLogoUrl = (path) => {
  return `${import.meta.env.BASE_URL}${path}`;
};
</script>

<style>
/* Modern Minimalist Terminal Aesthetic */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #0d1117;
  color: #c9d1d9;
  font-size: 14px;
  line-height: 1.6;
}

.wiki-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Header */
.wiki-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: #161b22;
  border-bottom: 1px solid #30363d;
}

.header-left .brand h1 {
  font-size: 16px;
  font-weight: 600;
  color: #f0f6fc;
  letter-spacing: -0.2px;
}

.version-tag {
  font-size: 11px;
  color: #8b949e;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-svg {
  position: absolute;
  left: 10px;
  width: 14px;
  height: 14px;
  color: #8b949e;
}

.search-box input {
  background-color: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 6px 28px 6px 32px;
  font-size: 13px;
  color: #c9d1d9;
  width: 260px;
  transition: all 0.2s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #58a6ff;
  width: 320px;
}

.clear-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #8b949e;
  cursor: pointer;
  font-size: 12px;
}

.github-link {
  color: #58a6ff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 10px;
  border: 1px solid #30363d;
  border-radius: 6px;
  background-color: #21262d;
  transition: background-color 0.2s;
}

.github-link:hover {
  background-color: #30363d;
}

.dashboard-link {
  color: #2ea043;
  border-color: #238636;
}

/* Body Workspace */
.wiki-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.wiki-sidebar {
  width: 280px;
  background-color: #0d1117;
  border-right: 1px solid #30363d;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 16px 0;
}

.sidebar-section {
  padding: 0 16px;
  margin-bottom: 20px;
}

.sidebar-section h3 {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #8b949e;
  margin-bottom: 8px;
  padding-left: 8px;
}

.nav-list {
  list-style: none;
}

.nav-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  color: #c9d1d9;
  font-size: 13px;
  transition: all 0.15s ease;
  user-select: none;
}

.nav-list li:hover {
  background-color: #161b22;
  color: #f0f6fc;
}

.nav-list li.active {
  background-color: #1f6feb22;
  color: #58a6ff;
  font-weight: 500;
}

.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #30363d;
  transition: background-color 0.2s;
}

.nav-dot.cyber-dot {
  background-color: #f78166;
}

.nav-list li.active .nav-dot {
  background-color: #58a6ff;
}

.nav-list li.active .nav-dot.cyber-dot {
  background-color: #ff7b72;
}

.sidebar-footer {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid #21262d;
  font-size: 11px;
  color: #8b949e;
}

/* Content Area */
.wiki-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px 48px;
  background-color: #0d1117;
}

/* Article View */
.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #21262d;
}

.badge {
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 600;
  padding: 2px 8px;
  background-color: #1f6feb22;
  color: #58a6ff;
  border: 1px solid #1f6feb44;
  border-radius: 12px;
  letter-spacing: 0.5px;
}

.badge.cyber-badge {
  background-color: #da363322;
  color: #f78166;
  border-color: #da363344;
}

.summary-text {
  font-size: 13px;
  color: #8b949e;
}

/* Markdown Styling */
.markdown-body {
  color: #c9d1d9;
  line-height: 1.7;
}

.markdown-body h1 {
  font-size: 24px;
  font-weight: 600;
  color: #f0f6fc;
  margin-bottom: 16px;
}

.markdown-body h2 {
  font-size: 18px;
  font-weight: 600;
  color: #f0f6fc;
  margin-top: 24px;
  margin-bottom: 12px;
  border-bottom: 1px solid #21262d;
  padding-bottom: 6px;
}

.markdown-body h3 {
  font-size: 15px;
  font-weight: 600;
  color: #f0f6fc;
  margin-top: 18px;
  margin-bottom: 8px;
}

.markdown-body p {
  margin-bottom: 14px;
}

.markdown-body ul, .markdown-body ol {
  margin-left: 20px;
  margin-bottom: 16px;
}

.markdown-body code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
  background-color: #161b22;
  border: 1px solid #30363d;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #79c0ff;
}

.markdown-body pre {
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.markdown-body pre code {
  background: none;
  border: none;
  padding: 0;
  color: #e6edf3;
}

.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.markdown-body th, .markdown-body td {
  border: 1px solid #30363d;
  padding: 8px 12px;
  text-align: left;
}

.markdown-body th {
  background-color: #161b22;
  color: #f0f6fc;
  font-weight: 600;
}

/* Services View */
.view-header {
  margin-bottom: 24px;
}

.view-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #f0f6fc;
}

.view-header p {
  font-size: 13px;
  color: #8b949e;
  margin-top: 4px;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.category-filters button {
  background-color: #161b22;
  border: 1px solid #30363d;
  color: #c9d1d9;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.category-filters button:hover {
  background-color: #21262d;
  border-color: #8b949e;
}

.category-filters button.active {
  background-color: #1f6feb;
  border-color: #1f6feb;
  color: #ffffff;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.service-card {
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.service-card:hover {
  border-color: #58a6ff;
  transform: translateY(-2px);
}

.cyber-tool-card:hover {
  border-color: #f78166;
}

.service-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.svc-logo-box {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
}

.svc-logo-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.svc-dot {
  width: 8px;
  height: 8px;
  background-color: #2ea043;
  border-radius: 50%;
}

.status-pill {
  font-size: 10px;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
}

.status-pill.active {
  background-color: #2ea04322;
  color: #3fb950;
  border: 1px solid #2ea04344;
}

.status-pill.ready {
  background-color: #388bfd22;
  color: #58a6ff;
  border: 1px solid #388bfd44;
}

.service-card h4 {
  font-size: 14px;
  color: #f0f6fc;
  margin-bottom: 4px;
}

.svc-cat {
  font-size: 11px;
  color: #8b949e;
  margin-bottom: 12px;
  text-transform: capitalize;
}

.svc-details {
  border-top: 1px solid #21262d;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.detail-row span {
  color: #8b949e;
}

.endpoint-link {
  text-decoration: none;
}

/* Topology View */
.topology-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.vlan-card {
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 20px;
  position: relative;
}

.vlan-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: #30363d;
  color: #f0f6fc;
  margin-bottom: 10px;
}

.vlan-tag.cyber-tag {
  background-color: #da363344;
  color: #f78166;
  border: 1px solid #da363366;
}

.vlan-card h3 {
  font-size: 15px;
  color: #f0f6fc;
  margin-bottom: 4px;
}

.vlan-card p {
  font-size: 12px;
  color: #8b949e;
  margin-bottom: 14px;
}

.vlan-card ul {
  list-style: none;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vlan-card ul li {
  color: #c9d1d9;
  display: flex;
  align-items: center;
  gap: 6px;
}

.vlan-card ul li::before {
  content: "•";
  color: #58a6ff;
}

.vlan-cyber ul li::before {
  color: #f78166;
}
</style>
