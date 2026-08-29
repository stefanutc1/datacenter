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
            <span class="emergency-badge">sop-pwr-10h</span>
            <span class="severity-badge">critical protocol</span>
          </div>
          <h2 class="emergency-title">extended 10+ hour power outage standard operating procedure</h2>
          <p class="emergency-subtitle">cascading graceful shutdown, physical battery/surge isolation, and staged cold-boot recovery hierarchy.</p>
        </div>
      </div>

      <div class="quick-actions">
        <button class="btn-emergency-action" @click="currentPhaseId = 'phase1'">
          <span>cascading shutdown</span>
        </button>
        <button class="btn-emergency-action" @click="currentPhaseId = 'phase3'">
          <span>cold-boot sequence</span>
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
          <h3>phase 1: automated &amp; cascading graceful shutdown (t+0m – t+15m)</h3>
          <p>executed upon grid loss or triggered manually via <code>/opt/homelab/scripts/emergency-shutdown.sh</code> to cleanly unmount openmediavault nas nfs storage shares and flush filesystem journals.</p>
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
          <h3>phase 2: long-term 10+ hour outage hardening (t+15m – t+10h+)</h3>
          <p>protecting hardware electronics from deep-discharge battery degradation and municipal grid restoration inrush surges.</p>
        </div>

        <div class="guidelines-grid">
          <div class="guideline-box danger-border">
            <div class="box-icon-tag">isolation</div>
            <h4>physical surge suppressor isolation</h4>
            <p>unplug the master pdu / surge protector from the wall outlet. when the utility grid returns after major blackouts, large voltage spikes occur during initial transformer re-energization.</p>
          </div>

          <div class="guideline-box warning-border">
            <div class="box-icon-tag">battery</div>
            <h4>ups battery deep-discharge cutoff</h4>
            <p>power off the physical ups master switch once all nodes have cleanly shut down. leaving the inverter running empty can drain battery cells below their critical cutoff voltage.</p>
          </div>

          <div class="guideline-box info-border">
            <div class="box-icon-tag">telemetry</div>
            <h4>out-of-band telemetry &amp; alerts</h4>
            <p>emergency status alerts are dispatched over the secondary cellular gateway. an autonomous esp32 sensor monitors line voltage and server cabinet temperature.</p>
          </div>
        </div>
      </div>

      <!-- PHASE 3: Staged Cold-Boot Sequence -->
      <div v-else-if="currentPhaseId === 'phase3'" class="phase-content">
        <div class="section-header">
          <h3>phase 3: grid restoration &amp; staged cold-boot sequence</h3>
          <p>bring services online in strict dependency order via <code>/opt/homelab/scripts/cold-boot-sequence.sh</code> once grid power stabilizes and openmediavault nas is reachable.</p>
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
          <h3>phase 4: post-recovery nas nfs mounts &amp; diagnostics</h3>
          <p>verify openmediavault nas nfs share exports, filesystem mounts, database write-ahead logs, and container consistency.</p>
        </div>

        <div class="verification-grid">
          <div class="verify-card">
            <h4>1. openmediavault nas nfs mounts</h4>
            <p>verifies that all nfs exports from nas (192.168.1.5) are mounted and writable.</p>
            <pre class="code-block"><code>showmount -e 192.168.1.5
df -h -t nfs,nfs4</code></pre>
          </div>

          <div class="verify-card">
            <h4>2. container health &amp; exited processes</h4>
            <p>identify any containers that failed automated restart or encountered volume lockups.</p>
            <pre class="code-block"><code>pct list
docker ps -a --filter "status=exited"</code></pre>
          </div>

          <div class="verify-card">
            <h4>3. database &amp; data consistency</h4>
            <p>verify that write-ahead logs replayed cleanly and no tables were corrupted.</p>
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
  { id: 'phase1', number: '01', timing: 't+0m – t+15m', title: 'cascading shutdown' },
  { id: 'phase2', number: '02', timing: 't+15m – t+10h+', title: 'hardware isolation' },
  { id: 'phase3', number: '03', timing: 'post-restoration', title: 'staged cold boot' },
  { id: 'phase4', number: '04', timing: 'integrity check', title: 'nfs & diagnostics' }
];

const shutdownTiers = [
  {
    tier: 'tier 4',
    timeWindow: 't+2 min',
    color: '#b8555a',
    name: 'heavy workloads & media suites',
    description: 'stop resource-intensive encoding, transcode caches, and heavy container suites first to conserve battery.',
    targets: ['jellyfin', 'immich', 'torrent', 'media stack'],
    command: 'docker compose -f /opt/homelab/media/docker-compose.yml stop'
  },
  {
    tier: 'tier 3',
    timeWindow: 't+5 min',
    color: '#cfa16a',
    name: 'workstations & secondary vms',
    description: 'gracefully shutdown kvm guest oses with disk sync before database teardown.',
    targets: ['windows server 2025 (201)'],
    command: 'qm shutdown 201 --timeout 60'
  },
  {
    tier: 'tier 2',
    timeWindow: 't+8 min',
    color: '#baa6a8',
    name: 'databases & storage flushes',
    description: 'commit all active write transactions, flush write-ahead logs, and unmount network nfs shares.',
    targets: ['vaultwarden', 'nextcloud', 'gitea'],
    command: 'sync && docker compose -f /opt/homelab/core/docker-compose.yml stop'
  },
  {
    tier: 'tier 1 & 0',
    timeWindow: 't+12 min',
    color: '#6b9e78',
    name: 'ingress, router & hypervisor',
    description: 'stop reverse proxy, authentication, unmount nas nfs shares, and stop core router before host poweroff.',
    targets: ['npm ingress (101)', 'authelia sso (102)', 'pi-hole dns (100)', 'opnsense vm (200)', 'pve host'],
    command: 'umount -a -t nfs,nfs4 && sync && poweroff'
  }
];

const bootSteps = [
  {
    name: 'grid stabilization window',
    delay: 'wait 5-10 min',
    desc: 'verify grid voltage is clean 230v @ 50hz. re-engage master surge protector and power on ups in bypass charging mode.',
    cmd: 'pve-hardware-poweron'
  },
  {
    name: 'core firewall & gateway (opnsense)',
    delay: 'wait 30 sec',
    desc: 'brings up wan interface, vlan routing, and internal dhcp lease daemon.',
    cmd: 'qm start 200'
  },
  {
    name: 'internal dns resolution (pi-hole)',
    delay: 'wait 10 sec',
    desc: 'resolves all local .lan domains and enables outbound upstream dns forwarding.',
    cmd: 'pct start 100'
  },
  {
    name: 'ingress proxy & identity provider (npm & authelia)',
    delay: 'wait 10 sec',
    desc: 'establishes ssl termination and single-sign-on access control for all internal dashboards.',
    cmd: 'pct start 101 && pct start 102'
  },
  {
    name: 'databases, nas nfs storage & application services',
    delay: 'sequential 3s',
    desc: 'mounts openmediavault nas nfs storage shares and starts core services and media suites in controlled intervals.',
    cmd: 'docker compose -f /opt/homelab/core/docker-compose.yml up -d'
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
  background: rgba(184, 85, 90, 0.15);
  border: 1px solid rgba(184, 85, 90, 0.3);
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
  background: rgba(184, 85, 90, 0.15);
  border: 1px solid rgba(184, 85, 90, 0.3);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  text-transform: lowercase;
}

.severity-badge {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-muted);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  text-transform: lowercase;
}

.emergency-title {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  text-transform: lowercase;
}

.emergency-subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.2rem;
  text-transform: lowercase;
}

.quick-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-emergency-action {
  padding: 0.6rem 1rem;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s ease;
  text-transform: lowercase;
}

.btn-emergency-action:hover {
  background: #3e2a2c;
  border-color: rgba(214, 182, 186, 0.3);
}

.phases-navigator {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.phase-nav-btn {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  text-align: left;
  transition: all 0.25s ease;
}

.phase-nav-btn:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-color-hover);
}

.phase-nav-btn.active {
  background: #3e2a2c;
  border-color: rgba(214, 182, 186, 0.3);
  box-shadow: 0 0 16px rgba(62, 42, 44, 0.5);
}

.phase-number {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-cyan);
}

.phase-meta {
  display: flex;
  flex-direction: column;
}

.phase-timing {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.phase-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: lowercase;
}

.phase-card-wrapper {
  padding: 2rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
  text-transform: lowercase;
}

.section-header p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: lowercase;
}

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
  gap: 0.6rem;
}

.tier-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tier-pill {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  text-transform: lowercase;
}

.tier-time {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.tier-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: lowercase;
}

.tier-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.45;
  text-transform: lowercase;
}

.tier-targets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.25rem;
}

.target-tag {
  font-size: 0.68rem;
  background: rgba(214, 182, 186, 0.08);
  padding: 0.15rem 0.45rem;
  border-radius: 3px;
  color: var(--text-muted);
  text-transform: lowercase;
}

.cmd-box {
  margin-top: auto;
  padding-top: 0.5rem;
}

.cmd-box code {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 0.65rem;
  border-radius: var(--radius-sm);
  color: var(--accent-cyan);
  overflow-x: auto;
}

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
  gap: 0.5rem;
}

.guideline-box.danger-border { border-top: 3px solid var(--accent-danger); }
.guideline-box.warning-border { border-top: 3px solid var(--accent-amber); }
.guideline-box.info-border { border-top: 3px solid var(--accent-cyan); }

.box-icon-tag {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: lowercase;
  color: var(--text-muted);
}

.guideline-box h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: lowercase;
}

.guideline-box p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.55;
  text-transform: lowercase;
}

.boot-steps-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.boot-step-item {
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.step-badge {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3e2a2c;
  color: #f5ecec;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  flex-shrink: 0;
  border: 1px solid rgba(214, 182, 186, 0.2);
}

.step-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.step-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.step-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: lowercase;
}

.step-delay {
  font-size: 0.725rem;
  font-family: var(--font-mono);
  color: var(--text-muted);
  text-transform: lowercase;
}

.step-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  text-transform: lowercase;
}

.verification-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  font-weight: 600;
  color: var(--text-primary);
  text-transform: lowercase;
}

.verify-card p {
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-transform: lowercase;
}

.code-block {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--accent-cyan);
  overflow-x: auto;
}

@media (max-width: 900px) {
  .phases-navigator {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
