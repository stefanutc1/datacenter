<template>
  <div class="matrix-view">
    <div class="matrix-header">
      <div>
        <h2 class="matrix-title">soc capability &amp; port matrix</h2>
        <p class="matrix-subtitle">complete registry of network listening sockets, direct endpoints, and default access credentials.</p>
      </div>
      <div class="matrix-search">
        <input v-model="search" type="text" placeholder="filter ports, tools, credentials..." />
      </div>
    </div>

    <div class="table-container">
      <table class="matrix-table">
        <thead>
          <tr>
            <th>port</th>
            <th>tool / sensor</th>
            <th>category</th>
            <th>default user</th>
            <th>auth / secret status</th>
            <th>mitre att&amp;ck</th>
            <th class="text-right">action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tool in filteredTools" :key="tool.id" @click="$emit('select', tool)">
            <td>
              <code v-if="tool.webPort" class="port-code">:{{ tool.webPort }}</code>
              <code v-else class="port-code cli-code">cli / nids</code>
            </td>
            <td>
              <div class="tool-cell">
                <img v-if="tool.logo" :src="getLogoUrl(tool.logo)" :alt="tool.name" class="table-logo" />
                <span class="tool-name">{{ tool.name }}</span>
              </div>
            </td>
            <td>
              <span class="cat-badge">{{ tool.category }}</span>
            </td>
            <td>
              <code class="user-code">{{ tool.credentials?.user || 'n/a' }}</code>
            </td>
            <td>
              <code class="pass-code">{{ tool.credentials?.pass || 'n/a' }}</code>
            </td>
            <td>
              <span class="mitre-pill">{{ tool.mitre ? tool.mitre.split(',')[0] : 'n/a' }}</span>
            </td>
            <td class="text-right">
              <button class="inspect-btn" @click.stop="$emit('select', tool)">inspect </button>
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
  tools: {
    type: Array,
    required: true
  }
});

defineEmits(['select']);

const search = ref('');

const filteredTools = computed(() => {
  if (!search.value.trim()) return props.tools;
  const q = search.value.toLowerCase();
  return props.tools.filter(t => 
    t.name.toLowerCase().includes(q) ||
    (t.webPort && t.webPort.toString().includes(q)) ||
    t.category.toLowerCase().includes(q) ||
    (t.credentials && t.credentials.user.toLowerCase().includes(q)) ||
    (t.mitre && t.mitre.toLowerCase().includes(q))
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
.matrix-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.matrix-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.matrix-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  text-transform: lowercase;
}

.matrix-subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: lowercase;
}

.matrix-search input {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  color: var(--text-primary);
  width: 260px;
  text-transform: lowercase;
}

.matrix-search input:focus {
  outline: none;
  border-color: var(--accent-primary-light);
}

.table-container {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.matrix-table th {
  padding: 0.85rem 1.25rem;
  font-size: 0.72rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
  background: rgba(0, 0, 0, 0.2);
  text-transform: lowercase;
}

.matrix-table td {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid rgba(214, 182, 186, 0.04);
  font-size: 0.85rem;
  text-transform: lowercase;
}

.matrix-table tbody tr {
  transition: background 0.15s ease;
  cursor: pointer;
}

.matrix-table tbody tr:hover {
  background: rgba(62, 42, 44, 0.25);
}

.port-code {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--accent-cyan);
  background: rgba(62, 42, 44, 0.45);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(214, 182, 186, 0.15);
}

.port-code.cli-code {
  color: var(--text-muted);
  background: rgba(214, 182, 186, 0.05);
}

.tool-cell {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.table-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.tool-name {
  font-weight: 600;
  color: var(--text-primary);
  text-transform: lowercase;
}

.cat-badge {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-secondary);
  background: rgba(214, 182, 186, 0.05);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: lowercase;
}

.user-code {
  color: var(--text-primary);
  font-size: 0.8rem;
}

.pass-code {
  color: var(--accent-amber);
  font-size: 0.8rem;
  font-weight: 600;
}

.mitre-pill {
  font-size: 0.72rem;
  font-family: var(--font-mono);
  color: var(--accent-red);
}

.text-right {
  text-align: right;
}

.inspect-btn {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: #f5ecec;
  background: #3e2a2c;
  border: 1px solid rgba(214, 182, 186, 0.25);
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
  text-transform: lowercase;
}

.inspect-btn:hover {
  background: #54393c;
}
</style>
