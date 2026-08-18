<template>
  <div v-if="service" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog glass-panel fade-in">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-left">
          <div class="service-icon-box" :style="{ backgroundColor: iconBgColor, color: service.color }">
            <svg class="svg-icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="15" x="2" y="7" rx="2" ry="2"/>
              <polyline points="17 2 12 7 7 2"/>
            </svg>
          </div>
          <div>
            <div class="modal-title-row">
              <h2 class="modal-title">{{ service.name }}</h2>
              <span class="status-badge online">
                <span class="status-dot"></span>
                Active Service
              </span>
            </div>
            <p class="modal-subtitle">Container: <code>{{ service.containerName }}</code> &bull; Image: <code>{{ service.image }}</code></p>
          </div>
        </div>

        <div class="header-actions">
          <a :href="service.internalUrl" target="_blank" rel="noopener noreferrer" class="btn-primary">
            <svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
            Launch Web UI
          </a>
          <button class="btn-close" @click="$emit('close')" title="Close Wiki Modal">
            <svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Bar -->
      <div class="metrics-grid">
        <div class="metric-item">
          <span class="metric-label">LOCAL DOMAIN (.LAN)</span>
          <a :href="service.domainUrl || service.internalUrl" target="_blank" rel="noopener noreferrer" class="metric-link code-font text-ellipsis">
            {{ service.domain || service.internalUrl }} ↗
          </a>
        </div>
        <div class="metric-item">
          <span class="metric-label">DIRECT IP &amp; PORT</span>
          <a :href="service.ipUrl" target="_blank" rel="noopener noreferrer" class="metric-link code-font text-ellipsis">
            {{ service.ip }}:{{ service.port }} ↗
          </a>
        </div>
        <div class="metric-item">
          <span class="metric-label">CONTAINER</span>
          <span class="metric-value code-font">{{ service.containerName }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">CATEGORY</span>
          <span class="metric-value capitalize">{{ service.category }}</span>
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
          Overview &amp; Features
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'compose' }" 
          @click="activeTab = 'compose'"
        >
          <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 16l4-4-4-4M8 8l-4 4 4 4"/></svg>
          Docker Compose
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'volumes' }" 
          @click="activeTab = 'volumes'"
        >
          <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Volumes &amp; Storage
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'wiki' }" 
          @click="activeTab = 'wiki'"
        >
          <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          Architecture &amp; Wiki
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="tab-content">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="tab-pane fade-in">
          <div class="desc-box">
            <h4>Description</h4>
            <p>{{ service.description }}</p>
          </div>

          <div class="features-box">
            <h4>Key Capabilities &amp; Features</h4>
            <ul class="features-list">
              <li v-for="(feat, idx) in service.features" :key="idx">
                <svg class="svg-icon-xs text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{{ feat }}</span>
              </li>
            </ul>
          </div>

          <div class="tags-box">
            <h4>Service Tags &amp; Tech Stack</h4>
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
              {{ copied ? 'Copied to Clipboard!' : 'Copy Compose YAML' }}
            </button>
          </div>
          <pre><code>{{ service.composeCode }}</code></pre>
        </div>

        <!-- Volumes & Storage Tab -->
        <div v-else-if="activeTab === 'volumes'" class="tab-pane fade-in">
          <h4>Mounted Volumes &amp; Persistent Storage</h4>
          <div v-if="service.volumes && service.volumes.length > 0" class="volumes-list">
            <div v-for="(vol, idx) in service.volumes" :key="idx" class="volume-item">
              <svg class="svg-icon-xs text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span class="vol-path code-font">{{ vol }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No external storage volumes mapped for this service.</p>
          </div>

          <h4 class="mt-4">Environment Configuration</h4>
          <div v-if="service.envVars && service.envVars.length > 0" class="env-list">
            <div v-for="(env, idx) in service.envVars" :key="idx" class="env-item">
              <span class="env-var code-font">{{ env }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>Default environment variables applied from template.</p>
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
  return props.service ? `${props.service.color}22` : '#333';
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
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
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
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.12);
  color: var(--accent-success);
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-success);
  box-shadow: 0 0 6px var(--accent-success);
}

.modal-subtitle {
  font-size: 0.825rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
}

.metric-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.metric-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-indigo, #818cf8);
  text-decoration: none;
  transition: all 0.15s ease;
}

.metric-link:hover {
  color: #a5b4fc;
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
}

.tab-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.04);
}

.tab-btn.active {
  color: var(--text-primary);
  background: var(--bg-surface);
  border: 1px solid var(--border-color-hover);
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
}

p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
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
}

.text-success {
  color: var(--accent-success);
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
  color: #fbbf24;
}

.empty-state {
  padding: 1rem;
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  border: 1px dashed var(--border-color);
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
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
