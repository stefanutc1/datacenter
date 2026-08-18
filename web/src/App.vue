<template>
  <div class="wiki-container">
    <!-- Header -->
    <header class="wiki-header">
      <div class="header-left">
        <span class="logo-icon">🏠</span>
        <div class="brand">
          <h1>Homelab Wiki</h1>
          <span class="version-tag">v2.4.0 · IaC & Self-Hosted</span>
        </div>
      </div>
      <div class="header-right">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search articles, services, VLANs..."
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">✕</button>
        </div>
        <a href="../" class="github-link" style="background: rgba(99, 102, 241, 0.2); border-color: rgba(99, 102, 241, 0.4); color: #818cf8;">
          🏠 Services Dashboard
        </a>
        <a href="https://github.com/stefannut/homelab" target="_blank" class="github-link">
          GitHub Repo ↗
        </a>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="wiki-body">
      <!-- Sidebar -->
      <aside class="wiki-sidebar">
        <!-- Navigation Categories -->
        <div class="sidebar-section">
          <h3>Documentation</h3>
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

        <!-- Services Explorer Tab Button -->
        <div class="sidebar-section">
          <h3>Interactive Tools</h3>
          <ul class="nav-list">
            <li
              :class="{ active: activeTab === 'services' }"
              @click="activeTab = 'services'"
            >
              <span class="nav-icon">📦</span>
              <span class="nav-title">Services Catalog ({{ services.length }})</span>
            </li>
            <li
              :class="{ active: activeTab === 'topology' }"
              @click="activeTab = 'topology'"
            >
              <span class="nav-icon">🗺️</span>
              <span class="nav-title">VLAN & Network Matrix</span>
            </li>
          </ul>
        </div>

        <div class="sidebar-footer">
          <p>Author: <strong>@stefannut</strong></p>
          <p>Proxmox VE · k3s · Ansible</p>
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
            <h2>📦 Containerized Services Directory</h2>
            <p>Real-time inventory of all 30+ Docker Compose services running on the homelab platform.</p>
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
                <span class="svc-icon">{{ svc.icon }}</span>
                <span class="svc-status" :class="svc.status.toLowerCase()">{{ svc.status }}</span>
              </div>
              <h4>{{ svc.name }}</h4>
              <p class="svc-cat">{{ svc.category }}</p>
              <div class="svc-details">
                <div class="detail-row">
                  <span>Port:</span>
                  <code>:{{ svc.port }}</code>
                </div>
                <div class="detail-row">
                  <span>Domain:</span>
                  <code>{{ svc.domain }}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: Network Topology & VLAN Matrix -->
        <div v-else-if="activeTab === 'topology'" class="topology-view">
          <div class="view-header">
            <h2>🗺️ VLAN & Network Isolation Matrix</h2>
            <p>Granular layer-2 and layer-3 microsegmentation enforced via OPNsense and Proxmox virtual bridges.</p>
          </div>

          <div class="topology-grid">
            <div class="vlan-card vlan-1">
              <div class="vlan-tag">VLAN 1</div>
              <h3>Management Zone</h3>
              <p><code>192.168.1.0/24</code> · Physical Hypervisor & IPMI</p>
              <ul>
                <li>Proxmox VE Host (pve.homelab.local)</li>
                <li>Managed L2/L3 Network Switches</li>
                <li>Restricted to Administrator MAC Address</li>
              </ul>
            </div>

            <div class="vlan-card vlan-10">
              <div class="vlan-tag">VLAN 10</div>
              <h3>Core Infrastructure</h3>
              <p><code>192.168.10.0/24</code> · Ingress, DNS, Mesh VPN</p>
              <ul>
                <li>OPNsense Virtual Router & Firewall</li>
                <li>Nginx Proxy Manager (:80/:443/:81)</li>
                <li>Authelia SSO Provider (:9091)</li>
                <li>Pi-hole DNS Sinkhole (:53)</li>
              </ul>
            </div>

            <div class="vlan-card vlan-20">
              <div class="vlan-tag">VLAN 20</div>
              <h3>Application Workloads</h3>
              <p><code>192.168.20.0/24</code> · Persistent Application Stacks</p>
              <ul>
                <li>Immich, Nextcloud, AList, FileBrowser</li>
                <li>Prometheus, Grafana, Alertmanager</li>
                <li>Gitea, Woodpecker CI, Vaultwarden</li>
              </ul>
            </div>

            <div class="vlan-card vlan-30">
              <div class="vlan-tag">VLAN 30</div>
              <h3>Kubernetes Cluster</h3>
              <p><code>192.168.30.0/24</code> · k3s Control Plane & Workers</p>
              <ul>
                <li>k3s Master & Worker Nodes</li>
                <li>FluxCD GitOps Continuous Engine</li>
                <li>Pod Overlay: <code>10.42.0.0/16</code></li>
              </ul>
            </div>

            <div class="vlan-card vlan-40">
              <div class="vlan-tag">VLAN 40</div>
              <h3>IoT & Edge Nodes</h3>
              <p><code>192.168.40.0/24</code> · ESP32 & Home Automation</p>
              <ul>
                <li>Automated Garden Irrigation Controller</li>
                <li>Footprint Occupancy Sensor Node</li>
                <li>Home Assistant MQTT Gateway</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { marked } from 'marked';
import { homelabArticles, homelabServices } from './data/wikiData.js';

const activeTab = ref('docs');
const articles = ref(homelabArticles);
const services = ref(homelabServices);
const selectedArticle = ref(homelabArticles[0]);
const searchQuery = ref('');
const selectedCategory = ref('All');

const serviceCategories = ['All', 'Ingress', 'Networking', 'Observability', 'Storage & Media', 'Automation', 'DevOps', 'Productivity', 'Utilities'];

const filteredArticles = computed(() => {
  if (!searchQuery.value) return articles.value;
  const q = searchQuery.value.toLowerCase();
  return articles.value.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.summary.toLowerCase().includes(q) ||
    a.content.toLowerCase().includes(q)
  );
});

const filteredServices = computed(() => {
  let list = services.value;
  if (selectedCategory.value !== 'All') {
    list = list.filter(s => s.category === selectedCategory.value);
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.domain.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  }
  return list;
});

const renderedMarkdown = computed(() => {
  if (!selectedArticle.value) return '';
  return marked.parse(selectedArticle.value.content);
});

function selectArticle(article) {
  selectedArticle.value = article;
  activeTab.value = 'docs';
}
</script>

<style scoped>
.wiki-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.wiki-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
}

.brand h1 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.version-tag {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--accent-blue);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 6px 12px;
  gap: 8px;
}

.search-box input {
  background: transparent;
  border: none;
  color: var(--text-primary);
  outline: none;
  font-size: 13px;
  width: 240px;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}

.github-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-card);
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.github-link:hover {
  color: var(--text-primary);
  border-color: var(--accent-blue);
  text-decoration: none;
}

.wiki-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.wiki-sidebar {
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  padding: 16px 0;
}

.sidebar-section {
  padding: 0 16px;
  margin-bottom: 24px;
}

.sidebar-section h3 {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.nav-list {
  list-style: none;
}

.nav-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  transition: all 0.15s ease;
}

.nav-list li:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-list li.active {
  background: var(--bg-card);
  color: var(--accent-blue);
  font-weight: 600;
  border-left: 3px solid var(--accent-blue);
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  font-size: 11px;
  color: var(--text-muted);
}

.wiki-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px 48px;
  background: var(--bg-primary);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.badge {
  font-size: 11px;
  font-family: var(--font-mono);
  background: rgba(56, 189, 248, 0.1);
  color: var(--accent-blue);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.summary-text {
  font-size: 13px;
  color: var(--text-muted);
}

/* Markdown Rendering */
.markdown-body :deep(h1) {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
}

.markdown-body :deep(h2) {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 12px;
}

.markdown-body :deep(h3) {
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 8px;
}

.markdown-body :deep(p) {
  margin-bottom: 14px;
  color: var(--text-secondary);
}

.markdown-body :deep(ul), .markdown-body :deep(ol) {
  margin: 0 0 16px 24px;
  color: var(--text-secondary);
}

.markdown-body :deep(li) {
  margin-bottom: 4px;
}

.markdown-body :deep(pre) {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
  color: #e2e8f0;
}

.markdown-body :deep(code) {
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--accent-blue);
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.markdown-body :deep(th), .markdown-body :deep(td) {
  border: 1px solid var(--border-color);
  padding: 8px 12px;
  text-align: left;
  font-size: 13px;
}

.markdown-body :deep(th) {
  background: var(--bg-secondary);
}

/* Services View */
.view-header {
  margin-bottom: 24px;
}

.view-header h2 {
  font-size: 24px;
  margin-bottom: 6px;
}

.view-header p {
  color: var(--text-muted);
  font-size: 14px;
}

.category-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.category-filters button {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.category-filters button.active, .category-filters button:hover {
  background: var(--accent-blue);
  color: #000;
  font-weight: 600;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.service-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.15s, border-color 0.15s;
}

.service-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-blue);
}

.service-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.svc-icon {
  font-size: 24px;
}

.svc-status {
  font-size: 10px;
  font-family: var(--font-mono);
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.svc-status.active {
  background: rgba(52, 211, 153, 0.1);
  color: var(--accent-green);
  border: 1px solid rgba(52, 211, 153, 0.3);
}

.service-card h4 {
  font-size: 15px;
  margin-bottom: 2px;
}

.svc-cat {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.svc-details {
  border-top: 1px solid var(--border-color);
  padding-top: 8px;
  font-size: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

/* Topology View */
.topology-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.vlan-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
}

.vlan-tag {
  display: inline-block;
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 700;
  background: rgba(56, 189, 248, 0.1);
  color: var(--accent-blue);
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.vlan-card h3 {
  font-size: 16px;
  margin-bottom: 4px;
}

.vlan-card p {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.vlan-card ul {
  list-style: disc;
  margin-left: 20px;
  font-size: 12px;
  color: var(--text-secondary);
}

.vlan-card li {
  margin-bottom: 4px;
}
</style>
