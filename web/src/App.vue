<template>
  <div class="wiki-container">
    <!-- Header -->
    <header class="wiki-header">
      <div class="header-left">
        <div class="brand">
          <h1>homelab wiki</h1>
          <span class="version-tag">iac &amp; self-hosted architecture</span>
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
            placeholder="search articles, services, vlans..."
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">✕</button>
        </div>
        <a href="../" class="github-link dashboard-link">
          services dashboard
        </a>
        <a href="https://github.com/stefannut/homelab" target="_blank" class="github-link">
          github repo ↗
        </a>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="wiki-body">
      <!-- Sidebar -->
      <aside class="wiki-sidebar">
        <!-- Navigation Categories -->
        <div class="sidebar-section">
          <h3>documentation</h3>
          <ul class="nav-list">
            <li
              v-for="article in filteredArticles"
              :key="article.id"
              :class="{ active: selectedArticle && selectedArticle.id === article.id && activeTab === 'docs' }"
              @click="selectArticle(article)"
            >
              <span class="nav-dot"></span>
              <span class="nav-title">{{ article.title }}</span>
            </li>
          </ul>
        </div>

        <!-- Services Explorer Tab Button -->
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
              :class="{ active: activeTab === 'topology' }"
              @click="activeTab = 'topology'"
            >
              <span class="nav-dot"></span>
              <span class="nav-title">vlan &amp; network matrix</span>
            </li>
          </ul>
        </div>

        <div class="sidebar-footer">
          <p>author: <strong>@stefannut</strong></p>
          <p>proxmox ve &bull; k3s &bull; ansible</p>
        </div>
      </aside>

      <!-- Content Area -->
      <main class="wiki-content">
        <!-- TAB 1: Markdown Documentation Reader -->
        <div v-if="activeTab === 'docs' && selectedArticle" class="article-view">
          <div class="article-meta">
            <span class="badge">{{ selectedArticle.category }}</span>
            <span class="summary-text">{{ selectedArticle.summary }}</span>
          </div>
          <article class="markdown-body" v-html="renderedMarkdown"></article>
        </div>

        <!-- TAB 2: Interactive Services Catalog -->
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

        <!-- TAB 3: Network Topology & VLAN Matrix -->
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
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { marked } from 'marked';
import { homelabArticles, homelabServices } from './data/wikiData.js';

const activeTab = ref('docs');
const articles = ref(homelabArticles);
const services = ref(homelabServices);
const selectedArticle = ref(homelabArticles[0]);
const searchQuery = ref('');
const selectedCategory = ref('All');

const selectArticle = (article) => {
  selectedArticle.value = article;
  activeTab.value = 'docs';
};

const filteredArticles = computed(() => {
  if (!searchQuery.value) return articles.value;
  const q = searchQuery.value.toLowerCase();
  return articles.value.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
  );
});

const serviceCategories = computed(() => {
  const cats = new Set(services.value.map((s) => s.category));
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
        (s.domain && s.domain.toLowerCase().includes(q)) ||
        (s.ip && s.ip.includes(q))
    );
  }
  return list;
});

const renderedMarkdown = computed(() => {
  if (!selectedArticle.value) return '';
  return marked.parse(selectedArticle.value.content || '');
});

function getLogoUrl(logo) {
  if (!logo) return '';
  if (logo.startsWith('http')) return logo;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${base}/${logo.replace(/^\//, '')}`;
}
</script>

<style scoped>
.wiki-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.wiki-header {
  height: 64px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(12px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand h1 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-transform: lowercase;
}

.version-tag {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-svg {
  position: absolute;
  left: 0.75rem;
  width: 14px;
  height: 14px;
  color: var(--text-muted);
}

.search-box input {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 0.4rem 1.75rem 0.4rem 2.2rem;
  color: var(--text-primary);
  font-size: 0.8rem;
  width: 260px;
  outline: none;
  transition: all 0.2s ease;
}

.search-box input:focus {
  border-color: #8e5e63;
  box-shadow: 0 0 10px rgba(142, 94, 99, 0.35);
}

.clear-btn {
  position: absolute;
  right: 0.6rem;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.github-link {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  background: var(--bg-surface);
  text-transform: lowercase;
}

.github-link:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.dashboard-link {
  background: #3e2a2c;
  color: #f5ecec;
  border-color: rgba(214, 182, 186, 0.25);
}

.wiki-body {
  display: flex;
  flex: 1;
}

.wiki-sidebar {
  width: 270px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  gap: 1.5rem;
  height: calc(100vh - 64px);
  position: sticky;
  top: 64px;
  overflow-y: auto;
}

.sidebar-section h3 {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.6rem;
  text-transform: lowercase;
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-list li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.65rem;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.825rem;
  transition: all 0.15s ease;
  text-transform: lowercase;
}

.nav-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--text-muted);
  flex-shrink: 0;
}

.nav-list li:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-list li.active {
  background: #3e2a2c;
  color: #f5ecec;
  font-weight: 500;
  border: 1px solid rgba(214, 182, 186, 0.2);
}

.nav-list li.active .nav-dot {
  background: #c89b9e;
}

.sidebar-footer {
  margin-top: auto;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.wiki-content {
  flex: 1;
  padding: 2.5rem;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.badge {
  background: #3e2a2c;
  color: #f5ecec;
  border: 1px solid rgba(214, 182, 186, 0.2);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: lowercase;
}

.summary-text {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

:deep(.markdown-body) {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
}

:deep(.markdown-body h1) {
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  text-transform: lowercase;
}

:deep(.markdown-body h2) {
  font-size: 1.3rem;
  color: var(--text-primary);
  margin: 1.75rem 0 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.35rem;
  text-transform: lowercase;
}

:deep(.markdown-body h3) {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 1.25rem 0 0.5rem 0;
  text-transform: lowercase;
}

:deep(.markdown-body p) {
  margin-bottom: 1rem;
  text-transform: lowercase;
}

:deep(.markdown-body ul), :deep(.markdown-body ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  text-transform: lowercase;
}

:deep(.markdown-body li) {
  margin-bottom: 0.35rem;
}

:deep(.markdown-body table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.25rem 0;
  font-size: 0.85rem;
}

:deep(.markdown-body th), :deep(.markdown-body td) {
  border: 1px solid var(--border-color);
  padding: 0.6rem 0.85rem;
  text-align: left;
  text-transform: lowercase;
}

:deep(.markdown-body th) {
  background: var(--bg-surface);
  color: var(--text-primary);
  font-weight: 600;
}

:deep(.markdown-body pre) {
  background: #0e0a0b;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1.25rem 0;
}

:deep(.markdown-body code) {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: rgba(62, 42, 44, 0.4);
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  color: var(--accent-cyan);
}

:deep(.markdown-body pre code) {
  background: transparent;
  padding: 0;
  color: var(--text-primary);
}

/* Services View */
.view-header {
  margin-bottom: 2rem;
}

.view-header h2 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
  text-transform: lowercase;
}

.view-header p {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.category-filters {
  display: flex;
  gap: 0.4rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.category-filters button {
  font-size: 0.75rem;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  text-transform: lowercase;
}

.category-filters button.active {
  background: #3e2a2c;
  color: #f5ecec;
  border-color: rgba(214, 182, 186, 0.3);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.service-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 1.15rem;
}

.service-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.svc-logo-box {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(62, 42, 44, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.svc-logo-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.svc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-cyan);
}

.service-card h4 {
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 0.15rem;
  text-transform: lowercase;
}

.svc-cat {
  font-size: 0.725rem;
  color: var(--text-muted);
  margin-bottom: 0.85rem;
  text-transform: lowercase;
}

.svc-details {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  border-top: 1px solid var(--border-color);
  padding-top: 0.75rem;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.endpoint-link {
  color: var(--accent-cyan);
  text-transform: lowercase;
}

/* Topology View */
.topology-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.vlan-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 1.25rem;
}

.vlan-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--accent-cyan);
  margin-bottom: 0.5rem;
  text-transform: lowercase;
}

.vlan-card h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  text-transform: lowercase;
}

.vlan-card p {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  text-transform: lowercase;
}

.vlan-card ul {
  padding-left: 1.2rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-transform: lowercase;
}

.vlan-card li {
  margin-bottom: 0.25rem;
}

@media (max-width: 768px) {
  .wiki-body {
    flex-direction: column;
  }
  .wiki-sidebar {
    width: 100%;
    height: auto;
    position: static;
  }
}
</style>
