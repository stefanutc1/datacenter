<template>
  <div class="cyber-hub">
    <!-- Top Navigation Bar -->
    <header class="top-nav">
      <div class="nav-container">
        <div class="brand-group">
          <div class="brand-icon">
            <img :src="getLogoUrl('icons/shield.svg')" alt="cyberlab" class="brand-logo-img" />
          </div>
          <div class="brand-text-block">
            <div class="brand-title-row">
              <h1 class="brand-title">cyberlab</h1>
            </div>
            <p class="brand-subtitle">siem &bull; threat hunting &bull; red team &bull; dfir operations proving ground</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="main-container">
      <!-- Dashboard Controls -->
      <section class="controls-section">
        <div class="view-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: currentView === 'cards' }" 
            @click="currentView = 'cards'"
          >
            security capabilities ({{ securityTools.length }})
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: currentView === 'matrix' }" 
            @click="currentView = 'matrix'"
          >
            port &amp; tool matrix
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: currentView === 'topology' }" 
            @click="currentView = 'topology'"
          >
            zero-trust topology
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: currentView === 'ai' }" 
            @click="currentView = 'ai'"
          >
            ai threat memory &amp; mcp
          </button>
          <a :href="wikiUrl" class="tab-btn wiki-tab-btn">
            architecture wiki ↗
          </a>
        </div>

        <div class="search-box">
          <svg class="search-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="search tools, mitre att&ck, ports, credentials..." 
          />
          <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">✕</button>
        </div>
      </section>

      <!-- Category Filter Pills (When in cards view) -->
      <section v-if="currentView === 'cards'" class="categories-section">
        <button
          v-for="cat in toolCategories"
          :key="cat.id"
          class="cat-filter-btn"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectedCategory = cat.id"
        >
          {{ cat.label }}
          <span class="cat-count">{{ getCategoryCount(cat.id) }}</span>
        </button>
      </section>

      <!-- VIEW 1: Interactive Tool Cards Grid -->
      <section v-if="currentView === 'cards'" class="grid-section">
        <div class="tools-grid">
          <ToolCard 
            v-for="tool in filteredTools" 
            :key="tool.id" 
            :tool="tool" 
            @select="selectedTool = $event" 
          />
        </div>
        <div v-if="filteredTools.length === 0" class="empty-state">
          <p>no security capabilities match your query.</p>
          <button class="reset-btn" @click="resetFilters">reset filters</button>
        </div>
      </section>

      <!-- VIEW 2: Port & Tool Matrix -->
      <section v-else-if="currentView === 'matrix'" class="matrix-section">
        <PortMatrix :tools="securityTools" @select="selectedTool = $event" />
      </section>

      <!-- VIEW 3: Zero-Trust Topology -->
      <section v-else-if="currentView === 'topology'" class="topology-section">
        <TopologyView />
      </section>

      <!-- VIEW 4: AI Threat Memory & Security MCP -->
      <section v-else-if="currentView === 'ai'" class="ai-section">
        <AiView />
      </section>
    </main>

    <!-- Detailed Tool & Playbook Modal -->
    <ToolModal 
      v-if="selectedTool" 
      :tool="selectedTool" 
      @close="selectedTool = null" 
    />

    <!-- Footer -->
    <footer class="cyber-footer">
      <div class="footer-inner">
        <p>cyberlab operations hub &bull; built by <a href="https://github.com/stefannut" target="_blank"><strong>@stefannut</strong></a></p>
        <div class="footer-links">
          <a :href="wikiUrl">architecture wiki</a>
          <span>&bull;</span>
          <a href="https://github.com/stefannut/cyberlab" target="_blank">github repository ↗</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { toolCategories, securityTools } from './data/tools.js';
import ToolCard from './components/ToolCard.vue';
import ToolModal from './components/ToolModal.vue';
import PortMatrix from './components/PortMatrix.vue';
import TopologyView from './components/TopologyView.vue';
import AiView from './components/AiView.vue';

const currentView = ref('cards');
const searchQuery = ref('');
const selectedCategory = ref('all');
const selectedTool = ref(null);

const wikiUrl = computed(() => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${base}/wiki/`;
});

const filteredTools = computed(() => {
  return securityTools.filter(t => {
    const matchCat = selectedCategory.value === 'all' || t.category === selectedCategory.value;
    if (!matchCat) return false;
    
    if (!searchQuery.value.trim()) return true;
    const q = searchQuery.value.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.role.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.webPort && t.webPort.toString().includes(q)) ||
      (t.mitre && t.mitre.toLowerCase().includes(q)) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(tag))) ||
      (t.credentials && (t.credentials.user.toLowerCase().includes(q) || t.credentials.pass.toLowerCase().includes(q)))
    );
  });
});

function getCategoryCount(catId) {
  if (catId === 'all') return securityTools.length;
  return securityTools.filter(t => t.category === catId).length;
}

function resetFilters() {
  searchQuery.value = '';
  selectedCategory.value = 'all';
}

function getLogoUrl(logo) {
  if (!logo) return '';
  if (logo.startsWith('http')) return logo;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${base}/${logo.replace(/^\//, '')}`;
}
</script>

<style scoped>
.cyber-hub {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-nav {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  padding: 1.5rem 2rem 1.25rem;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(12px);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

.brand-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.6rem;
}

.brand-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: rgba(62, 42, 44, 0.45);
  border: 1px solid rgba(214, 182, 186, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px rgba(62, 42, 44, 0.5);
}

.brand-logo-img {
  width: 24px;
  height: 24px;
}

.brand-text-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.brand-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}

.brand-title {
  font-size: 1.55rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  text-transform: lowercase;
  text-align: center;
}

.version-badge {
  font-size: 0.65rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: #f5ecec;
  background: #3e2a2c;
  border: 1px solid rgba(214, 182, 186, 0.25);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: lowercase;
}

.brand-subtitle {
  font-size: 0.82rem;
  color: var(--text-muted);
  text-transform: lowercase;
  text-align: center;
  margin-top: 0.15rem;
}

.main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
  width: 100%;
}

.controls-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.15rem;
  margin-bottom: 2rem;
}

.view-tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 0.25rem;
  border-radius: var(--radius-lg);
  gap: 0.25rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.5rem 1rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all 0.15s ease;
  text-transform: lowercase;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  background: #3e2a2c;
  color: #f5ecec;
  border: 1px solid rgba(214, 182, 186, 0.2);
}

.wiki-tab-btn {
  color: var(--accent-cyan);
}

.wiki-tab-btn:hover {
  color: #f5ecec;
  background: rgba(62, 42, 44, 0.45);
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
}

.search-svg {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.search-box input {
  width: 100%;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 0.65rem 2.2rem 0.65rem 2.5rem;
  font-size: 0.85rem;
  color: var(--text-primary);
  transition: border-color 0.15s ease;
  text-transform: lowercase;
}

.search-box input:focus {
  outline: none;
  border-color: var(--accent-primary-light);
  box-shadow: 0 0 12px rgba(142, 94, 99, 0.35);
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.categories-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.cat-filter-btn {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 0.4rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.15s ease;
  text-transform: lowercase;
}

.cat-filter-btn:hover {
  border-color: var(--border-color-hover);
  color: var(--text-primary);
}

.cat-filter-btn.active {
  background: #3e2a2c;
  border-color: rgba(214, 182, 186, 0.3);
  color: #f5ecec;
}

.cat-count {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  background: rgba(0, 0, 0, 0.35);
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.reset-btn {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #f5ecec;
  background: #3e2a2c;
  border: 1px solid rgba(214, 182, 186, 0.25);
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-md);
  text-transform: lowercase;
}

.cyber-footer {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  padding: 1.5rem 2rem;
  margin-top: auto;
}

.footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: lowercase;
}

.footer-links a:hover {
  color: var(--accent-cyan);
}

@media (max-width: 1024px) {
  .controls-section {
    align-items: center;
  }
}
</style>
