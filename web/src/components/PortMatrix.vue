<template>
  <div class="port-matrix-view fade-in">
    <div class="matrix-header">
      <div>
        <h2 class="section-title">port allocation directory &amp; matrix</h2>
        <p class="section-desc">host port mapping, container bindings, and protocol definitions across all homelab microservices.</p>
      </div>

      <div class="matrix-search-box">
        <svg class="svg-icon-xs text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="filter by port, service name, or container..." 
          class="matrix-search-input"
        />
      </div>
    </div>

    <div class="table-container glass-panel">
      <table class="port-table">
        <thead>
          <tr>
            <th>port</th>
            <th>local domain (.lan)</th>
            <th>direct ip endpoint</th>
            <th>service name</th>
            <th>category</th>
            <th>container</th>
            <th class="text-right">actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="svc in filteredServices" :key="svc.id" class="port-row">
            <td>
              <span class="port-tag code-font">:{{ svc.port }}</span>
            </td>
            <td>
              <a v-if="svc.domain" :href="svc.domainUrl || svc.internalUrl" target="_blank" rel="noopener noreferrer" class="domain-tag code-font">
                {{ svc.domain }} ↗
              </a>
              <span v-else class="text-muted">-</span>
            </td>
            <td>
              <a v-if="svc.ip" :href="svc.ipUrl" target="_blank" rel="noopener noreferrer" class="ip-tag code-font">
                {{ svc.ip }}:{{ svc.port }} ↗
              </a>
              <span v-else class="text-muted">-</span>
            </td>
            <td>
              <div class="svc-name-cell">
                <img v-if="svc.logo" :src="getLogoUrl(svc.logo)" :alt="svc.name" class="matrix-logo-img" />
                <span v-else class="svc-name-dot" :style="{ backgroundColor: svc.color }"></span>
                <span class="svc-name-text">{{ svc.name }}</span>
              </div>
            </td>
            <td>
              <span class="cat-pill">{{ svc.category }}</span>
            </td>
            <td>
              <code class="container-tag">{{ svc.containerName }}</code>
            </td>
            <td class="text-right">
              <button class="btn-inspect" @click="$emit('select', svc)">
                view wiki
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  services: {
    type: Array,
    required: true
  }
});

defineEmits(['select']);

const searchQuery = ref('');

const sortedServices = computed(() => {
  return [...props.services].sort((a, b) => a.port - b.port);
});

const filteredServices = computed(() => {
  if (!searchQuery.value.trim()) return sortedServices.value;
  const q = searchQuery.value.toLowerCase();
  return sortedServices.value.filter(s => 
    s.port.toString().includes(q) ||
    s.name.toLowerCase().includes(q) ||
    s.containerName.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q)
  );
});

function getLogoUrl(logo) {
  if (!logo) return '';
  if (logo.startsWith('http')) return logo;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${base}/${logo.replace(/^\//, '')}`;
}
</script>

<style scoped>
.port-matrix-view {
  padding-bottom: 2rem;
}

.matrix-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: lowercase;
}

.section-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  text-transform: lowercase;
}

.matrix-search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 320px;
}

.matrix-search-input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.825rem;
  outline: none;
  transition: all 0.2s ease;
}

.matrix-search-input:focus {
  border-color: var(--accent-primary-light);
  box-shadow: 0 0 12px rgba(142, 94, 99, 0.35);
}

.matrix-search-box .svg-icon-xs {
  position: absolute;
  left: 0.75rem;
}

.table-container {
  overflow-x: auto;
  padding: 0.5rem;
}

.port-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
}

.port-table th {
  padding: 0.85rem 1rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
  text-transform: lowercase;
}

.port-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(214, 182, 186, 0.06);
  color: var(--text-secondary);
  vertical-align: middle;
}

.port-row:hover {
  background: rgba(62, 42, 44, 0.25);
}

.port-tag {
  font-weight: 700;
  color: var(--accent-cyan);
  background: rgba(62, 42, 44, 0.5);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(214, 182, 186, 0.15);
  display: inline-block;
}

.domain-tag, .ip-tag {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.8rem;
  transition: color 0.15s ease;
  text-transform: lowercase;
}

.domain-tag:hover, .ip-tag:hover {
  color: var(--accent-cyan);
  text-decoration: underline;
}

.svc-name-cell {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.matrix-logo-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3));
}

.svc-name-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.svc-name-text {
  font-weight: 600;
  color: var(--text-primary);
  text-transform: lowercase;
}

.cat-pill {
  font-size: 0.725rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  color: var(--text-muted);
  text-transform: lowercase;
}

.container-tag {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: rgba(0, 0, 0, 0.2);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  text-transform: lowercase;
}

.btn-inspect {
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.15s ease;
  text-transform: lowercase;
}

.btn-inspect:hover {
  background: #3e2a2c;
  color: #f5ecec;
  border-color: rgba(214, 182, 186, 0.3);
}

.text-right { text-align: right; }
.code-font { font-family: var(--font-mono); }
.svg-icon-xs { width: 14px; height: 14px; }
</style>
