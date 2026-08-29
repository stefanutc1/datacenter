<template>
  <div class="topology-3d-container">
    <div class="topology-header glass-panel">
      <div class="header-left">
        <div class="title-badge">
          <svg class="svg-icon-sm text-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span class="badge-title">3D Homelab Topology</span>
        </div>
        <p class="header-subtitle">Real-time perspective graph of nodes, VLAN networks, container meshes, and ELO decision paths</p>
      </div>

      <div class="header-controls">
        <div class="control-group">
          <label class="control-label">Perspective</label>
          <div class="btn-toggle-group">
            <button 
              class="toggle-btn" 
              :class="{ active: viewMode === '3d' }" 
              @click="viewMode = '3d'"
            >
              Isometric 3D
            </button>
            <button 
              class="toggle-btn" 
              :class="{ active: viewMode === 'network' }" 
              @click="viewMode = 'network'"
            >
              VLAN Matrix
            </button>
            <button 
              class="toggle-btn" 
              :class="{ active: viewMode === 'swarm' }" 
              @click="viewMode = 'swarm'"
            >
              ELO Flow
            </button>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label">Auto-Rotate</label>
          <button 
            class="toggle-btn" 
            :class="{ active: isRotating }" 
            @click="isRotating = !isRotating"
          >
            {{ isRotating ? 'ON' : 'PAUSED' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Interactive Canvas Viewport -->
    <div class="canvas-viewport glass-panel" ref="viewportRef" @mousemove="onMouseMove" @mousedown="onMouseDown" @mouseup="onMouseUp">
      <canvas ref="canvasRef" class="webgl-canvas"></canvas>

      <!-- Selected Node HUD Overlay -->
      <div v-if="selectedNode" class="node-hud-card glass-panel anim-fade-in">
        <div class="hud-header">
          <div class="hud-badge" :style="{ borderColor: selectedNode.color }">
            <span class="hud-type">{{ selectedNode.type.toUpperCase() }}</span>
          </div>
          <h4 class="hud-name">{{ selectedNode.name }}</h4>
          <button class="close-hud-btn" @click="selectedNode = null">x</button>
        </div>
        <div class="hud-body">
          <div class="hud-metric-row">
            <span class="hud-key">IP Endpoint:</span>
            <span class="hud-val font-mono text-cyan">{{ selectedNode.ip }}</span>
          </div>
          <div class="hud-metric-row">
            <span class="hud-key">Role / VLAN:</span>
            <span class="hud-val font-mono">{{ selectedNode.vlan }}</span>
          </div>
          <div class="hud-metric-row">
            <span class="hud-key">Status:</span>
            <span class="hud-val font-mono text-success">{{ selectedNode.status }}</span>
          </div>
          <div class="hud-metric-row">
            <span class="hud-key">ELO Agent:</span>
            <span class="hud-val font-mono text-purple">{{ selectedNode.swarmAgent || 'Orchestrator Core' }}</span>
          </div>
          <div class="hud-metric-row">
            <span class="hud-key">Telemetry:</span>
            <span class="hud-val font-mono">{{ selectedNode.metrics }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Legend Overlay -->
      <div class="viewport-legend glass-panel">
        <div class="legend-item">
          <span class="legend-dot" style="background: #00e5ff;"></span>
          <span>Proxmox Node 1 (192.168.1.132)</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #00ffaa;"></span>
          <span>OMV NAS Node 2 (192.168.1.135)</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #b05cff;"></span>
          <span>MacBook Air M1 Host (192.168.1.133)</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #ffaa00;"></span>
          <span>ESP32 Room Sensor Nodes</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot" style="background: #ff0055;"></span>
          <span>OPNsense WAN / Firewall</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
const viewportRef = ref(null)
const viewMode = ref('3d')
const isRotating = ref(true)
const selectedNode = ref(null)

let animationFrameId = null
let angleX = 0.4
let angleY = 0.6
let isDragging = false
let previousMousePosition = { x: 0, y: 0 }

// Topology Node Definitions
const nodes = [
  { id: 'pve', name: 'Proxmox VE 8.4', type: 'Hypervisor', ip: '192.168.1.132', vlan: 'VLAN 1 (Mgmt)', color: '#00e5ff', status: 'ONLINE', swarmAgent: 'InfraAgent', metrics: 'CPU: 18% | RAM: 14.2GB/32GB', x: -140, y: 30, z: -80 },
  { id: 'omv', name: 'OpenMediaVault NAS', type: 'Storage', ip: '192.168.1.135', vlan: 'VLAN 10 (Storage)', color: '#00ffaa', status: 'ONLINE', swarmAgent: 'StorageAgent', metrics: 'ZFS Pool: Healthy | IO: 4.2 MB/s', x: 140, y: 20, z: -60 },
  { id: 'elo_host', name: 'MacBook Air M1 (ELO)', type: 'AI Control Plane', ip: '192.168.1.133', vlan: 'VLAN 20 (AI Mesh)', color: '#b05cff', status: 'ONLINE', swarmAgent: 'SwarmOrchestrator', metrics: 'Metal MPS | 340 t/s Groq', x: 0, y: -120, z: 40 },
  { id: 'opnsense', name: 'OPNsense Firewall', type: 'Gateway', ip: '192.168.1.1', vlan: 'VLAN 1 (WAN/LAN)', color: '#ff0055', status: 'ONLINE', swarmAgent: 'NetSecAgent', metrics: 'Suricata / CrowdSec Active', x: 0, y: 150, z: -140 },
  { id: 'ha', name: 'Home Assistant LXC', type: 'Automation', ip: '192.168.1.10', vlan: 'VLAN 30 (IoT)', color: '#00e5ff', status: 'ONLINE', swarmAgent: 'HomeAgent', metrics: '142 entities | Zigbee Mesh', x: -90, y: -40, z: 30 },
  { id: 'immich', name: 'Immich LXC', type: 'Media', ip: '192.168.1.15', vlan: 'VLAN 40 (Apps)', color: '#00e5ff', status: 'ONLINE', swarmAgent: 'InfraAgent', metrics: 'Photos: 124K | Microservices OK', x: -180, y: -20, z: 80 },
  { id: 'vault', name: 'Vaultwarden LXC', type: 'Security', ip: '192.168.1.16', vlan: 'VLAN 20 (Security)', color: '#00e5ff', status: 'ONLINE', swarmAgent: 'NetSecAgent', metrics: 'Bitwarden Vault Synced', x: -60, y: 70, z: -20 },
  { id: 'grafana', name: 'Grafana / Prom LXC', type: 'Observability', ip: '192.168.1.11', vlan: 'VLAN 1 (Mgmt)', color: '#00ffaa', status: 'ONLINE', swarmAgent: 'InfraAgent', metrics: 'Prometheus 15s Scrape', x: 100, y: -60, z: 40 },
  { id: 'esp32_1', name: 'ESP32 Room Sensor 1', type: 'Edge Sensor', ip: '192.168.30.101', vlan: 'VLAN 30 (IoT)', color: '#ffaa00', status: 'ONLINE', swarmAgent: 'HomeAgent', metrics: 'BME280: 22.4C / 48% RH', x: 160, y: -140, z: 120 },
  { id: 'esp32_2', name: 'ESP32 Room Sensor 2', type: 'Edge Sensor', ip: '192.168.30.102', vlan: 'VLAN 30 (IoT)', color: '#ffaa00', status: 'ONLINE', swarmAgent: 'HomeAgent', metrics: 'LD2410 Radar Presence: TRUE', x: -160, y: -140, z: 120 },
]

// Links between topology nodes
const links = [
  { from: 'opnsense', to: 'pve', color: 'rgba(0, 229, 255, 0.4)' },
  { from: 'opnsense', to: 'omv', color: 'rgba(0, 255, 170, 0.4)' },
  { from: 'pve', to: 'ha', color: 'rgba(0, 229, 255, 0.6)' },
  { from: 'pve', to: 'immich', color: 'rgba(0, 229, 255, 0.6)' },
  { from: 'pve', to: 'vault', color: 'rgba(0, 229, 255, 0.6)' },
  { from: 'omv', to: 'grafana', color: 'rgba(0, 255, 170, 0.6)' },
  { from: 'elo_host', to: 'opnsense', color: 'rgba(176, 92, 255, 0.7)' },
  { from: 'elo_host', to: 'pve', color: 'rgba(176, 92, 255, 0.7)' },
  { from: 'elo_host', to: 'omv', color: 'rgba(176, 92, 255, 0.7)' },
  { from: 'ha', to: 'esp32_1', color: 'rgba(255, 170, 0, 0.5)' },
  { from: 'ha', to: 'esp32_2', color: 'rgba(255, 170, 0, 0.5)' },
]

const project3D = (x, y, z, cx, cy, fov = 400) => {
  // Rotate around Y
  const cosY = Math.cos(angleY)
  const sinY = Math.sin(angleY)
  const x1 = x * cosY - z * sinY
  const z1 = z * cosY + x * sinY

  // Rotate around X
  const cosX = Math.cos(angleX)
  const sinX = Math.sin(angleX)
  const y2 = y * cosX - z1 * sinX
  const z2 = z1 * cosX + y * sinX

  // Perspective projection
  const scale = fov / (fov + z2 + 300)
  return {
    px: cx + x1 * scale,
    py: cy + y2 * scale,
    scale,
    zOrder: z2
  }
}

const render = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  const cx = width / 2
  const cy = height / 2

  ctx.clearRect(0, 0, width, height)

  // Draw 3D coordinate grid floor
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)'
  ctx.lineWidth = 1
  for (let gx = -250; gx <= 250; gx += 50) {
    const pStart = project3D(gx, 100, -250, cx, cy)
    const pEnd = project3D(gx, 100, 250, cx, cy)
    ctx.beginPath()
    ctx.moveTo(pStart.px, pStart.py)
    ctx.lineTo(pEnd.px, pEnd.py)
    ctx.stroke()
  }
  for (let gz = -250; gz <= 250; gz += 50) {
    const pStart = project3D(-250, 100, gz, cx, cy)
    const pEnd = project3D(250, 100, gz, cx, cy)
    ctx.beginPath()
    ctx.moveTo(pStart.px, pStart.py)
    ctx.lineTo(pEnd.px, pEnd.py)
    ctx.stroke()
  }

  // Draw connecting links with animated data packets
  const now = Date.now() * 0.002
  links.forEach((link, idx) => {
    const fromNode = nodes.find(n => n.id === link.from)
    const toNode = nodes.find(n => n.id === link.to)
    if (!fromNode || !toNode) return

    const p1 = project3D(fromNode.x, fromNode.y, fromNode.z, cx, cy)
    const p2 = project3D(toNode.x, toNode.y, toNode.z, cx, cy)

    ctx.beginPath()
    ctx.strokeStyle = link.color
    ctx.lineWidth = Math.max(1, 2 * p1.scale)
    ctx.moveTo(p1.px, p1.py)
    ctx.lineTo(p2.px, p2.py)
    ctx.stroke()

    // Data packet animation
    const progress = (now + idx * 0.3) % 1
    const packetX = p1.px + (p2.px - p1.px) * progress
    const packetY = p1.py + (p2.py - p1.py) * progress
    ctx.beginPath()
    ctx.arc(packetX, packetY, 3 * p1.scale, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = '#00e5ff'
    ctx.shadowBlur = 6
    ctx.fill()
    ctx.shadowBlur = 0
  })

  // Project and sort nodes by depth
  const projectedNodes = nodes.map(n => {
    const p = project3D(n.x, n.y, n.z, cx, cy)
    return { ...n, ...p }
  }).sort((a, b) => b.zOrder - a.zOrder)

  // Draw node spheres and labels
  projectedNodes.forEach(node => {
    const radius = Math.max(6, 14 * node.scale)

    // Outer glow ring
    ctx.beginPath()
    ctx.arc(node.px, node.py, radius + 4, 0, Math.PI * 2)
    ctx.strokeStyle = node.color
    ctx.globalAlpha = 0.35
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.globalAlpha = 1.0

    // Core sphere
    ctx.beginPath()
    ctx.arc(node.px, node.py, radius, 0, Math.PI * 2)
    ctx.fillStyle = node.color
    ctx.shadowColor = node.color
    ctx.shadowBlur = 10
    ctx.fill()
    ctx.shadowBlur = 0

    // Node label
    ctx.fillStyle = '#ffffff'
    ctx.font = `${Math.max(10, Math.round(12 * node.scale))}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText(node.name, node.px, node.py + radius + 14)

    // IP Sub-label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = `${Math.max(9, Math.round(10 * node.scale))}px monospace`
    ctx.fillText(node.ip, node.px, node.py + radius + 26)
  })

  if (isRotating.value) {
    angleY += 0.003
  }

  animationFrameId = requestAnimationFrame(render)
}

const handleResize = () => {
  const canvas = canvasRef.value
  const viewport = viewportRef.value
  if (canvas && viewport) {
    canvas.width = viewport.clientWidth
    canvas.height = Math.max(520, viewport.clientHeight)
  }
}

const onMouseDown = (e) => {
  isDragging = true
  previousMousePosition = { x: e.clientX, y: e.clientY }
}

const onMouseMove = (e) => {
  if (isDragging) {
    const deltaX = e.clientX - previousMousePosition.x
    const deltaY = e.clientY - previousMousePosition.y
    angleY += deltaX * 0.008
    angleX = Math.max(-1.2, Math.min(1.2, angleX + deltaY * 0.008))
    previousMousePosition = { x: e.clientX, y: e.clientY }
  }
}

const onMouseUp = (e) => {
  isDragging = false
  // Check click on node
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  const cx = canvas.width / 2
  const cy = canvas.height / 2

  let clicked = null
  nodes.forEach(n => {
    const p = project3D(n.x, n.y, n.z, cx, cy)
    const dist = Math.hypot(p.px - mouseX, p.py - mouseY)
    if (dist < 20) {
      clicked = n
    }
  })
  if (clicked) {
    selectedNode.value = clicked
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  render()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.topology-3d-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.topology-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.75rem;
  border-radius: 12px;
  flex-wrap: wrap;
  gap: 1rem;
}

.title-badge {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.badge-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.03em;
}

.header-subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.25rem;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-label {
  font-size: 0.8rem;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
}

.btn-toggle-group {
  display: flex;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 2px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: monospace;
}

.toggle-btn.active {
  background: rgba(0, 229, 255, 0.2);
  color: #00e5ff;
  border: 1px solid rgba(0, 229, 255, 0.4);
}

.canvas-viewport {
  position: relative;
  width: 100%;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  background: radial-gradient(circle at center, rgba(12, 18, 30, 0.95) 0%, rgba(6, 9, 15, 0.98) 100%);
  cursor: grab;
}

.canvas-viewport:active {
  cursor: grabbing;
}

.webgl-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.node-hud-card {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 320px;
  padding: 1.25rem;
  border-radius: 10px;
  background: rgba(10, 15, 25, 0.88);
  border: 1px solid rgba(0, 229, 255, 0.3);
  z-index: 10;
}

.hud-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.hud-badge {
  padding: 0.2rem 0.5rem;
  border: 1px solid;
  border-radius: 4px;
  font-size: 0.65rem;
  font-family: monospace;
}

.hud-name {
  font-size: 0.95rem;
  color: #fff;
  flex: 1;
}

.close-hud-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  cursor: pointer;
}

.hud-metric-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  padding: 0.35rem 0;
}

.hud-key {
  color: rgba(255, 255, 255, 0.6);
}

.viewport-legend {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.85rem 1.2rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-family: monospace;
  background: rgba(10, 15, 25, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: rgba(255, 255, 255, 0.8);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.text-cyan { color: #00e5ff; }
.text-purple { color: #b05cff; }
.text-success { color: #00ffaa; }
.text-danger { color: #ff0055; }
.font-mono { font-family: monospace; }
</style>
