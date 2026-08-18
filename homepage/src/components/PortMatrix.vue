<template>
  <div class="port-matrix-view fade-in">
    <div class="matrix-header">
      <div>
        <h2 class="section-title">Port Allocation Directory &amp; Matrix</h2>
        <p class="section-desc">Host port mapping, container bindings, and protocol definitions across all homelab microservices.</p>
      </div>

      <div class="matrix-search-box">
        <svg class="svg-icon-xs text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Filter by port, service name, or container..." 
          class="matrix-search-input"
        />
      </div>
    </div>

    <div class="table-container glass-panel">
      <table class="port-table">
        <thead>
          <tr>
            <th>PORT</th>
            <th>LOCAL DOMAIN (.LAN)</th>
            <th>DIRECT IP ENDPOINT</th>
            <th>SERVICE NAME</th>
            <th>CATEGORY</th>
            <th>CONTAINER</th>
            <th class="text-right">ACTIONS</th>
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
                <span class="svc-name-dot" :style="{ backgroundColor: svc.color }"></span>
                <span class="svc-name-text">{{ svc.name }}</span>
              </div>
            </td>
            <td>
              <span class="cat-pill capitalize">{{ svc.category }}</span>
            </td>
            <td>
              <code class="container-tag">{{ svc.containerName }}</code>
            </td>
            <td class="text-right">
              <button class="btn-inspect" @click="$emit('select', svc)">
                View Wiki
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
</script>

<style scoped>
.port-matrix-view {
  padding-bottom: 2rem;
}

.matrix-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
}

.section-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.matrix-search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-md);
  width: 320px;
}

.matrix-search-input {
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 0.85rem;
  font-family: inherit;
  outline: none;
  width: 100%;
}

.table-container {
  overflow-x: auto;
  border-radius: var(--radius-lg);
}

.port-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
}

.port-table th {
  padding: 0.875rem 1.25rem;
  background: rgba(0, 0, 0, 0.25);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.725rem;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-color);
}

.port-table td {
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.port-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.port-tag {
  color: var(--accent-secondary);
  font-weight: 600;
  background: rgba(6, 182, 212, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(6, 182, 212, 0.2);
}

.svc-name-cell {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.svc-name-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.svc-name-text {
  font-weight: 600;
  color: var(--text-primary);
}

.cat-pill {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.55rem;
  border-radius: 12px;
  color: var(--text-muted);
}

.domain-tag {
  color: #818cf8;
  font-weight: 600;
  font-size: 0.8rem;
  text-decoration: none;
  background: rgba(99, 102, 241, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(99, 102, 241, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.15s ease;
}

.domain-tag:hover {
  background: rgba(99, 102, 241, 0.25);
  color: #c7d2fe;
}

.ip-tag {
  color: #34d399;
  font-weight: 600;
  font-size: 0.8rem;
  text-decoration: none;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(16, 185, 129, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.15s ease;
}

.ip-tag:hover {
  background: rgba(16, 185, 129, 0.25);
  color: #a7f3d0;
}

.container-tag {
  font-size: 0.8rem;
  color: #a855f7;
}

.endpoint-text {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.proto-tag {
  font-size: 0.725rem;
  font-family: var(--font-mono);
  color: var(--accent-success);
}

.btn-inspect {
  font-size: 0.775rem;
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all 0.15s ease;
}

.btn-inspect:hover {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
}

.text-right {
  text-align: right;
}

.svg-icon-xs {
  width: 14px;
  height: 14px;
}
</style>
