<template>
  <div v-if="service" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog glass-panel fade-in">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-left">
          <div class="service-icon-box" :style="{ backgroundColor: iconBgColor, color: service.color }">
            <img v-if="service.logo" :src="getLogoUrl(service.logo)" :alt="service.name" class="modal-logo-img" />
            <svg v-else class="svg-icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="15" x="2" y="7" rx="2" ry="2"/>
              <polyline points="17 2 12 7 7 2"/>
            </svg>
          </div>
          <div>
            <div class="modal-title-row">
              <h2 class="modal-title">{{ service.name }}</h2>
            </div>
            <p class="modal-subtitle">container: <code>{{ service.containerName }}</code> &bull; image: <code>{{ service.image }}</code></p>
          </div>
        </div>

        <div class="header-actions">
          <a :href="service.internalUrl" target="_blank" rel="noopener noreferrer" class="btn-primary">
            <svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
            launch web ui
          </a>
          <button class="btn-close" @click="$emit('close')" title="close modal">
            <svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Bar -->
      <div class="metrics-grid">
        <div class="metric-item">
          <span class="metric-label">local domain (.lan)</span>
          <a :href="service.domainUrl || service.internalUrl" target="_blank" rel="noopener noreferrer" class="metric-link code-font text-ellipsis">
            {{ service.domain || service.internalUrl }} 
          </a>
        </div>
        <div class="metric-item">
          <span class="metric-label">direct ip &amp; port</span>
          <a :href="service.ipUrl" target="_blank" rel="noopener noreferrer" class="metric-link code-font text-ellipsis">
            {{ service.ip }}:{{ service.port }} 
          </a>
        </div>
        <div class="metric-item">
          <span class="metric-label">container / vm</span>
          <span class="metric-value code-font">{{ service.containerName }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">host node</span>
          <span class="metric-value code-font">{{ service.node || 'Node 1' }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">allocated ram</span>
          <span class="metric-value code-font text-cyan">{{ service.ram || '256 MB' }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">allocated storage</span>
          <span class="metric-value code-font text-purple">{{ service.storage || '4 GB' }}</span>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="tabs-nav">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'overview' }" 
          @click="activeTab = 'overview'"
        >
          <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          overview &amp; features
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'compose' }" 
          @click="activeTab = 'compose'"
        >
          <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 16l4-4-4-4M8 8l-4 4 4 4"/></svg>
          docker compose
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'volumes' }" 
          @click="activeTab = 'volumes'"
        >
          <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          volumes &amp; storage
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'wiki' }" 
          @click="activeTab = 'wiki'"
        >
          <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          architecture &amp; wiki
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="tab-content">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="tab-pane fade-in">
          <div class="desc-box">
            <h4>description</h4>
            <p>{{ service.description }}</p>
          </div>

          <div class="features-box">
            <h4>key capabilities &amp; features</h4>
            <ul class="features-list">
              <li v-for="(feat, idx) in service.features" :key="idx">
                <svg class="svg-icon-xs text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{{ feat }}</span>
              </li>
            </ul>
          </div>

          <div class="tags-box">
            <h4>service tags &amp; tech stack</h4>
            <div class="tags-list">
              <span v-for="tag in service.tags" :key="tag" class="tag-badge">{{ tag }}</span>
            </div>
          </div>
        </div>

        <!-- Docker Compose Tab -->
        <div v-else-if="activeTab === 'compose'" class="tab-pane fade-in">
          <div class="code-header">
            <span class="code-title">docker-compose.yml</span>
            <button class="btn-copy" @click="copyCode(service.composeCode)">
              <svg v-if="!copied" class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <svg v-else class="svg-icon-xs text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              {{ copied ? 'copied to clipboard!' : 'copy compose yaml' }}
            </button>
          </div>
          <pre><code>{{ service.composeCode }}</code></pre>
        </div>

        <!-- Volumes & Storage Tab -->
        <div v-else-if="activeTab === 'volumes'" class="tab-pane fade-in">
          <h4>mounted volumes &amp; persistent storage</h4>
          <div v-if="service.volumes && service.volumes.length > 0" class="volumes-list">
            <div v-for="(vol, idx) in service.volumes" :key="idx" class="volume-item">
              <svg class="svg-icon-xs text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span class="vol-path code-font">{{ vol }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>no external storage volumes mapped for this service.</p>
          </div>

          <h4 class="mt-4">environment configuration</h4>
          <div v-if="service.envVars && service.envVars.length > 0" class="env-list">
            <div v-for="(env, idx) in service.envVars" :key="idx" class="env-item">
              <span class="env-var code-font">{{ env }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>default environment variables applied from template.</p>
          </div>
        </div>

        <!-- Wiki & Architecture Tab -->
        <div v-else-if="activeTab === 'wiki'" class="tab-pane fade-in">
          <div class="wiki-prose">
            <pre class="wiki-text">{{ service.wikiMarkdown }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  service: {
    type: Object,
    default: null
  }
});

defineEmits(['close']);

const activeTab = ref('overview');
const copied = ref(false);

const iconBgColor = computed(() => {
  return props.service ? `${props.service.color}22` : '#3e2a2c';
});

const copyCode = (code) => {
  if (navigator && navigator.clipboard) {
    navigator.clipboard.writeText(code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};

function getLogoUrl(logo) {
  if (!logo) return '';
  if (logo.startsWith('http')) return logo;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${base}/${logo.replace(/^\//, '')}`;
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
}

.modal-dialog {
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg), 0 0 35px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.02);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.service-icon-box {
  width: 54px;
  height: 54px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(214, 182, 186, 0.15);
  background: rgba(62, 42, 44, 0.35);
}

.modal-logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0 2px 5px rgba(0,0,0,0.35));
}

.svg-icon-lg {
  width: 28px;
  height: 28px;
}

.svg-icon-sm {
  width: 18px;
  height: 18px;
}

.svg-icon-xs {
  width: 14px;
  height: 14px;
}

.modal-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: lowercase;
}

.modal-subtitle {
  font-size: 0.825rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
  text-transform: lowercase;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

.btn-close {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  transition: all 0.15s ease;
}

.btn-close:hover {
  color: var(--text-primary);
  background: var(--bg-card-hover);
  border-color: var(--border-color-hover);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.metric-item {
  background: var(--bg-secondary);
  padding: 0.875rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.675rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  text-transform: lowercase;
}

.metric-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: lowercase;
}

.metric-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-cyan, #c89b9e);
  text-decoration: none;
  transition: all 0.15s ease;
}

.metric-link:hover {
  color: #e8d5d7;
  text-decoration: underline;
}

.code-font {
  font-family: var(--font-mono);
}

.tabs-nav {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-bottom: 1px solid var(--border-color);
  background: rgba(0, 0, 0, 0.15);
  overflow-x: auto;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.825rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.15s ease;
  text-transform: lowercase;
}

.tab-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.04);
}

.tab-btn.active {
  color: var(--text-primary);
  background: #3e2a2c;
  border: 1px solid rgba(214, 182, 186, 0.2);
  box-shadow: var(--shadow-sm);
}

.tab-content {
  padding: 1.75rem;
  overflow-y: auto;
  flex: 1;
}

.desc-box, .features-box, .tags-box {
  margin-bottom: 1.5rem;
}

h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.65rem;
  text-transform: lowercase;
}

p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  text-transform: lowercase;
}

.features-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.features-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  text-transform: lowercase;
}

.text-success {
  color: var(--accent-emerald);
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-badge {
  font-size: 0.775rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.65rem;
  border-radius: 14px;
  color: var(--text-secondary);
  text-transform: lowercase;
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.code-title {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
}

.btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.775rem;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all 0.15s ease;
  text-transform: lowercase;
}

.btn-copy:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-color-hover);
}

.volumes-list, .env-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.volume-item, .env-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.875rem;
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  font-size: 0.825rem;
}

.vol-path {
  color: var(--accent-secondary);
}

.env-var {
  color: #cfa16a;
}

.empty-state {
  padding: 1rem;
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  border: 1px dashed var(--border-color);
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.mt-4 {
  margin-top: 1.5rem;
}

.wiki-text {
  white-space: pre-wrap;
  font-family: var(--font-sans) !important;
  font-size: 0.9rem !important;
  line-height: 1.6 !important;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  color: var(--text-secondary) !important;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
