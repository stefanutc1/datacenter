<template>
  <div class="topology-view">
    <!-- Interactive Force-Directed Schematics Graph -->
    <SchematicGraph />

    <div class="view-header">
      <h2 class="view-title">zero-trust network microsegmentation</h2>
      <p class="view-subtitle">strict vlan isolation zones enforced between deployment controller, detection nodes, and target sandboxes.</p>
    </div>

    <div class="zones-grid">
      <div v-for="zone in networkZones" :key="zone.name" class="zone-card" :style="{ '--zone-color': zone.color }">
        <div class="zone-header">
          <div>
            <span class="cidr-badge">{{ zone.cidr }}</span>
            <h3 class="zone-name">{{ zone.name }}</h3>
          </div>
          <span class="zone-dot"></span>
        </div>
        <p class="zone-desc">{{ zone.description }}</p>

        <div class="nodes-list">
          <div v-for="node in zone.nodes" :key="node.hostname" class="node-item">
            <div class="node-main">
              <span class="node-host">{{ node.hostname }}</span>
              <span class="node-role">{{ node.role }}</span>
            </div>
            <div class="node-meta">
              <code class="node-ip">{{ node.ip }}</code>
              <span class="node-ports">{{ node.ports }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { networkZones } from '../data/topology.js';
import SchematicGraph from './SchematicGraph.vue';
</script>

<style scoped>
.topology-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  margin-bottom: 0.5rem;
}

.view-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  text-transform: lowercase;
}

.view-subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: lowercase;
}

.zones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
}

.zone-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.zone-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--zone-color);
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.cidr-badge {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--zone-color);
  background: rgba(214, 182, 186, 0.06);
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  display: inline-block;
  margin-bottom: 0.3rem;
  text-transform: lowercase;
}

.zone-name {
  font-size: 1.05rem;
  font-weight: 700;
  text-transform: lowercase;
}

.zone-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--zone-color);
  box-shadow: 0 0 8px var(--zone-color);
}

.zone-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 1rem;
  text-transform: lowercase;
}

.nodes-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: auto;
}

.node-item {
  background: var(--bg-base);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.65rem 0.85rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.node-main {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.node-host {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: lowercase;
}

.node-role {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.node-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
}

.node-ip {
  font-size: 0.75rem;
  color: var(--accent-cyan);
  font-weight: 600;
}

.node-ports {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: lowercase;
}
</style>
