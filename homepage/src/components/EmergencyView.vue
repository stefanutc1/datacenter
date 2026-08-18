<template>
  <div class="emergency-view fade-in">
    <!-- Header Banner -->
    <div class="emergency-banner glass-panel">
      <div class="banner-left">
        <div class="emergency-icon-box">
          <svg class="svg-icon-lg pulse-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <div class="badge-row">
            <span class="emergency-badge">SOP-PWR-10H</span>
            <span class="severity-badge">CRITICAL PROTOCOL</span>
          </div>
          <h2 class="emergency-title">Extended 10+ Hour Power Outage Standard Operating Procedure</h2>
          <p class="emergency-subtitle">Cascading graceful shutdown, physical battery/surge isolation, and staged cold-boot recovery hierarchy.</p>
        </div>
      </div>

      <div class="quick-actions">
        <button class="btn-emergency-action" @click="activePhase = 'shutdown'">
          <span>⚡ Cascading Shutdown</span>
        </button>
        <button class="btn-emergency-action" @click="activePhase = 'boot'">
          <span>🔌 Cold-Boot Sequence</span>
        </button>
      </div>
    </div>

    <!-- Timeline Phases Navigator -->
    <div class="phases-navigator">
      <button 
        v-for="phase in phases" 
        :key="phase.id"
        class="phase-nav-btn"
        :class="{ active: currentPhaseId === phase.id }"
        @click="currentPhaseId = phase.id"
      >
        <span class="phase-number">{{ phase.number }}</span>
        <div class="phase-meta">
          <span class="phase-timing">{{ phase.timing }}</span>
          <span class="phase-name">{{ phase.title }}</span>
        </div>
      </button>
    </div>

    <!-- Phase Content Cards -->
    <div class="phase-card-wrapper glass-panel">
      <!-- PHASE 1: Cascading Graceful Shutdown -->
      <div v-if="currentPhaseId === 'phase1'" class="phase-content">
        <div class="section-header">
          <h3>Phase 1: Automated &amp; Cascading Graceful Shutdown (T+0m – T+15m)</h3>
          <p>Executed by NUT (Network UPS Tools) upon grid loss or triggered manually via <code>/opt/homelab/scripts/emergency-shutdown.sh</code> to prevent ZFS pool journal corruption.</p>
        </div>

        <div class="tiers-grid">
          <div v-for="tier in shutdownTiers" :key="tier.tier" class="tier-card">
            <div class="tier-header">
              <span class="tier-pill" :style="{ background: tier.color + '22', color: tier.color }">{{ tier.tier }}</span>
              <span class="tier-time">{{ tier.timeWindow }}</span>
            </div>
            <h4 class="tier-name">{{ tier.name }}</h4>
            <p class="tier-desc">{{ tier.description }}</p>
            <div class="tier-targets">
              <span v-for="target in tier.targets" :key="target" class="target-tag">{{ target }}</span>
            </div>
            <div class="cmd-box">
              <code>{{ tier.command }}</code>
            </div>
          </div>
        </div>
      </div>

      <!-- PHASE 2: Extended 10+ Hour Outage Hardening -->
      <div v-else-if="currentPhaseId === 'phase2'" class="phase-content">
        <div class="section-header">
          <h3>Phase 2: Long-Term 10+ Hour Outage Hardening (T+15m – T+10h+)</h3>
          <p>Protecting hardware electronics from deep-discharge battery degradation and municipal grid restoration inrush surges.</p>
        </div>

        <div class="guidelines-grid">
          <div class="guideline-box danger-border">
            <div class="box-icon">🔌</div>
            <h4>Physical Surge Suppressor Isolation</h4>
            <p>Unplug the master PDU / surge protector from the wall outlet. When the utility grid returns after major blackouts, large voltage spikes (up to 400V+) occur during initial transformer re-energization.</p>
          </div>

          <div class="guideline-box warning-border">
            <div class="box-icon">🔋</div>
            <h4>UPS Battery Deep-Discharge Cutoff</h4>
            <p>Power off the physical UPS master switch once all nodes have cleanly shut down. Leaving the inverter running empty can drain lead-acid or LiFePO4 cells below their critical cutoff voltage, destroying battery chemistry.</p>
          </div>

          <div class="guideline-box info-border">
            <div class="box-icon">📡</div>
            <h4>Out-of-Band Telemetry &amp; Alerts</h4>
            <p>Emergency status alerts are dispatched over the secondary LTE/4G cellular gateway. An autonomous ESP32 battery sensor monitors line voltage and ambient server cabinet temperature.</p>
          </div>
        </div>
      </div>

      <!-- PHASE 3: Staged Cold-Boot Sequence -->
      <div v-else-if="currentPhaseId === 'phase3'" class="phase-content">
        <div class="section-header">
          <h3>Phase 3: Grid Restoration &amp; Staged Cold-Boot Sequence</h3>
          <p>Bring services online in strict dependency order via <code>/opt/homelab/scripts/cold-boot-sequence.sh</code> once grid power stabilizes.</p>
        </div>

        <div class="boot-steps-list">
          <div v-for="(step, idx) in bootSteps" :key="idx" class="boot-step-item">
            <div class="step-badge">{{ idx + 1 }}</div>
            <div class="step-body">
              <div class="step-title-row">
                <span class="step-name">{{ step.name }}</span>
                <span class="step-delay">{{ step.delay }}</span>
              </div>
              <p class="step-desc">{{ step.desc }}</p>
              <div class="cmd-box">
                <code>{{ step.cmd }}</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PHASE 4: Storage Integrity & Post-Outage Scrub -->
      <div v-else class="phase-content">
        <div class="section-header">
          <h3>Phase 4: Post-Recovery Integrity Scrub &amp; Diagnostics</h3>
          <p>Verify block-level ZFS checksums, database write-ahead logs, and container consistency.</p>
        </div>

        <div class="verification-grid">
          <div class="verify-card">
            <h4>1. ZFS Pool Integrity Scrub</h4>
            <p>Initiates a full block checksum verification across the entire NVMe/SATA ZFS pool.</p>
            <pre class="code-block"><code>zpool status -v
zpool scrub rpool</code></pre>
          </div>

          <div class="verify-card">
            <h4>2. Container Health &amp; Exited Processes</h4>
            <p>Identify any containers that failed automated restart or encountered volume lockups.</p>
            <pre class="code-block"><code>pct list
docker ps -a --filter "status=exited"</code></pre>
          </div>

          <div class="verify-card">
            <h4>3. PostgreSQL &amp; SQLite Consistency</h4>
            <p>Verify that write-ahead logs replayed cleanly and no tables were corrupted.</p>
            <pre class="code-block"><code>sudo -u postgres psql -c "SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database;"</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentPhaseId = ref('phase1');

const phases = [
  { id: 'phase1', number: '01', timing: 'T+0m – T+15m', title: 'Cascading Shutdown' },
  { id: 'phase2', number: '02', timing: 'T+15m – T+10h+', title: 'Hardware Isolation' },
  { id: 'phase3', number: '03', timing: 'Post-Restoration', title: 'Staged Cold Boot' },
  { id: 'phase4', number: '04', timing: 'Integrity Check', title: 'ZFS & Health Scrub' }
];

const shutdownTiers = [
  {
    tier: 'Tier 4',
    timeWindow: 'T+2 min',
    color: '#ef4444',
    name: 'Heavy Workloads & Media Suites',
    description: 'Stop resource-intensive encoding, transcode caches, and heavy container suites first to conserve battery.',
    targets: ['Plex (114)', 'Jellyfin (115)', 'Immich (116)', 'Torrent (117)', 'Media Stack (118-123)'],
    command: 'pct shutdown 114 115 116 117 118 119 120 121 122 123'
  },
  {
    tier: 'Tier 3',
    timeWindow: 'T+5 min',
    color: '#f59e0b',
    name: 'Workstations & Secondary VMs',
    description: 'Gracefully shutdown KVM guest OSes with disk sync before database teardown.',
    targets: ['Windows Server 2022 (201)', 'Ubuntu Server (202)'],
    command: 'qm shutdown 201 --timeout 30 && qm shutdown 202 --timeout 30'
  },
  {
    tier: 'Tier 2',
    timeWindow: 'T+8 min',
    color: '#3b82f6',
    name: 'Databases & Storage Flushes',
    description: 'Commit all active write transactions, flush write-ahead logs, and unmount network NFS shares.',
    targets: ['PostgreSQL (110)', 'MariaDB (111)', 'Redis (112)', 'Vaultwarden (107)', 'Nextcloud (106)'],
    command: 'pct shutdown 103 104 105 106 107 108 109 110 111 112 113'
  },
  {
    tier: 'Tier 1 & 0',
    timeWindow: 'T+12 min',
    color: '#10b981',
    name: 'Ingress, Router & Hypervisor',
    description: 'Stop reverse proxy, authentication, and core router before initiating host poweroff.',
    targets: ['NPM Ingress (101)', 'Authelia SSO (102)', 'Pi-hole DNS (100)', 'OPNsense VM (200)', 'PVE Host'],
    command: 'pct shutdown 101 102 100 && qm shutdown 200 && sync && poweroff'
  }
];

const bootSteps = [
  {
    name: 'Grid Stabilization Window',
    delay: 'Wait 5-10 min',
    desc: 'Verify grid voltage is clean 230V @ 50Hz. Re-engage master surge protector and power on UPS in bypass charging mode.',
    cmd: 'pve-hardware-poweron'
  },
  {
    name: 'Core Firewall & Gateway (OPNsense)',
    delay: 'Wait 30 sec',
    desc: 'Brings up WAN PPPoE/DHCP interface, VLAN routing, and internal DHCP lease daemon.',
    cmd: 'qm start 200'
  },
  {
    name: 'Internal DNS Resolution (Pi-hole)',
    delay: 'Wait 10 sec',
    desc: 'Resolves all local .lan domains and enables outbound upstream DNS forwarding.',
    cmd: 'pct start 100'
  },
  {
    name: 'Ingress Proxy & Identity Provider (NPM & Authelia)',
    delay: 'Wait 10 sec',
    desc: 'Establishes SSL termination and single-sign-on access control for all internal dashboards.',
    cmd: 'pct start 101 && pct start 102'
  },
  {
    name: 'Databases, Core Storage & Application Services',
    delay: 'Sequential 3s',
    desc: 'Mounts ZFS storage pools and starts core services and media suites in controlled intervals.',
    cmd: 'pct start 103..123 && qm start 201 202'
  }
];
</script>

<style scoped>
.emergency-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.emergency-banner {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  border-left: 4px solid var(--accent-danger);
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.emergency-icon-box {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-danger);
  flex-shrink: 0;
}

.svg-icon-lg {
  width: 28px;
  height: 28px;
}

.badge-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.emergency-badge {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--accent-danger);
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
}

.severity-badge {
  font-size: 0.65rem;
  font-family: var(--font-mono);
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.2);
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
}

.emergency-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.emergency-subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.quick-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.btn-emergency-action {
  padding: 0.6rem 1.1rem;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  box-shadow: inset 0 1px 0 var(--border-specular), var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-emergency-action:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-color-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.5), var(--shadow-glow);
}

/* Phases Navigator */
.phases-navigator {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.phase-nav-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: inset 0 1px 0 var(--border-specular), var(--shadow-sm);
}

.phase-nav-btn:hover {
  border-color: var(--border-color-hover);
  transform: translateY(-3px);
  box-shadow: inset 0 1px 0 var(--border-specular), 0 12px 24px -6px rgba(0, 0, 0, 0.6), var(--shadow-glow);
}

.phase-nav-btn.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(6, 182, 212, 0.12));
  border-color: var(--accent-primary);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 20px rgba(99, 102, 241, 0.35);
  transform: translateY(-3px);
}

.phase-number {
  font-family: var(--font-mono);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--accent-primary);
}

.phase-meta {
  display: flex;
  flex-direction: column;
}

.phase-timing {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.phase-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* Phase Content Card */
.phase-card-wrapper {
  padding: 2rem;
}

.section-header {
  margin-bottom: 1.75rem;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
}

.section-header p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Tiers Grid */
.tiers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.tier-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tier-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tier-pill {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
}

.tier-time {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--text-muted);
}

.tier-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.tier-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.tier-targets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.target-tag {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.1rem 0.4rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.cmd-box {
  background: #04060a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  overflow-x: auto;
  margin-top: auto;
}

.cmd-box code {
  font-size: 0.72rem;
  color: var(--accent-cyan);
}

/* Guidelines Grid */
.guidelines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
}

.guideline-box {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.guideline-box.danger-border { border-top: 3px solid var(--accent-danger); }
.guideline-box.warning-border { border-top: 3px solid var(--accent-amber); }
.guideline-box.info-border { border-top: 3px solid var(--accent-secondary); }

.box-icon {
  font-size: 1.5rem;
}

.guideline-box h4 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.guideline-box p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Boot Steps */
.boot-steps-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.boot-step-item {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.step-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  flex-shrink: 0;
}

.step-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.step-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.step-delay {
  font-size: 0.72rem;
  font-family: var(--font-mono);
  color: var(--accent-cyan);
}

.step-desc {
  font-size: 0.82rem;
  color: var(--text-secondary);
}

/* Verification Grid */
.verification-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
}

.verify-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.verify-card h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.verify-card p {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.code-block {
  background: #04060a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--accent-cyan);
  overflow-x: auto;
  margin-top: auto;
}

@media (max-width: 1024px) {
  .emergency-banner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
