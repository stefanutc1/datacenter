<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content" :style="{ '--tool-color': tool.color }">
      <div class="modal-header">
        <div class="header-left">
          <div class="tool-icon-box" :style="{ backgroundColor: iconBgColor }">
            <img v-if="tool.logo" :src="getLogoUrl(tool.logo)" :alt="tool.name" class="modal-logo-img" />
            <span v-else class="fallback-icon-dot"></span>
          </div>
          <div>
            <div class="header-badge-row">
              <span class="category-badge">{{ tool.category }}</span>
              <span class="status-badge" :class="tool.status.toLowerCase()">{{ tool.status }}</span>
              <span v-if="tool.webPort" class="port-badge">port :{{ tool.webPort }}</span>
            </div>
            <h2 class="modal-title">{{ tool.name }}</h2>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')"></button>
      </div>

      <div class="modal-body">
        <div class="modal-section">
          <h3>capability overview</h3>
          <p class="desc-text">{{ tool.description }}</p>
        </div>

        <div class="grid-two-col">
          <div class="modal-section">
            <h3>default lab credentials</h3>
            <div class="cred-table">
              <div class="cred-row">
                <span class="cred-k">username</span>
                <span class="cred-v">{{ tool.credentials?.user || 'n/a' }}</span>
              </div>
              <div class="cred-row">
                <span class="cred-k">password / secret</span>
                <span class="cred-v highlight">{{ tool.credentials?.pass || 'n/a' }}</span>
              </div>
              <div class="cred-row">
                <span class="cred-k">assigned role</span>
                <span class="cred-v">{{ tool.credentials?.role || 'operator' }}</span>
              </div>
            </div>
          </div>

          <div class="modal-section">
            <h3>mitre att&amp;ck &amp; tags</h3>
            <div class="mitre-box">
              <div class="mitre-header">
                <span class="mitre-label">techniques:</span>
                <span class="mitre-codes">{{ tool.mitre || 'enterprise att&ck' }}</span>
              </div>
              <div class="tag-cloud">
                <span v-for="tag in tool.tags" :key="tag" class="tool-tag">#{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-section" v-if="tool.quickCommand">
          <div class="code-header">
            <h3>quick execution command</h3>
            <button class="copy-btn" @click="copyCode(tool.quickCommand)">
              {{ copied ? ' copied' : 'copy command' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ tool.quickCommand }}</code></pre>
        </div>

        <div class="modal-section endpoints-section" v-if="tool.directUrl || tool.domainUrl">
          <h3>access endpoints</h3>
          <div class="endpoints-grid">
            <a v-if="tool.directUrl" :href="tool.directUrl" target="_blank" class="endpoint-card">
              <span class="ep-label">direct socket link</span>
              <span class="ep-val">{{ tool.directUrl }} </span>
            </a>
            <a v-if="tool.domainUrl" :href="tool.domainUrl" target="_blank" class="endpoint-card domain-card">
              <span class="ep-label">internal domain (.lan)</span>
              <span class="ep-val">{{ tool.domainUrl }} </span>
            </a>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">close inspector</button>
        <a v-if="tool.directUrl" :href="tool.directUrl" target="_blank" class="btn-primary">
          launch target 
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  tool: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);

const copied = ref(false);

const iconBgColor = computed(() => {
  return `${props.tool.color}20`;
});

function copyCode(code) {
  if (navigator && navigator.clipboard) {
    navigator.clipboard.writeText(code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
}

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
  inset: 0;
  background: rgba(4, 7, 13, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-content {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg), 0 0 40px -10px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  position: relative;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tool-icon-box {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(214, 182, 186, 0.15);
  background: rgba(62, 42, 44, 0.35);
}

.modal-logo-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.4));
}

.fallback-icon-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent-cyan);
}

.header-badge-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.category-badge {
  font-size: 0.65rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-muted);
  background: rgba(214, 182, 186, 0.06);
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  text-transform: lowercase;
}

.status-badge {
  font-size: 0.65rem;
  font-family: var(--font-mono);
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  text-transform: lowercase;
}

.status-badge.active {
  background: rgba(107, 158, 120, 0.15);
  color: var(--accent-green);
  border: 1px solid rgba(107, 158, 120, 0.3);
}

.status-badge.ready {
  background: rgba(62, 42, 44, 0.45);
  color: var(--accent-cyan);
  border: 1px solid rgba(214, 182, 186, 0.2);
}

.port-badge {
  font-size: 0.65rem;
  font-family: var(--font-mono);
  font-weight: 700;
  background: rgba(62, 42, 44, 0.5);
  color: var(--accent-cyan);
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  text-transform: lowercase;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  text-transform: lowercase;
}

.close-btn {
  font-size: 1.25rem;
  color: var(--text-muted);
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
}

.close-btn:hover {
  color: var(--text-primary);
  background: rgba(214, 182, 186, 0.08);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.modal-section h3 {
  font-size: 0.85rem;
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: lowercase;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
  margin-bottom: 0.6rem;
}

.desc-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  text-transform: lowercase;
}

.grid-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.cred-table {
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.cred-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  font-family: var(--font-mono);
  text-transform: lowercase;
}

.cred-k {
  color: var(--text-muted);
}

.cred-v {
  font-weight: 600;
  color: var(--text-primary);
}

.cred-v.highlight {
  color: var(--accent-amber);
}

.mitre-box {
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mitre-header {
  font-size: 0.78rem;
  font-family: var(--font-mono);
  display: flex;
  justify-content: space-between;
  text-transform: lowercase;
}

.mitre-label {
  color: var(--text-muted);
}

.mitre-codes {
  color: var(--accent-red);
  font-weight: 600;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tool-tag {
  font-size: 0.7rem;
  background: rgba(214, 182, 186, 0.06);
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-sm);
  color: var(--accent-cyan);
  text-transform: lowercase;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.copy-btn {
  font-size: 0.72rem;
  font-family: var(--font-mono);
  color: #f5ecec;
  background: #3e2a2c;
  border: 1px solid rgba(214, 182, 186, 0.25);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
  text-transform: lowercase;
}

.copy-btn:hover {
  background: #54393c;
}

.code-block {
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.85rem;
  font-size: 0.8rem;
  color: var(--accent-cyan);
  overflow-x: auto;
}

.endpoints-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.endpoint-card {
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  transition: all 0.15s ease;
}

.endpoint-card:hover {
  border-color: var(--border-color-hover);
  background: rgba(62, 42, 44, 0.3);
}

.ep-label {
  font-size: 0.68rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.ep-val {
  font-size: 0.8rem;
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--accent-cyan);
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary {
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: rgba(214, 182, 186, 0.06);
  border: 1px solid var(--border-color);
  text-transform: lowercase;
}

.btn-secondary:hover {
  background: rgba(214, 182, 186, 0.12);
  color: var(--text-primary);
}

.btn-primary {
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  color: #f5ecec;
  background: #3e2a2c;
  border: 1px solid rgba(214, 182, 186, 0.25);
  text-transform: lowercase;
}

.btn-primary:hover {
  background: #54393c;
}

@media (max-width: 640px) {
  .grid-two-col, .endpoints-grid {
    grid-template-columns: 1fr;
  }
}
</style>
