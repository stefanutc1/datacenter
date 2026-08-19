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
          <div class="brand-text-block">
            <div class="brand-title-row">
              <h1 class="brand-title">homelab</h1>
            </div>
            <p class="brand-subtitle">proxmox ve &bull; openmediavault &bull; apple m1 arm64 &bull; k8s worker &bull; service catalog</p>
          </div>
        </div>

        <!-- Centered Navigation Tabs, Search & Theme Toggle -->
        <div class="nav-center-row">
          <nav class="view-tabs">
            <button 
              class="view-tab-btn" 
              :class="{ active: currentView === 'dashboard' }" 
              @click="currentView = 'dashboard'"
            >
              <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              services
            </button>
            <button 
              class="view-tab-btn" 
              :class="{ active: currentView === 'hardware' }" 
              @click="currentView = 'hardware'"
            >
              <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
              hardware nodes
            </button>
            <button 
              class="view-tab-btn" 
              :class="{ active: currentView === 'wiki' }" 
              @click="currentView = 'wiki'"
            >
              <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              wiki catalog
            </button>
            <button 
              class="view-tab-btn" 
              :class="{ active: currentView === 'topology' }" 
              @click="currentView = 'topology'"
            >
              <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
              topology
            </button>
            <button 
              class="view-tab-btn" 
              :class="{ active: currentView === 'ports' }" 
              @click="currentView = 'ports'"
            >
              <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              port matrix
            </button>
            <button 
              class="view-tab-btn emergency-tab-btn" 
              :class="{ active: currentView === 'emergency' }" 
              @click="currentView = 'emergency'"
            >
              <svg class="svg-icon-xs text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              10h+ emergency sop
            </button>
            <a 
              href="./wiki/" 
              class="view-tab-btn nav-link-external" 
              title="open markdown knowledge base & runbooks"
            >
              <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              full docs wiki ↗
            </a>
          </nav>

          <div class="search-and-theme">
            <!-- Global Search Bar -->
            <div class="search-container">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="search services, ports (:8080), tags..." 
                class="search-input"
              />
              <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">&times;</button>
            </div>

            <button class="theme-toggle" @click="toggleTheme" title="toggle theme">
              <svg v-if="currentTheme === 'dark'" class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              <svg v-else class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </button>
          </div>
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
            <div class="stat-number">4 nodes</div>
            <div class="stat-label">physical hosts (i3 · celeron · m1 · athlon ii)</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper text-cyan">
            <svg class="svg-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          </div>
          <div>
            <div class="stat-number">{{ uniquePortsCount }} ports</div>
            <div class="stat-label">{{ servicesList.length }} microservices online</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper text-emerald">
            <svg class="svg-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
          </div>
          <div>
            <div class="stat-number">gtx 1050 ti</div>
            <div class="stat-label">4gb vram · pytorch / frigate</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper text-purple">
            <svg class="svg-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div>
            <div class="stat-number">512g + 500g + 80g</div>
            <div class="stat-label">ssd tier + omv + k8s worker</div>
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
              pinned favorites
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

        <!-- All Services Section -->
        <section class="all-services-section">
          <div class="section-title-row">
            <h2 class="sub-heading">
              <span>{{ activeCategoryName }}</span>
            </h2>
            <span class="sub-desc">showing {{ filteredServices.length }} service(s)</span>
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
            <h3>no matching homelab services found</h3>
            <p>try searching for a different keyword, port number, or clear your category filter.</p>
            <button class="btn-primary" @click="resetFilters">reset filters</button>
          </div>
        </section>
      </div>

      <!-- View 2: Real Hardware Specifications View -->
      <HardwareView v-else-if="currentView === 'hardware'" />

      <!-- View 3: Embedded Wiki & Docs Catalog -->
      <div v-else-if="currentView === 'wiki'" class="wiki-catalog-view fade-in">
        <div class="wiki-layout">
          <!-- Left Service Selector -->
          <aside class="wiki-sidebar glass-panel">
            <h3 class="wiki-sidebar-title">service documentation</h3>
            <div class="wiki-sidebar-list">
              <button 
                v-for="svc in servicesList" 
                :key="'wiki-side-' + svc.id"
                class="wiki-side-item"
                :class="{ active: activeWikiService?.id === svc.id }"
                @click="activeWikiService = svc"
              >
                <span class="wiki-dot" :style="{ backgroundColor: svc.color }"></span>
                <span class="wiki-name text-ellipsis">{{ svc.name }}</span>
                <span class="wiki-port">:{{ svc.port }}</span>
              </button>
            </div>
          </aside>

          <!-- Right Article View -->
          <article v-if="activeWikiService" class="wiki-article glass-panel">
            <div class="wiki-article-header">
              <div>
                <h2 class="wiki-article-title">{{ activeWikiService.name }}</h2>
                <p class="wiki-article-meta">
                  category: <span class="capitalize">{{ activeWikiService.category }}</span> &bull; 
                  container: <code>{{ activeWikiService.containerName }}</code>
                </p>
              </div>
              <a :href="activeWikiService.internalUrl" target="_blank" rel="noopener noreferrer" class="btn-primary">
                launch ui
              </a>
            </div>

            <div class="wiki-section">
              <h3>overview</h3>
              <p>{{ activeWikiService.description }}</p>
            </div>

            <div class="wiki-section">
              <h3>features & capabilities</h3>
              <ul class="wiki-bullet-list">
                <li v-for="(feat, idx) in activeWikiService.features" :key="idx">{{ feat }}</li>
              </ul>
            </div>

            <div class="wiki-section">
              <h3>docker compose manifest</h3>
              <pre><code>{{ activeWikiService.composeCode }}</code></pre>
            </div>

            <div class="wiki-section">
              <h3>architecture & runbook</h3>
              <pre class="wiki-text">{{ activeWikiService.wikiMarkdown }}</pre>
            </div>
          </article>
        </div>
      </div>

      <!-- View 4: Visual VLAN & Mesh Topology -->
      <TopologyView v-else-if="currentView === 'topology'" />

      <!-- View 5: Port Allocation Matrix -->
      <PortMatrix 
        v-else-if="currentView === 'ports'" 
        :services="servicesList"
        @select="openServiceModal"
      />

      <!-- View 6: 10h+ Emergency Blackout Standard Operating Procedure -->
      <EmergencyView v-else-if="currentView === 'emergency'" />
    </main>

    <!-- Footer with Real Hardware Specs from hardware.md -->
    <footer class="app-footer glass-panel">
      <div class="footer-content">
        <div>
          <span class="footer-brand">homelab operations</span> &bull; 
          <span class="footer-info">proxmox ve 9.2 (i3-10100f / gtx 1050 ti) &bull; omv (celeron n2830) &bull; proxmox2 (apple m1) &bull; k8s-04 (athlon ii x2)</span>
        </div>
        <div class="footer-links">
          <span>storage: 512gb ssd + 500gb hdd + 80gb hdd</span>
          <span>&bull;</span>
          <span>mesh: tailscale wireguard</span>
          <span>&bull;</span>
          <span>dns: pi-hole</span>
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
import { categories as categoriesList, services as servicesList } from './data/services.js';
import ServiceCard from './components/ServiceCard.vue';
import ServiceModal from './components/ServiceModal.vue';
import TopologyView from './components/TopologyView.vue';
import PortMatrix from './components/PortMatrix.vue';
import EmergencyView from './components/EmergencyView.vue';
import HardwareView from './components/HardwareView.vue';

const currentView = ref('dashboard');
const selectedCategory = ref('all');
const searchQuery = ref('');
const activeModalService = ref(null);
const activeWikiService = ref(servicesList[0]);
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

const activeCategoryName = computed(() => {
  if (selectedCategory.value === 'all') return 'all services catalog';
  const cat = categoriesList.find(c => c.id === selectedCategory.value);
  return cat ? `${cat.name} services` : 'services';
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
  padding: 1.25rem 2rem 1rem;
}

.nav-container {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.15rem;
  text-align: center;
}

.brand-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
}

.brand-text-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.brand-logo {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #3e2a2c, #5e3f42);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f5ecec;
  border: 1px solid rgba(214, 182, 186, 0.2);
  box-shadow: 0 0 16px rgba(62, 42, 44, 0.6);
  transition: transform 0.25s ease;
}

.brand-logo:hover {
  transform: scale(1.05);
}

.svg-logo {
  width: 24px;
  height: 24px;
}

.brand-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.brand-title {
  font-family: var(--font-serif);
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  text-transform: lowercase;
  text-align: center;
}

.brand-subtitle {
  font-size: 0.82rem;
  color: var(--text-muted);
  text-transform: lowercase;
  text-align: center;
  margin-top: 0.2rem;
}

.nav-center-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
}

.view-tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.25rem;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.search-and-theme {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

/* Search Bar */
.search-container {
  width: 280px;
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
  padding: 0.5rem 2rem 0.5rem 2.4rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.82rem;
  outline: none;
  transition: all 0.2s ease;
  text-transform: lowercase;
}

.search-input:focus {
  border-color: var(--accent-primary-light);
  box-shadow: 0 0 14px rgba(142, 94, 99, 0.35);
}

.search-clear {
  position: absolute;
  right: 0.75rem;
  color: var(--text-muted);
  font-size: 1.2rem;
  line-height: 1;
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
  text-transform: lowercase;
}

.view-tab-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.04);
}

.view-tab-btn.active {
  background: #3e2a2c;
  color: #f5ecec;
  border: 1px solid rgba(214, 182, 186, 0.25);
  box-shadow: var(--shadow-sm);
}

.emergency-tab-btn:hover {
  color: #fca5a5 !important;
}

.emergency-tab-btn.active {
  background: rgba(184, 85, 90, 0.25) !important;
  border: 1px solid rgba(184, 85, 90, 0.6) !important;
  color: #fca5a5 !important;
  box-shadow: 0 0 16px rgba(184, 85, 90, 0.35) !important;
}

.text-danger {
  color: var(--accent-danger);
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
  background: rgba(62, 42, 44, 0.35);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.08);
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: lowercase;
}

.stat-label {
  font-size: 0.775rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.text-indigo { color: #baa6a8; }
.text-cyan { color: #c89b9e; }
.text-emerald { color: #6b9e78; }
.text-purple { color: #d6b2b5; }
.text-warning { color: #cfa16a; }

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
  letter-spacing: 0.02em;
  text-transform: lowercase;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: inset 0 1px 0 var(--border-specular), var(--shadow-sm);
}

.cat-pill-btn:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-color-hover);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.cat-pill-btn.active {
  background: #3e2a2c;
  border-color: rgba(214, 182, 186, 0.3);
  color: #f5ecec;
  box-shadow: 0 0 16px rgba(62, 42, 44, 0.5);
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
  text-transform: lowercase;
}

.sub-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: lowercase;
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
  text-transform: lowercase;
}

.empty-search-state p {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  text-transform: lowercase;
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
  text-transform: lowercase;
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
  text-transform: lowercase;
}

.wiki-side-item:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}

.wiki-side-item.active {
  background: #3e2a2c;
  color: #f5ecec;
  border: 1px solid rgba(214, 182, 186, 0.2);
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
  text-transform: lowercase;
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
  text-transform: lowercase;
}

.wiki-article-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.35rem;
  text-transform: lowercase;
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
  text-transform: lowercase;
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
  border-radius: var(--radius-sm);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.2rem;
  background: #3e2a2c;
  color: #f5ecec;
  border: 1px solid rgba(214, 182, 186, 0.25);
  border-radius: var(--radius-sm);
  font-size: 0.825rem;
  font-weight: 600;
  text-transform: lowercase;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #54393c;
  border-color: rgba(214, 182, 186, 0.4);
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
  text-transform: lowercase;
}

.footer-brand {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-primary);
  text-transform: lowercase;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  text-transform: lowercase;
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
