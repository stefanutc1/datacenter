<template>
  <div class="service-card glass-panel" :class="{ 'favorite': isFavorite }" @click="$emit('select', service)">
    <div class="card-header">
      <div class="service-icon-box" :style="{ backgroundColor: iconBgColor, color: service.color }">
        <img v-if="service.logo" :src="getLogoUrl(service.logo)" :alt="service.name" class="service-logo-img" />
        <svg v-else class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/></svg>
      </div>

      <div class="header-details">
        <div class="title-row">
          <h3 class="service-title">{{ service.name }}</h3>
          <span class="status-indicator online" title="Status: Online"></span>
        </div>
        <span class="category-tag">{{ categoryLabel }}</span>
      </div>

      <button class="fav-btn" :class="{ active: isFavorite }" @click.stop="$emit('toggle-fav', service.id)" title="Toggle Favorite">
        <svg class="svg-icon-sm" viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </button>
    </div>

    <p class="service-desc">{{ service.description }}</p>

    <!-- Network Endpoints Section (Domain + IP) -->
    <div class="endpoints-box">
      <!-- Domain Endpoint (.lan) -->
      <a 
        v-if="service.domain" 
        :href="service.domainUrl" 
        target="_blank" 
        rel="noopener noreferrer"
        class="endpoint-chip domain-chip" 
        @click.stop
        :title="'Open local domain: ' + service.domain"
      >
        <span class="chip-badge lan-badge">LAN</span>
        <span class="chip-text">{{ service.domain }}</span>
        <svg class="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
      </a>

      <!-- Direct IP Endpoint (:port) -->
      <a 
        v-if="service.ip" 
        :href="service.ipUrl" 
        target="_blank" 
        rel="noopener noreferrer"
        class="endpoint-chip ip-chip" 
        @click.stop
        :title="'Open direct IP: ' + service.ip + ':' + service.port"
      >
        <span class="chip-badge ip-badge">IP</span>
        <span class="chip-text">{{ service.ip }}:{{ service.port }}</span>
        <svg class="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
      </a>
    </div>

    <div class="tags-row">
      <span v-for="tag in service.tags.slice(0, 3)" :key="tag" class="tag-pill">{{ tag }}</span>
      <span v-if="service.tags.length > 3" class="tag-more">+{{ service.tags.length - 3 }}</span>
    </div>

    <div class="card-footer">
      <div class="port-badge" :title="'Host Port: ' + service.port">
        <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        <span>:{{ service.port }}</span>
      </div>

      <div class="action-buttons">
        <button class="btn-wiki" @click.stop="$emit('select', service)">
          <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          Wiki &amp; Docs
        </button>
        
        <a :href="service.domainUrl || service.internalUrl" target="_blank" rel="noopener noreferrer" class="btn-open" @click.stop title="Open Service Web UI">
          <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  service: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  }
});

defineEmits(['select', 'toggle-fav']);

const iconBgColor = computed(() => {
  return `${props.service.color}18`;
});

const categoryLabel = computed(() => {
  const match = props.categories.find(c => c.id === props.service.category);
  return match ? match.name : props.service.category;
});

function getLogoUrl(logo) {
  if (!logo) return '';
  if (logo.startsWith('http')) return logo;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return `${base}/${logo.replace(/^\//, '')}`;
}
</script>

<style scoped>
.service-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
  min-height: 250px;
}

.service-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg), 0 0 20px rgba(99, 102, 241, 0.15);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  margin-bottom: 0.75rem;
  position: relative;
}

.service-icon-box {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}

.service-logo-img {
  width: 26px;
  height: 26px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.svg-icon {
  width: 22px;
  height: 22px;
}

.header-details {
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.service-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-tag {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator.online {
  background-color: var(--accent-emerald);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
}

.fav-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.fav-btn:hover {
  color: #f1c40f;
  background: rgba(241, 196, 15, 0.1);
}

.fav-btn.active {
  color: #f1c40f;
}

.service-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.45;
  margin: 0 0 0.85rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Endpoints Container */
.endpoints-box {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.85rem;
  background: rgba(15, 23, 42, 0.4);
  padding: 0.5rem 0.65rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.endpoint-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-family: var(--font-mono, monospace);
  font-size: 0.78rem;
  padding: 0.2rem 0.35rem;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.endpoint-chip:hover {
  background: rgba(255, 255, 255, 0.06);
}

.chip-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  text-transform: uppercase;
}

.lan-badge {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.ip-badge {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.chip-text {
  color: var(--text-primary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.chip-icon {
  width: 12px;
  height: 12px;
  color: var(--text-muted);
  flex-shrink: 0;
  opacity: 0.7;
}

.endpoint-chip:hover .chip-icon {
  color: #818cf8;
  opacity: 1;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.tag-pill {
  font-size: 0.7rem;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.tag-more {
  font-size: 0.7rem;
  color: var(--text-muted);
  align-self: center;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--glass-border);
  gap: 0.5rem;
}

.port-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-family: var(--font-mono, monospace);
  color: var(--accent-indigo);
  background: rgba(99, 102, 241, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-wiki {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-wiki:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-open {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: var(--accent-indigo);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
}

.btn-open:hover {
  background: var(--accent-indigo-hover, #4f46e5);
  transform: scale(1.05);
}

.svg-icon-sm {
  width: 16px;
  height: 16px;
}

.svg-icon-xs {
  width: 14px;
  height: 14px;
}
</style>
