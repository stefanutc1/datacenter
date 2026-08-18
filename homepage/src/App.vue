<template>
  <div class="app-layout" :data-theme="currentTheme">
    <!-- Navigation Bar -->
    <header class="top-nav glass-panel">
      <div class="nav-container">
        <div class="brand-section">
          <div class="brand-logo anim-glow">
            <svg class="svg-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <div>
            <div class="brand-title-row">
              <h1 class="brand-title">HOMELAB PORTAL</h1>
              <span class="cluster-status-pill">
                <span class="status-dot"></span>
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
            <p class="brand-subtitle">Proxmox VE &bull; OpenMediaVault &bull; Apple M1 ARM64 &bull; Service Catalog</p>
          </div>
        </div>

        <!-- Global Search Bar -->
        <div class="search-container">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search services, ports (:8080), tags, containers..." 
            class="search-input"
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">&times;</button>
        </div>

        <!-- Navigation Tabs & Theme Toggle -->
        <div class="nav-right">
          <nav class="view-tabs">
            <button 
              class="view-tab-btn" 
              :class="{ active: currentView === 'dashboard' }" 
              @click="currentView = 'dashboard'"
            >
              <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              Services
            </button>
            <button 
              class="view-tab-btn" 
              :class="{ active: currentView === 'hardware' }" 
              @click="currentView = 'hardware'"
            >
              <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
              Hardware Nodes
            </button>
            <button 
              class="view-tab-btn" 
              :class="{ active: currentView === 'wiki' }" 
              @click="currentView = 'wiki'"
            >
              <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Wiki Catalog
            </button>
            <button 
              class="view-tab-btn" 
              :class="{ active: currentView === 'topology' }" 
              @click="currentView = 'topology'"
            >
              <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
              Topology
            </button>
            <button 
              class="view-tab-btn" 
              :class="{ active: currentView === 'ports' }" 
              @click="currentView = 'ports'"
            >
              <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              Port Matrix
            </button>
            <a 
              href="./wiki/" 
              class="view-tab-btn nav-link-external" 
              title="Open Markdown Knowledge Base & Runbooks"
            >
              <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              Full Docs Wiki ↗
            </a>
          </nav>

          <button class="theme-toggle" @click="toggleTheme" title="Toggle Theme">
            <svg v-if="currentTheme === 'dark'" class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            <svg v-else class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="main-content">
      <!-- Quick Status Overview Banner (Accurate Hardware Specs) -->
      <section class="stats-banner glass-panel fade-in">
        <div class="stat-card">
          <div class="stat-icon-wrapper text-indigo">
            <svg class="svg-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
          </div>
          <div>
            <div class="stat-number">3 Nodes</div>
            <div class="stat-label">Physical Hosts (i3 · Celeron · M1)</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper text-cyan">
            <svg class="svg-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          </div>
          <div>
            <div class="stat-number">{{ uniquePortsCount }} Ports</div>
            <div class="stat-label">{{ servicesList.length }} Microservices Online</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper text-emerald">
            <svg class="svg-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
          </div>
          <div>
            <div class="stat-number">GTX 1050 Ti</div>
            <div class="stat-label">4GB VRAM · PyTorch / Frigate</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper text-purple">
            <svg class="svg-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div>
            <div class="stat-number">512G + 500G</div>
            <div class="stat-label">SSD Tier + OMV Storage</div>
          </div>
        </div>
      </section>

      <!-- View 1: Services Dashboard -->
      <div v-if="currentView === 'dashboard'" class="dashboard-view fade-in">
        <!-- Category Filter Pills -->
        <div class="category-filters">
          <button 
            v-for="cat in categoriesList" 
            :key="cat.id" 
            class="cat-pill-btn" 
            :class="{ active: selectedCategory === cat.id }"
            @click="selectedCategory = cat.id"
          >
            <span>{{ cat.name }}</span>
            <span class="cat-count">{{ getCategoryCount(cat.id) }}</span>
          </button>
        </div>

        <!-- Pinned Favorites Section -->
        <section v-if="favoriteServices.length > 0 && selectedCategory === 'all' && !searchQuery" class="favorites-section">
          <div class="section-title-row">
            <h2 class="sub-heading">
              <svg class="svg-icon-xs text-warning" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Pinned Favorites
            </h2>
            <span class="sub-desc">{{ favoriteServices.length }} pinned services</span>
          </div>

          <div class="services-grid">
            <ServiceCard 
              v-for="svc in favoriteServices" 
              :key="'fav-' + svc.id" 
              :service="svc" 
              :is-favorite="true"
              :categories="categoriesList"
              @select="openServiceModal"
              @toggle-fav="toggleFavorite"
            />
          </div>
        </section>

        <!-- All Services Grid -->
        <section class="all-services-section">
          <div class="section-title-row">
            <h2 class="sub-heading">
              <span>{{ currentCategoryName }}</span>
            </h2>
            <span class="sub-desc">Showing {{ filteredServices.length }} service(s)</span>
          </div>

          <div v-if="filteredServices.length > 0" class="services-grid">
            <ServiceCard 
              v-for="svc in filteredServices" 
              :key="svc.id" 
              :service="svc" 
              :is-favorite="favorites.includes(svc.id)"
              :categories="categoriesList"
              @select="openServiceModal"
              @toggle-fav="toggleFavorite"
            />
          </div>

          <!-- Empty Search State -->
          <div v-else class="empty-search-state glass-panel">
            <svg class="svg-icon-lg text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <h3>No matching homelab services found</h3>
            <p>Try searching for a different keyword, port number, or clear your category filter.</p>
            <button class="btn-primary" @click="resetFilters">Reset Filters</button>
          </div>
        </section>
      </div>

      <!-- View 2: Hardware Nodes View -->
      <HardwareView v-else-if="currentView === 'hardware'" />

      <!-- View 3: Wiki Catalog -->
      <div v-else-if="currentView === 'wiki'" class="wiki-catalog-view fade-in">
        <div class="wiki-layout">
          <aside class="wiki-sidebar glass-panel">
            <h3 class="wiki-sidebar-title">Service Documentation</h3>
            <div class="wiki-sidebar-list">
              <button 
                v-for="svc in servicesList" 
                :key="'wiki-side-' + svc.id"
                class="wiki-side-item"
                :class="{ active: selectedWikiService?.id === svc.id }"
                @click="selectedWikiService = svc"
              >
                <span class="wiki-dot" :style="{ backgroundColor: svc.color }"></span>
                <span class="wiki-name text-ellipsis">{{ svc.name }}</span>
                <span class="wiki-port">:{{ svc.port }}</span>
              </button>
            </div>
          </aside>

          <article class="wiki-article glass-panel" v-if="selectedWikiService">
            <div class="wiki-article-header">
              <div>
                <h2 class="wiki-article-title">{{ selectedWikiService.name }}</h2>
                <p class="wiki-article-meta">Category: <span class="capitalize">{{ selectedWikiService.category }}</span> &bull; Container: <code>{{ selectedWikiService.containerName }}</code></p>
              </div>
              <a :href="selectedWikiService.internalUrl" target="_blank" rel="noopener noreferrer" class="btn-primary">
                Launch UI
              </a>
            </div>

            <div class="wiki-section">
              <h3>Overview</h3>
              <p>{{ selectedWikiService.description }}</p>
            </div>

            <div class="wiki-section">
              <h3>Features &amp; Capabilities</h3>
              <ul class="wiki-bullet-list">
                <li v-for="(feat, idx) in selectedWikiService.features" :key="idx">{{ feat }}</li>
              </ul>
            </div>

            <div class="wiki-section">
              <h3>Docker Compose Manifest</h3>
              <pre><code>{{ selectedWikiService.composeCode }}</code></pre>
            </div>

            <div class="wiki-section">
              <h3>Architecture &amp; Security Runbook</h3>
              <pre class="wiki-text">{{ selectedWikiService.wikiMarkdown }}</pre>
            </div>
          </article>
        </div>
      </div>

      <!-- View 4: Network Topology -->
      <TopologyView v-else-if="currentView === 'topology'" />

      <!-- View 5: Port Matrix -->
      <PortMatrix 
        v-else-if="currentView === 'ports'" 
        :services="servicesList" 
        @select="openServiceModal"
      />
    </main>

    <!-- Footer with Real Hardware Specs from hardware.md -->
    <footer class="app-footer glass-panel">
      <div class="footer-content">
        <div>
          <span class="footer-brand">Homelab Operations</span> &bull; 
          <span class="footer-info">Proxmox VE 9.2 (i3-10100F / GTX 1050 Ti) &bull; OMV (Celeron N2830) &bull; Proxmox2 (Apple M1)</span>
        </div>
        <div class="footer-links">
          <span>Storage: 512GB SSD + 500GB HDD</span>
          <span>&bull;</span>
          <span>Mesh: Tailscale WireGuard</span>
          <span>&bull;</span>
          <span>DNS: Pi-hole</span>
        </div>
      </div>
    </footer>

    <!-- Service Wiki Modal -->
    <ServiceModal 
      v-if="activeModalService" 
      :service="activeModalService" 
      @close="activeModalService = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { services as servicesList, categories as categoriesList } from './data/services.js';
import ServiceCard from './components/ServiceCard.vue';
import ServiceModal from './components/ServiceModal.vue';
import HardwareView from './components/HardwareView.vue';
import TopologyView from './components/TopologyView.vue';
import PortMatrix from './components/PortMatrix.vue';

const currentView = ref('dashboard');
const selectedCategory = ref('all');
const searchQuery = ref('');
const activeModalService = ref(null);
const selectedWikiService = ref(servicesList[0]);
const currentTheme = ref('dark');
const favorites = ref(['homeassistant', 'immich', 'vaultwarden', 'grafana', 'frigate']);

onMounted(() => {
  const savedTheme = localStorage.getItem('homelab-theme');
  if (savedTheme) {
    currentTheme.value = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  const savedFavs = localStorage.getItem('homelab-favs');
  if (savedFavs) {
    try {
      favorites.value = JSON.parse(savedFavs);
    } catch (e) {}
  }
});

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme.value);
  localStorage.setItem('homelab-theme', currentTheme.value);
};

const toggleFavorite = (serviceId) => {
  if (favorites.value.includes(serviceId)) {
    favorites.value = favorites.value.filter(id => id !== serviceId);
  } else {
    favorites.value.push(serviceId);
  }
  localStorage.setItem('homelab-favs', JSON.stringify(favorites.value));
};

const openServiceModal = (svc) => {
  activeModalService.value = svc;
};

const getCategoryCount = (catId) => {
  if (catId === 'all') return servicesList.length;
  return servicesList.filter(s => s.category === catId).length;
};

const currentCategoryName = computed(() => {
  if (selectedCategory.value === 'all') return 'All Services Catalog';
  const match = categoriesList.find(c => c.id === selectedCategory.value);
  return match ? `${match.name} Services` : 'Services';
});

const uniquePortsCount = computed(() => {
  const ports = new Set(servicesList.map(s => s.port));
  return ports.size;
});

const favoriteServices = computed(() => {
  return servicesList.filter(s => favorites.value.includes(s.id));
});

const filteredServices = computed(() => {
  let list = servicesList;
  if (selectedCategory.value !== 'all') {
    list = list.filter(s => s.category === selectedCategory.value);
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.containerName.toLowerCase().includes(q) ||
      s.port.toString().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  return list;
});

const resetFilters = () => {
  selectedCategory.value = 'all';
  searchQuery.value = '';
};
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Top Navigation Bar */
.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-top: none;
  padding: 0.75rem 2rem;
}

.nav-container {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.brand-logo {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 0 16px rgba(99, 102, 241, 0.45);
  transition: transform 0.25s ease;
}

.brand-logo:hover {
  transform: scale(1.08) rotate(2deg);
}

.svg-logo {
  width: 24px;
  height: 24px;
}

.brand-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-title {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cluster-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent-emerald);
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.2);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-emerald);
  box-shadow: 0 0 8px var(--accent-emerald);
  animation: pulseGlow 2s infinite ease-in-out;
}

.brand-subtitle {
  font-size: 0.78rem;
  color: var(--text-muted);
}

/* Search Bar */
.search-container {
  flex: 1;
  max-width: 440px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  padding: 0.55rem 2.2rem 0.55rem 2.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.85rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.3);
  transform: scale(1.01);
}

.search-clear {
  position: absolute;
  right: 0.75rem;
  color: var(--text-muted);
  font-size: 1.2rem;
  line-height: 1;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.view-tabs {
  display: flex;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.25rem;
  gap: 0.25rem;
}

.view-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.18s ease;
  text-decoration: none;
}

.view-tab-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.04);
}

.view-tab-btn.active {
  background: var(--accent-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.theme-toggle {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  border-color: var(--border-color-hover);
  background: var(--bg-card-hover);
  transform: rotate(15deg);
}

/* Main Content */
.main-content {
  flex: 1;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 1.75rem 2rem;
}

/* Stats Banner */
.stats-banner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  padding: 1.25rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon-wrapper {
  width: 46px;
  height: 46px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.1);
}

.stat-number {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.775rem;
  color: var(--text-muted);
}

.text-indigo { color: #818cf8; }
.text-cyan { color: #22d3ee; }
.text-emerald { color: #34d399; }
.text-purple { color: #c084fc; }
.text-warning { color: #fbbf24; }

/* Categories */
.category-filters {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.cat-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: inset 0 1px 0 var(--border-specular), var(--shadow-sm);
}

.cat-pill-btn:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-color-hover);
  color: var(--text-primary);
  transform: translateY(-2px);
  box-shadow: inset 0 1px 0 var(--border-specular), 0 8px 16px -4px rgba(0, 0, 0, 0.4), var(--shadow-glow);
}

.cat-pill-btn.active {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover));
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  box-shadow: 0 0 18px rgba(99, 102, 241, 0.45);
  transform: translateY(-2px);
}

.cat-count {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.sub-heading {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sub-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.favorites-section {
  margin-bottom: 2.5rem;
}

.all-services-section {
  margin-bottom: 2rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

/* Empty Search */
.empty-search-state {
  padding: 3rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.empty-search-state h3 {
  font-size: 1.15rem;
  color: var(--text-primary);
}

.empty-search-state p {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

/* Wiki Catalog View */
.wiki-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.5rem;
  min-height: 600px;
}

.wiki-sidebar {
  padding: 1.25rem;
  max-height: 750px;
  overflow-y: auto;
}

.wiki-sidebar-title {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.wiki-sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.wiki-side-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 0.825rem;
  text-align: left;
  transition: all 0.15s ease;
}

.wiki-side-item:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}

.wiki-side-item.active {
  background: var(--accent-primary);
  color: white;
}

.wiki-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.wiki-name {
  flex: 1;
  font-weight: 500;
}

.wiki-port {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  opacity: 0.8;
}

.wiki-article {
  padding: 2rem;
  overflow-y: auto;
}

.wiki-article-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
}

.wiki-article-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--text-primary);
}

.wiki-article-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.35rem;
}

.wiki-section {
  margin-bottom: 1.75rem;
}

.wiki-section h3 {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.65rem;
}

.wiki-bullet-list {
  list-style-type: disc;
  padding-left: 1.25rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.wiki-text {
  white-space: pre-wrap;
  font-family: var(--font-sans) !important;
  font-size: 0.9rem !important;
  line-height: 1.6 !important;
  background: var(--bg-surface) !important;
  padding: 1.25rem !important;
  color: var(--text-secondary) !important;
}

/* Footer */
.app-footer {
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-bottom: none;
  padding: 1.25rem 2rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-muted);
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-brand {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.svg-icon-md { width: 22px; height: 22px; }
.svg-icon-sm { width: 18px; height: 18px; }
.svg-icon-xs { width: 14px; height: 14px; }
.svg-icon-lg { width: 32px; height: 32px; }

.capitalize { text-transform: capitalize; }
.text-ellipsis { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

@media (max-width: 900px) {
  .wiki-layout {
    grid-template-columns: 1fr;
  }
}
</style>
