<template>
  <div class="app-layout" :data-theme="currentTheme">
    <!-- 60 FPS Interactive Cyber Particle Background Canvas -->
    <CyberParticleCanvas />

    <!-- Top Navigation Bar -->
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
              <h1 class="brand-title">homelab &amp; elo</h1>
            </div>
            <p class="brand-subtitle">proxmox ve &bull; openmediavault &bull; elo ai control plane &bull; k8s &bull; soc</p>
          </div>
        </div>

        <!-- Centered Navigation Tabs & Controls -->
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
              class="view-tab-btn elo-tab-btn" 
              :class="{ active: currentView === 'elo' }" 
              @click="currentView = 'elo'"
            >
              <svg class="svg-icon-xs text-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 3.3 2 6.2 5 7.4V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.6c3-1.2 5-4.1 5-7.4a8 8 0 0 0-8-8z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>
              elo ai terminal
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
              wiki &amp; docs
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
              class="view-tab-btn" 
              :class="{ active: currentView === 'ai' }" 
              @click="currentView = 'ai'"
            >
              <svg class="svg-icon-xs text-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 3.3 2 6.2 5 7.4V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.6c3-1.2 5-4.1 5-7.4a8 8 0 0 0-8-8z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>
              mcp workspace
            </button>
            <button 
              class="view-tab-btn" 
              :class="{ active: currentView === 'esp32' }" 
              @click="currentView = 'esp32'"
            >
              <svg class="svg-icon-xs text-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
              esp32 embedded
            </button>
            <button 
              class="view-tab-btn emergency-tab-btn" 
              :class="{ active: currentView === 'emergency' }" 
              @click="currentView = 'emergency'"
            >
              <svg class="svg-icon-xs text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              emergency sop
            </button>
          </nav>

          <div class="search-and-theme">
            <div class="search-container">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="search services, ports, tags, runbooks..." 
                class="search-input"
              />
              <button v-if="searchQuery" @click="searchQuery = ''" class="search-clear-btn" title="clear search">✕</button>
            </div>

            <button @click="toggleTheme" class="theme-toggle-btn" :title="`switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`">
              <svg v-if="currentTheme === 'dark'" class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              <svg v-else class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>

            <a href="https://github.com/stefanutc1/homelab" target="_blank" rel="noopener noreferrer" class="github-icon-btn" title="open github repository">
              <svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Dynamic Content Workspace -->
    <main class="main-content">
      <!-- Real-Time Futuristic Telemetry HUD (Always Visible on Dashboard & ELO) -->
      <CommandCenterHUD v-if="currentView === 'dashboard' || currentView === 'elo'" />

      <!-- View 1: Main Services Dashboard -->
      <div v-if="currentView === 'dashboard'" class="dashboard-view fade-in">
        <!-- Pinned Favorites Bar -->
        <section v-if="favoriteServices.length > 0 && !searchQuery" class="favorites-section glass-panel">
          <div class="section-title-row">
            <h2 class="section-title">
              <svg class="svg-icon-xs text-amber" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              pinned core favorites
            </h2>
            <span class="badge-count">{{ favoriteServices.length }} active</span>
          </div>
          <div class="services-grid favorites-grid">
            <ServiceCard 
              v-for="svc in favoriteServices" 
              :key="`fav-${svc.id}`" 
              :service="svc" 
              :is-favorite="true"
              @toggle-fav="toggleFavorite(svc.id)"
              @open-modal="openServiceModal(svc)"
            />
          </div>
        </section>

        <!-- Category Filters -->
        <div class="category-nav">
          <div class="category-pills">
            <button 
              v-for="cat in categoriesList" 
              :key="cat.id" 
              class="cat-pill" 
              :class="{ active: selectedCategory === cat.id }"
              @click="selectedCategory = cat.id"
            >
              {{ cat.name }}
              <span class="cat-count">{{ getCategoryCount(cat.id) }}</span>
            </button>
          </div>
        </div>

        <!-- All Services Section -->
        <section class="services-section">
          <div class="section-title-row">
            <h2 class="section-title">
              {{ activeCategoryName }}
            </h2>
            <span class="badge-count">{{ filteredServices.length }} total</span>
          </div>

          <div v-if="filteredServices.length === 0" class="empty-state glass-panel">
            <p>no services found matching your query "<strong>{{ searchQuery }}</strong>"</p>
            <button @click="resetFilters" class="btn-secondary">clear filters</button>
          </div>

          <div v-else class="services-grid">
            <ServiceCard 
              v-for="svc in filteredServices" 
              :key="svc.id" 
              :service="svc" 
              :is-favorite="favorites.includes(svc.id)"
              @toggle-fav="toggleFavorite(svc.id)"
              @open-modal="openServiceModal(svc)"
            />
          </div>
        </section>
      </div>

      <!-- View 2: ELO Live Interactive AI Terminal -->
      <EloLiveTerminal v-else-if="currentView === 'elo'" />

      <!-- View 3: Hardware Nodes Specification -->
      <HardwareView v-else-if="currentView === 'hardware'" />

      <!-- View 4: Interactive Markdown Wiki & Architectural Docs -->
      <div v-else-if="currentView === 'wiki'" class="wiki-view fade-in">
        <div class="wiki-container-split">
          <!-- Left Navigation Sidebar -->
          <aside class="wiki-sidebar glass-panel">
            <div class="wiki-search-box">
              <input 
                v-model="wikiSearchQuery" 
                type="text" 
                placeholder="search documentation & runbooks..." 
                class="wiki-input"
              />
            </div>

            <!-- Articles Section -->
            <div class="wiki-nav-group">
              <h3 class="wiki-group-title">homelab &amp; elo documentation</h3>
              <button 
                v-for="art in filteredWikiArticles" 
                :key="art.id"
                class="wiki-nav-item"
                :class="{ active: activeWikiMode === 'article' && activeWikiArticle.id === art.id }"
                @click="selectWikiArticle(art)"
              >
                <span class="wiki-dot" style="background-color: #8e44ad;"></span>
                <span class="wiki-name text-ellipsis">{{ art.title }}</span>
                <span class="wiki-port">{{ art.category }}</span>
              </button>
            </div>

            <!-- Service Runbooks Section -->
            <div class="wiki-nav-group">
              <h3 class="wiki-group-title">service manifests &amp; runbooks</h3>
              <button 
                v-for="svc in filteredWikiServices" 
                :key="svc.id"
                class="wiki-nav-item"
                :class="{ active: activeWikiMode === 'service' && activeWikiService.id === svc.id }"
                @click="selectWikiService(svc)"
              >
                <span class="wiki-dot" :style="{ backgroundColor: svc.color || '#3498db' }"></span>
                <span class="wiki-name text-ellipsis">{{ svc.name }}</span>
                <span class="wiki-port">:{{ svc.port }}</span>
              </button>
            </div>
          </aside>

          <!-- Right Documentation Article View -->
          <article class="wiki-article glass-panel">
            <!-- Render Markdown Article -->
            <div v-if="activeWikiMode === 'article' && activeWikiArticle">
              <div class="wiki-article-header">
                <div>
                  <h2 class="wiki-article-title">{{ activeWikiArticle.title }}</h2>
                  <p class="wiki-article-meta">
                    category: <span class="capitalize">{{ activeWikiArticle.category }}</span> &bull; 
                    section: <code>{{ activeWikiArticle.section }}</code>
                  </p>
                </div>
              </div>
              <div class="wiki-markdown-body" v-html="renderedArticleMarkdown"></div>
            </div>

            <!-- Render Service Manifest -->
            <div v-else-if="activeWikiMode === 'service' && activeWikiService">
              <div class="wiki-article-header">
                <div>
                  <h2 class="wiki-article-title">{{ activeWikiService.name }}</h2>
                  <p class="wiki-article-meta">
                    category: <span class="capitalize">{{ activeWikiService.category }}</span> &bull; 
                    container: <code>{{ activeWikiService.containerName }}</code> &bull;
                    ip: <code>{{ activeWikiService.ip }}:{{ activeWikiService.port }}</code>
                  </p>
                </div>
                <a :href="activeWikiService.internalUrl || activeWikiService.ipUrl" target="_blank" rel="noopener noreferrer" class="btn-primary">
                  launch service ui
                </a>
              </div>

              <div class="wiki-section">
                <h3>overview</h3>
                <p>{{ activeWikiService.description }}</p>
              </div>

              <div class="wiki-section" v-if="activeWikiService.features">
                <h3>features &amp; capabilities</h3>
                <ul class="wiki-bullet-list">
                  <li v-for="(feat, idx) in activeWikiService.features" :key="idx">{{ feat }}</li>
                </ul>
              </div>

              <div class="wiki-section" v-if="activeWikiService.composeCode">
                <h3>docker compose manifest</h3>
                <pre><code>{{ activeWikiService.composeCode }}</code></pre>
              </div>

              <div class="wiki-section" v-if="activeWikiService.wikiMarkdown">
                <h3>architecture &amp; runbook</h3>
                <pre class="wiki-text">{{ activeWikiService.wikiMarkdown }}</pre>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- View 5: Visual VLAN & Mesh Topology -->
      <TopologyView v-else-if="currentView === 'topology'" />

      <!-- View 6: Port Allocation Matrix -->
      <PortMatrix 
        v-else-if="currentView === 'ports'" 
        :services="servicesList"
        @select="openServiceModal"
      />

      <!-- View 7: 10h+ Emergency Blackout Standard Operating Procedure -->
      <EmergencyView v-else-if="currentView === 'emergency'" />

      <!-- View 8: AI Memory Room & MCP Workspace -->
      <AiView v-else-if="currentView === 'ai'" />

      <!-- View 9: ESP32 & Embedded IoT Workspace -->
      <Esp32View v-else-if="currentView === 'esp32'" />
    </main>

    <!-- Footer with Real Hardware Specs from hardware.md -->
    <footer class="app-footer glass-panel">
      <div class="footer-content">
        <div>
          <span class="footer-brand">homelab operations</span> &bull; 
          <span class="footer-info">proxmox ve (192.168.1.132) &bull; openmediavault (192.168.1.135) &bull; elo host m1 (192.168.1.133) &bull; k8s worker</span>
        </div>
        <div class="footer-links">
          <span>storage: zfs dataset pool</span>
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
import { marked } from 'marked';
import { categories as categoriesList, services as servicesList } from './data/services.js';
import { allArticles } from './data/wikiData.js';
import CyberParticleCanvas from './components/CyberParticleCanvas.vue';
import CommandCenterHUD from './components/CommandCenterHUD.vue';
import EloLiveTerminal from './components/EloLiveTerminal.vue';
import ServiceCard from './components/ServiceCard.vue';
import ServiceModal from './components/ServiceModal.vue';
import TopologyView from './components/TopologyView.vue';
import PortMatrix from './components/PortMatrix.vue';
import EmergencyView from './components/EmergencyView.vue';
import HardwareView from './components/HardwareView.vue';
import AiView from './components/AiView.vue';
import Esp32View from './components/Esp32View.vue';

const currentView = ref('dashboard');
const selectedCategory = ref('all');
const searchQuery = ref('');
const wikiSearchQuery = ref('');
const activeModalService = ref(null);
const currentTheme = ref('dark');
const favorites = ref(['homeassistant', 'immich', 'vaultwarden', 'grafana', 'elo-core']);

// Wiki sub-state
const activeWikiMode = ref('article'); // 'article' or 'service'
const activeWikiArticle = ref(allArticles[0]);
const activeWikiService = ref(servicesList[0]);

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

const selectWikiArticle = (art) => {
  activeWikiMode.value = 'article';
  activeWikiArticle.value = art;
};

const selectWikiService = (svc) => {
  activeWikiMode.value = 'service';
  activeWikiService.value = svc;
};

const renderedArticleMarkdown = computed(() => {
  if (!activeWikiArticle.value || !activeWikiArticle.value.content) return '';
  return marked.parse(activeWikiArticle.value.content);
});

const filteredWikiArticles = computed(() => {
  if (!wikiSearchQuery.value.trim()) return allArticles;
  const q = wikiSearchQuery.value.toLowerCase();
  return allArticles.filter(a => 
    a.title.toLowerCase().includes(q) || 
    a.summary.toLowerCase().includes(q) ||
    a.category.toLowerCase().includes(q)
  );
});

const filteredWikiServices = computed(() => {
  if (!wikiSearchQuery.value.trim()) return servicesList;
  const q = wikiSearchQuery.value.toLowerCase();
  return servicesList.filter(s => 
    s.name.toLowerCase().includes(q) || 
    s.description.toLowerCase().includes(q)
  );
});

const getCategoryCount = (catId) => {
  if (catId === 'all') return servicesList.length;
  return servicesList.filter(s => s.category === catId).length;
};

const activeCategoryName = computed(() => {
  if (selectedCategory.value === 'all') return 'all services catalog';
  const cat = categoriesList.find(c => c.id === selectedCategory.value);
  return cat ? `${cat.name} services` : 'services';
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
@import './assets/main.css';

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.brand-logo {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent-primary-light), #8e44ad);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.svg-logo {
  width: 22px;
  height: 22px;
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

.nav-center-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.view-tabs {
  display: flex;
  gap: 0.4rem;
  background: var(--bg-card);
  padding: 0.3rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.view-tab-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 7px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-tab-btn:hover {
  color: var(--text-primary);
}

.view-tab-btn.active {
  background: var(--accent-primary);
  color: #fff;
}

.elo-tab-btn.active {
  background: linear-gradient(135deg, #8e44ad, #3e2a2c);
  color: #fff;
}

.search-and-theme {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  padding: 0.45rem 2rem 0.45rem 2.2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.8rem;
  width: 240px;
  outline: none;
}

.search-input:focus {
  border-color: var(--accent-primary-light);
}

.search-clear-btn {
  position: absolute;
  right: 0.6rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}

.theme-toggle-btn, .github-icon-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.45rem;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-content {
  flex: 1;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  position: relative;
  z-index: 1;
}

.favorites-section {
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.badge-count {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.category-nav {
  margin-bottom: 1.5rem;
}

.category-pills {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.cat-pill {
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s ease;
}

.cat-pill.active {
  background: var(--accent-primary);
  color: #fff;
  border-color: var(--accent-primary-light);
}

.cat-count {
  font-size: 0.7rem;
  opacity: 0.8;
}

/* Wiki Container */
.wiki-container-split {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
}

.wiki-sidebar {
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

.wiki-input {
  width: 100%;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 0.8rem;
  margin-bottom: 1rem;
  outline: none;
}

.wiki-group-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin: 1rem 0 0.5rem 0.25rem;
}

.wiki-nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.wiki-nav-item:hover {
  background: var(--bg-card-hover);
}

.wiki-nav-item.active {
  background: var(--accent-primary);
  color: #fff;
}

.wiki-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.wiki-name {
  flex: 1;
}

.wiki-port {
  font-size: 0.75rem;
  opacity: 0.7;
}

.wiki-article {
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow-y: auto;
  max-height: calc(100vh - 160px);
}

.wiki-article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
}

.wiki-article-title {
  font-size: 1.6rem;
  font-weight: 800;
  text-transform: uppercase;
  margin: 0 0 0.5rem 0;
}

.wiki-article-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.wiki-markdown-body {
  line-height: 1.7;
  font-size: 0.95rem;
}

.wiki-markdown-body h1, .wiki-markdown-body h2, .wiki-markdown-body h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.wiki-markdown-body pre {
  background: #120e0f;
  color: #f5ecec;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid var(--border-color);
}

.wiki-markdown-body code {
  background: rgba(214, 182, 186, 0.12);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: var(--font-mono);
}

.wiki-markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.wiki-markdown-body th, .wiki-markdown-body td {
  border: 1px solid var(--border-color);
  padding: 0.6rem 0.8rem;
  text-align: left;
}

.wiki-markdown-body th {
  background: var(--bg-card);
}

.app-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: auto;
  position: relative;
  z-index: 1;
}

.footer-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.footer-brand {
  font-weight: 700;
  text-transform: uppercase;
}

.text-amber { color: #f39c12; }
.text-purple { color: #8e44ad; }
.text-cyan { color: #00bcd4; }
.text-danger { color: #e74c3c; }
.svg-icon-xs { width: 14px; height: 14px; }
.svg-icon-sm { width: 18px; height: 18px; }
.text-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.capitalize { text-transform: capitalize; }
.fade-in { animation: fadeIn 0.25s ease; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .wiki-container-split {
    grid-template-columns: 1fr;
  }
}
</style>
