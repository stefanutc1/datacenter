<template>
  <div class="tool-card" :style="{ '--tool-color': tool.color }" @click="$emit('select', tool)">
    <div class="card-header">
      <div class="tool-icon-box" :style="{ backgroundColor: iconBgColor }">
        <img v-if="tool.logo" :src="getLogoUrl(tool.logo)" :alt="tool.name" class="tool-logo-img" />
        <span v-else class="fallback-icon-dot"></span>
      </div>
      <div class="status-indicator">
        <span class="status-badge" :class="tool.status.toLowerCase()">
          <span class="status-dot"></span>
          {{ tool.status }}
        </span>
      </div>
    </div>

    <div class="card-body">
      <h3 class="tool-title">{{ tool.name }}</h3>
      <p class="tool-role">{{ tool.role }}</p>
      
      <div class="meta-row">
        <span class="category-tag">{{ tool.category }}</span>
        <span v-if="tool.webPort" class="port-tag">port :{{ tool.webPort }}</span>
        <span v-else class="port-tag engine-tag">cli / engine</span>
      </div>

      <div class="credentials-bar" v-if="tool.credentials">
        <div class="cred-item">
          <span class="cred-label">user:</span>
          <span class="cred-val">{{ tool.credentials.user }}</span>
        </div>
        <div class="cred-item">
          <span class="cred-label">pass:</span>
          <span class="cred-val">{{ tool.credentials.pass }}</span>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <div class="endpoints-preview">
        <span v-if="tool.mitre" class="mitre-tag">mitre: {{ tool.mitre.split(',')[0] }}</span>
        <span v-else class="mitre-tag">sec-track</span>
      </div>
      <div class="action-btn" @click.stop="$emit('select', tool)">
        <span>inspect</span>
        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  tool: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);

const iconBgColor = computed(() => {
  return `${props.tool.color}15`;
});

function getLogoUrl(logo) {
  if (!logo) return '';
  if (logo.startsWith('http')) return logo;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${base}/${logo.replace(/^\//, '')}`;
}
</script>

<style scoped>
.tool-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  overflow: hidden;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--tool-color), transparent);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.tool-card:hover {
  transform: translateY(-3px);
  border-color: var(--border-color-hover);
  background: var(--bg-surface-hover);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6);
}

.tool-card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tool-icon-box {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(214, 182, 186, 0.15);
  background: rgba(62, 42, 44, 0.35);
}

.tool-logo-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

.fallback-icon-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent-cyan);
}

.status-badge {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  text-transform: lowercase;
  letter-spacing: 0.02em;
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

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
  box-shadow: 0 0 6px currentColor;
}

.card-body {
  flex: 1;
  margin-bottom: 1rem;
}

.tool-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.3rem;
  line-height: 1.3;
  text-transform: lowercase;
}

.tool-role {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 0.85rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-transform: lowercase;
}

.meta-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.85rem;
}

.category-tag {
  font-size: 0.65rem;
  font-family: var(--font-mono);
  font-weight: 700;
  background: rgba(214, 182, 186, 0.06);
  border: 1px solid var(--border-color);
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  text-transform: lowercase;
}

.port-tag {
  font-size: 0.65rem;
  font-family: var(--font-mono);
  font-weight: 700;
  background: rgba(62, 42, 44, 0.5);
  border: 1px solid rgba(214, 182, 186, 0.18);
  color: var(--accent-cyan);
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  text-transform: lowercase;
}

.port-tag.engine-tag {
  background: rgba(62, 42, 44, 0.3);
  border-color: rgba(214, 182, 186, 0.15);
  color: var(--text-secondary);
}

.credentials-bar {
  background: rgba(0, 0, 0, 0.25);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.6rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  font-family: var(--font-mono);
  text-transform: lowercase;
}

.cred-item {
  display: flex;
  gap: 0.3rem;
}

.cred-label {
  color: var(--text-muted);
}

.cred-val {
  color: var(--accent-amber);
  font-weight: 600;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border-color);
}

.mitre-tag {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  color: var(--accent-red);
  background: rgba(184, 85, 90, 0.12);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(184, 85, 90, 0.25);
  text-transform: lowercase;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-cyan);
  transition: transform 0.2s ease;
  text-transform: lowercase;
}

.arrow-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.tool-card:hover .arrow-icon {
  transform: translateX(3px);
}
</style>
