<template>
  <div class="hardware-view fade-in">
    <div class="hardware-header">
      <div>
        <h2 class="section-title">Physical Infrastructure &amp; Hypervisor Nodes</h2>
        <p class="section-desc">Real hardware specifications, CPU/GPU compute, memory budgets, and storage tiers derived directly from <code>hardware/hardware.md</code>.</p>
      </div>
      <div class="cluster-summary-badge">
        <span class="pulse-indicator"></span>
        <span>3 Physical Nodes &bull; 14 CPU Cores &bull; 18 GB RAM &bull; ~1.5 TB Total Storage</span>
      </div>
    </div>

    <div class="nodes-grid">
      <div 
        v-for="(node, index) in nodes" 
        :key="node.id" 
        class="node-card glass-panel anim-card"
        :style="{ animationDelay: `${index * 120}ms` }"
      >
        <!-- Node Header -->
        <div class="node-card-header">
          <div class="node-title-group">
            <div class="node-avatar" :style="{ backgroundColor: node.badgeColor + '20', color: node.badgeColor }">
              <svg class="svg-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="8" x="2" y="2" rx="2" ry="2"/>
                <rect width="20" height="8" x="2" y="14" rx="2" ry="2"/>
                <line x1="6" x2="6.01" y1="6" y2="6"/>
                <line x1="6" x2="6.01" y1="18" y2="18"/>
              </svg>
            </div>
            <div>
              <div class="node-title-row">
                <h3 class="node-name code-font">{{ node.name }}</h3>
                <span class="node-role-badge" :style="{ borderColor: node.badgeColor + '60', color: node.badgeColor }">
                  {{ node.displayName }}
                </span>
              </div>
              <p class="node-os-text">{{ node.os }} &bull; {{ node.virtualization }}</p>
            </div>
          </div>
          <span class="mesh-pill">{{ node.mesh }}</span>
        </div>

        <!-- Node Hardware Specs List -->
        <div class="specs-box">
          <h4 class="specs-title">Hardware Specifications</h4>
          <div class="specs-grid">
            <div class="spec-item" v-if="node.specs.machine">
              <span class="spec-label">CHASSIS / MODEL</span>
              <span class="spec-val">{{ node.specs.machine }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">PROCESSOR (CPU)</span>
              <span class="spec-val text-cyan">{{ node.specs.cpu }}</span>
            </div>
            <div class="spec-item" v-if="node.specs.gpu">
              <span class="spec-label">GRAPHICS / ACCELERATOR</span>
              <span class="spec-val text-emerald">{{ node.specs.gpu }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">SYSTEM MEMORY (RAM)</span>
              <span class="spec-val text-amber">{{ node.specs.ram }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">STORAGE CAPACITY</span>
              <span class="spec-val text-purple">{{ node.specs.storage }}</span>
            </div>
            <div class="spec-item" v-if="node.specs.psu">
              <span class="spec-label">POWER SUPPLY (PSU)</span>
              <span class="spec-val text-muted">{{ node.specs.psu }}</span>
            </div>
          </div>
        </div>

        <!-- Capacity Notes & Constraints -->
        <div class="capacity-box">
          <h4 class="capacity-title">
            <svg class="svg-icon-xs text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            Capacity Constraints &amp; Reasoning
          </h4>
          <ul class="capacity-list">
            <li v-for="(note, idx) in node.capacityNotes" :key="idx">{{ note }}</li>
          </ul>
        </div>

        <!-- Active Workloads -->
        <div class="workloads-box">
          <h4 class="workloads-title">Assigned Roles &amp; Workloads</h4>
          <div class="workload-chips">
            <span v-for="(workload, idx) in node.workloads" :key="idx" class="workload-chip">
              <span class="chip-dot" :style="{ backgroundColor: node.badgeColor }"></span>
              {{ workload }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { hardwareNodes as nodes } from '../data/hardware.js';
</script>

<style scoped>
.hardware-view {
  padding-bottom: 2rem;
}

.hardware-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-family: var(--font-serif);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.section-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.35rem;
}

.cluster-summary-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  font-size: 0.825rem;
  font-weight: 500;
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.pulse-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-success);
  box-shadow: 0 0 8px var(--accent-success);
  animation: pulseGlow 2s infinite ease-in-out;
}

.nodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
}

.node-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: var(--radius-xl);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
}

.node-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), 0 0 25px rgba(99, 102, 241, 0.12);
  border-color: var(--border-color-hover);
}

.node-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.node-title-group {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.node-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.node-title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.node-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
}

.node-role-badge {
  font-size: 0.725rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid;
}

.node-os-text {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.mesh-pill {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.specs-box {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.specs-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.specs-grid {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.spec-label {
  font-size: 0.675rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.spec-val {
  font-size: 0.85rem;
  font-weight: 500;
  font-family: var(--font-mono);
}

.capacity-box {
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: var(--radius-md);
  padding: 0.875rem 1rem;
  margin-bottom: 1rem;
}

.capacity-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #fbbf24;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.capacity-list {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.capacity-list li {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.45;
  position: relative;
  padding-left: 1rem;
}

.capacity-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #fbbf24;
}

.workloads-box {
  margin-top: 0.5rem;
}

.workloads-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.workload-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.workload-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  color: var(--text-secondary);
}

.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.text-cyan { color: #22d3ee; }
.text-emerald { color: #34d399; }
.text-amber { color: #fbbf24; }
.text-purple { color: #c084fc; }

.svg-icon-md { width: 24px; height: 24px; }
.svg-icon-xs { width: 14px; height: 14px; }
.code-font { font-family: var(--font-mono); }
</style>
