<template>
  <div class="command-center-hud glass-panel">
    <div class="hud-inner">
      <!-- Left: Cluster Health & Live Ticker -->
      <div class="hud-status-block">
        <div class="status-pulse-ring">
          <span class="pulse-dot"></span>
        </div>
        <div class="status-texts">
          <div class="status-title-row">
            <span class="status-label">CLUSTER CORE</span>
            <span class="status-badge-healthy">99.98% OPTIMAL</span>
          </div>
          <span class="status-sub">Bucharest EEST: <strong>{{ currentTime }}</strong> &bull; 31 Services Online</span>
        </div>
      </div>

      <!-- Center: Real-Time Telemetry Gauges -->
      <div class="hud-telemetry-grid">
        <!-- Gauge 1: Proxmox CPU -->
        <div class="hud-gauge-card">
          <div class="gauge-header">
            <span class="gauge-title">PVE CPU</span>
            <span class="gauge-val">{{ cpuLoad }}%</span>
          </div>
          <div class="gauge-bar-track">
            <div class="gauge-bar-fill cpu-fill" :style="{ width: cpuLoad + '%' }"></div>
          </div>
          <span class="gauge-sub">i3-10100F (4C/8T)</span>
        </div>

        <!-- Gauge 2: Proxmox RAM -->
        <div class="hud-gauge-card">
          <div class="gauge-header">
            <span class="gauge-title">DDR4 RAM</span>
            <span class="gauge-val">{{ ramUsage }} / 8.0 GB</span>
          </div>
          <div class="gauge-bar-track">
            <div class="gauge-bar-fill ram-fill" :style="{ width: (ramUsage / 8.0 * 100) + '%' }"></div>
          </div>
          <span class="gauge-sub">KSM Dedup: 420 MB</span>
        </div>

        <!-- Gauge 3: GPU VRAM -->
        <div class="hud-gauge-card">
          <div class="gauge-header">
            <span class="gauge-title">GTX 1050 Ti</span>
            <span class="gauge-val">{{ vramUsage }} / 4 GB</span>
          </div>
          <div class="gauge-bar-track">
            <div class="gauge-bar-fill gpu-fill" :style="{ width: (vramUsage / 4.0 * 100) + '%' }"></div>
          </div>
          <span class="gauge-sub">NVENC Hardware Idle</span>
        </div>

        <!-- Gauge 4: ZFS Pool Health -->
        <div class="hud-gauge-card">
          <div class="gauge-header">
            <span class="gauge-title">ZFS STORAGE</span>
            <span class="gauge-val text-emerald">100% OK</span>
          </div>
          <div class="gauge-bar-track">
            <div class="gauge-bar-fill zfs-fill" style="width: 100%"></div>
          </div>
          <span class="gauge-sub">SMART: 0 Bad Sectors</span>
        </div>

        <!-- Gauge 5: ELO LLM Cascade -->
        <div class="hud-gauge-card">
          <div class="gauge-header">
            <span class="gauge-title">AI CASCADE</span>
            <span class="gauge-val text-purple">GEMINI · GROQ</span>
          </div>
          <div class="gauge-bar-track">
            <div class="gauge-bar-fill ai-fill" style="width: 95%"></div>
          </div>
          <span class="gauge-sub">LPU Speed: 340 t/s</span>
        </div>
      </div>

      <!-- Right: Active Room Awareness Badge -->
      <div class="hud-presence-block" :title="`User detected via mmWave radar in: ${currentRoom}`">
        <div class="room-icon-box">
          <svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/><path d="M9 22V12h6v10"/><path d="M2 10.6L12 2l10 8.6"/></svg>
        </div>
        <div class="room-details">
          <span class="room-label">ESP32 PRESENCE</span>
          <span class="room-name">{{ currentRoom }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentTime = ref('');
const cpuLoad = ref(14);
const ramUsage = ref(5.8);
const vramUsage = ref(1.2);
const currentRoom = ref('Birou (Office)');

let clockTimer = null;
let telemetryTimer = null;

const updateClock = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('ro-RO', {
    timeZone: 'Europe/Bucharest',
    hour12: false
  });
};

const updateTelemetry = () => {
  // Gentle realistic oscillation
  cpuLoad.value = Math.min(35, Math.max(10, Math.round(14 + (Math.random() * 8 - 4))));
  ramUsage.value = Number((5.8 + (Math.random() * 0.2 - 0.1)).toFixed(1));
  vramUsage.value = Number((1.2 + (Math.random() * 0.1 - 0.05)).toFixed(1));
};

onMounted(() => {
  updateClock();
  clockTimer = setInterval(updateClock, 1000);
  telemetryTimer = setInterval(updateTelemetry, 3500);
});

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer);
  if (telemetryTimer) clearInterval(telemetryTimer);
});
</script>

<style scoped>
.command-center-hud {
  padding: 0.85rem 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: linear-gradient(135deg, rgba(36, 26, 28, 0.85), rgba(26, 19, 21, 0.95));
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.hud-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.hud-status-block {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.status-pulse-ring {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-dot {
  width: 12px;
  height: 12px;
  background: #2ecc71;
  border-radius: 50%;
  box-shadow: 0 0 12px #2ecc71;
  animation: pulseAnim 2s infinite ease-in-out;
}

@keyframes pulseAnim {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(46, 204, 113, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
}

.status-texts {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.status-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-label {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--text-primary);
}

.status-badge-healthy {
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  background: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.3);
  font-weight: 700;
}

.status-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.hud-telemetry-grid {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  flex: 1;
  justify-content: center;
}

.hud-gauge-card {
  min-width: 130px;
  padding: 0.4rem 0.7rem;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.gauge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.gauge-title {
  color: var(--text-muted);
  font-size: 0.7rem;
  text-transform: uppercase;
}

.gauge-val {
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.gauge-bar-track {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.gauge-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.4s ease;
}

.cpu-fill { background: linear-gradient(90deg, #3498db, #e74c3c); }
.ram-fill { background: linear-gradient(90deg, #9b59b6, #e67e22); }
.gpu-fill { background: linear-gradient(90deg, #1abc9c, #2ecc71); }
.zfs-fill { background: #2ecc71; }
.ai-fill { background: linear-gradient(90deg, #8e44ad, #f39c12); }

.gauge-sub {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.hud-presence-block {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4rem 0.85rem;
  border-radius: 10px;
  background: rgba(0, 188, 212, 0.1);
  border: 1px solid rgba(0, 188, 212, 0.25);
  cursor: pointer;
  transition: all 0.2s ease;
}

.hud-presence-block:hover {
  background: rgba(0, 188, 212, 0.2);
  transform: translateY(-2px);
}

.room-icon-box {
  color: #00bcd4;
}

.room-details {
  display: flex;
  flex-direction: column;
}

.room-label {
  font-size: 0.65rem;
  color: #00bcd4;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.room-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
}

.text-emerald { color: #2ecc71; }
.text-purple { color: #bb86fc; }
.svg-icon-sm { width: 18px; height: 18px; }

@media (max-width: 1100px) {
  .hud-telemetry-grid {
    justify-content: flex-start;
  }
}
</style>
