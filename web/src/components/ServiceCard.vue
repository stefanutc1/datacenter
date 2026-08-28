<template>
  <div 
    class="service-card glass-panel" 
    :class="{ 'favorite': isFavorite, 'card-hovered': isHovered }" 
    @click="$emit('open-modal', service)"
    @mousemove="handleMouseMove"
    @mouseenter="isHovered = true"
    @mouseleave="handleMouseLeave"
    :style="cardStyle"
  >
    <!-- Dynamic Glowing Neon Border Aura -->
    <div class="card-glow-aura" :style="{ background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${service.color || '#3e2a2c'}44, transparent 70%)` }"></div>

    <div class="card-header">
      <div class="service-icon-box" :style="{ backgroundColor: iconBgColor, color: service.color || 'var(--text-primary)' }">
        <img v-if="service.logo" :src="getLogoUrl(service.logo)" :alt="service.name" class="service-logo-img" />
        <svg v-else class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/></svg>
      </div>

      <div class="header-details">
        <div class="title-row">
          <h3 class="service-title">{{ service.name }}</h3>
          <span class="status-indicator online" title="Status: Online & Ready"></span>
        </div>
        <span class="category-tag">{{ categoryLabel }}</span>
      </div>

      <button class="fav-btn" :class="{ active: isFavorite }" @click.stop="$emit('toggle-fav', service.id)" title="Toggle Favorite">
        <svg class="svg-icon-sm" viewBox="0 0 24 24" :fill="isFavorite ? '#f39c12' : 'none'" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </button>
    </div>

    <p class="service-desc">{{ service.description }}</p>

    <!-- Network Endpoints Section -->
    <div class="endpoints-box">
      <!-- Domain Endpoint (.lan) -->
      <a 
        v-if="service.domain" 
        :href="service.domainUrl" 
        target="_blank" 
        rel="noopener noreferrer"
        class="endpoint-chip domain-chip" 
        @click.stop
        :title="'Open Domain: ' + service.domain"
      >
        <span class="chip-badge lan-badge">lan</span>
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
        :title="'Open Direct IP: ' + service.ip + ':' + service.port"
      >
        <span class="chip-badge ip-badge">ip</span>
        <span class="chip-text">{{ service.ip }}:{{ service.port }}</span>
        <svg class="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
      </a>
    </div>

    <!-- Tags Row -->
    <div class="tags-row">
      <span v-for="tag in service.tags.slice(0, 3)" :key="tag" class="tag-pill">{{ tag }}</span>
      <span v-if="service.tags.length > 3" class="tag-more">+{{ service.tags.length - 3 }}</span>
    </div>

    <!-- Card Action Footer -->
    <div class="card-footer">
      <div class="tech-spec">
        <span class="spec-label">Container:</span>
        <code class="spec-val">{{ service.containerName }}</code>
      </div>
      <button class="inspect-btn" title="Inspect Service Specs">
        <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        Inspect
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  service: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
});

defineEmits(['toggle-fav', 'open-modal']);

const isHovered = ref(false);
const rotateX = ref(0);
const rotateY = ref(0);
const glowX = ref(50);
const glowY = ref(50);

const handleMouseMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  // 3D tilt calculation
  rotateX.value = ((y - centerY) / centerY) * -7;
  rotateY.value = ((x - centerX) / centerX) * 7;
  
  glowX.value = (x / rect.width) * 100;
  glowY.value = (y / rect.height) * 100;
};

const handleMouseLeave = () => {
  isHovered.value = false;
  rotateX.value = 0;
  rotateY.value = 0;
};

const cardStyle = computed(() => {
  if (!isHovered.value) {
    return {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease, border-color 0.3s ease'
    };
  }
  return {
    transform: `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale3d(1.025, 1.025, 1.025) translateZ(10px)`,
    transition: 'transform 0.1s ease-out, box-shadow 0.2s ease, border-color 0.2s ease',
    borderColor: props.service.color || 'var(--border-color-hover)'
  };
});

const iconBgColor = computed(() => {
  if (props.service.color) {
    return `${props.service.color}18`;
  }
  return 'rgba(214, 182, 186, 0.08)';
});

const categoryLabel = computed(() => {
  const map = {
    ai: 'AI Control',
    media: 'Media',
    automation: 'Automation',
    storage: 'Storage',
    security: 'Security',
    monitoring: 'Observability',
    network: 'Networking',
    productivity: 'Productivity'
  };
  return map[props.service.category] || props.service.category;
});

const getLogoUrl = (logo) => {
  if (!logo) return null;
  if (logo.startsWith('http')) return logo;
  return `./icons/${logo}`;
};
</script>

<style scoped>
.service-card {
  position: relative;
  padding: 1.25rem;
  border-radius: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform;
}

.card-glow-aura {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 14px;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.service-card:hover .card-glow-aura {
  opacity: 1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  position: relative;
  z-index: 1;
}

.service-icon-box {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease;
}

.service-card:hover .service-icon-box {
  transform: scale(1.08) translateZ(8px);
}

.service-logo-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
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
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-primary);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator.online {
  background-color: #2ecc71;
  box-shadow: 0 0 8px #2ecc71;
}

.category-tag {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.fav-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.fav-btn:hover {
  color: #f39c12;
  transform: scale(1.15);
}

.fav-btn.active {
  color: #f39c12;
}

.service-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.45;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.endpoints-box {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
  z-index: 1;
}

.endpoint-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border-color);
  font-size: 0.75rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.endpoint-chip:hover {
  background: rgba(62, 42, 44, 0.4);
  border-color: var(--border-color-hover);
  transform: translateX(3px);
}

.chip-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
}

.lan-badge { background: rgba(52, 152, 219, 0.2); color: #3498db; }
.ip-badge { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }

.chip-text {
  flex: 1;
  font-family: var(--font-mono);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chip-icon {
  width: 12px;
  height: 12px;
  opacity: 0.6;
}

.tags-row {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.tag-pill {
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  background: rgba(214, 182, 186, 0.08);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
}

.tag-more {
  font-size: 0.65rem;
  color: var(--text-muted);
  padding: 0.15rem 0.3rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.6rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.75rem;
  position: relative;
  z-index: 1;
}

.tech-spec {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.spec-label {
  color: var(--text-muted);
  font-size: 0.7rem;
}

.spec-val {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.2);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
}

.inspect-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.inspect-btn:hover {
  color: var(--text-primary);
}

.svg-icon { width: 22px; height: 22px; }
.svg-icon-sm { width: 16px; height: 16px; }
.svg-icon-xs { width: 12px; height: 12px; }
</style>
