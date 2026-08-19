<template>
  <div class="topology-view fade-in">
    <div class="topology-header">
      <div>
        <h2 class="section-title">network architecture &amp; subnet topology</h2>
        <p class="section-desc">visual segmentation of homelab vlans, hypervisor hosts, compute clusters, and zero-trust mesh overlay.</p>
      </div>
      <div class="overlay-badge">
        <span class="pulse-dot"></span>
        <span>mesh: tailscale wireguard (100.64.0.0/10)</span>
      </div>
    </div>

    <div class="vlan-grid">
      <div v-for="vlan in topology.vlans" :key="vlan.id" class="vlan-card glass-panel">
        <div class="vlan-top" :style="{ borderLeftColor: vlan.color }">
          <div class="vlan-header-info">
            <h3 class="vlan-name">{{ vlan.name }}</h3>
            <div class="vlan-pills">
              <span class="vlan-pill subnet">{{ vlan.subnet }}</span>
              <span class="vlan-pill gw">gw: {{ vlan.gateway }}</span>
            </div>
          </div>
          <p class="vlan-desc">{{ vlan.description }}</p>
        </div>

        <div class="devices-box">
          <h4 class="devices-title">connected nodes &amp; workloads</h4>
          <div class="devices-list">
            <div v-for="dev in vlan.devices" :key="dev.ip" class="device-row">
              <div class="device-main">
                <span class="device-dot" :style="{ backgroundColor: vlan.color }"></span>
                <span class="device-name">{{ dev.name }}</span>
              </div>
              <div class="device-meta">
                <span class="device-role">{{ dev.role }}</span>
                <span class="device-ip code-font">{{ dev.ip }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Storage & Ingress Architecture Callout -->
    <div class="arch-notes-panel glass-panel mt-6">
      <div class="arch-col">
        <h3 class="arch-heading">
          <svg class="svg-icon-sm text-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
          ingress &amp; security layer
        </h3>
        <p>traffic arrives via local opnsense nat and tailscale subnet router. nginx proxy manager inspects ssl certificates and enforces forward-authentication via authelia before routing packets to internal docker bridges.</p>
      </div>

      <div class="arch-col">
        <h3 class="arch-heading">
          <svg class="svg-icon-sm text-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          nfs storage &amp; backup pipelines
        </h3>
        <p>storage is centralized on openmediavault via nfs exports (500gb hdd). automated proxmox backup server and restic pipelines backup containers and vms with runbooks documented in trilium notes.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { networkTopology as topology } from '../data/topology.js';
</script>

<style scoped>
.topology-view {
  padding-bottom: 2rem;
}

.topology-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
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

.overlay-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  background: rgba(62, 42, 44, 0.45);
  border: 1px solid rgba(214, 182, 186, 0.2);
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: lowercase;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-emerald);
  animation: pulseGlow 2s infinite;
}

.vlan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1.25rem;
}

.vlan-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.vlan-top {
  border-left: 3px solid #3e2a2c;
  padding-left: 0.875rem;
  margin-bottom: 1rem;
}

.vlan-header-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.vlan-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: lowercase;
}

.vlan-pills {
  display: flex;
  gap: 0.35rem;
}

.vlan-pill {
  font-family: var(--font-mono);
  font-size: 0.725rem;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  text-transform: lowercase;
}

.vlan-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.4rem;
  line-height: 1.4;
  text-transform: lowercase;
}

.devices-box {
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  border: 1px solid var(--border-color);
}

.devices-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: lowercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.devices-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.device-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  padding: 0.3rem 0.4rem;
  border-radius: var(--radius-sm);
  transition: background 0.15s ease;
}

.device-row:hover {
  background: rgba(255, 255, 255, 0.04);
}

.device-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.device-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.device-name {
  font-weight: 500;
  color: var(--text-primary);
  text-transform: lowercase;
}

.device-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.device-role {
  color: var(--text-muted);
  font-size: 0.75rem;
  text-transform: lowercase;
}

.device-ip {
  color: var(--accent-cyan);
  font-size: 0.75rem;
}

.arch-notes-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
}

.arch-heading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-transform: lowercase;
}

.arch-col p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.55;
  text-transform: lowercase;
}

.svg-icon-sm {
  width: 18px;
  height: 18px;
}

.text-cyan {
  color: var(--accent-cyan);
}

.text-purple {
  color: #baa6a8;
}

.mt-6 {
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .arch-notes-panel {
    grid-template-columns: 1fr;
  }
}
</style>
