<template>
  <div class="schematic-container glass-panel" ref="containerRef">
    <!-- Header / Control bar -->
    <div class="schematic-header">
      <div class="header-left">
        <h3 class="schematic-title">interactive network topology &amp; mesh schematics</h3>
        <p class="schematic-subtitle">live force-directed simulation of physical hypervisors, vlan subnets, and containerized microservices</p>
      </div>

      <!-- Top Right Graph Controls -->
      <div class="graph-controls">
        <button class="ctrl-btn" @click="resetView" title="reset camera zoom & pan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>
        <button class="ctrl-btn" :class="{ active: physicsEnabled }" @click="togglePhysics" title="toggle live physics simulation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="6" r="3"/>
            <circle cx="18" cy="18" r="3"/>
            <path d="M8.7 10.7l6.6-3.4M8.7 13.3l6.6 3.4"/>
          </svg>
        </button>
        <button class="ctrl-btn" @click="reheatSimulation" title="re-heat layout distribution">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
        </button>
        <button class="ctrl-btn" @click="zoomIn" title="zoom in">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
        <button class="ctrl-btn" @click="zoomOut" title="zoom out">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Canvas Viewport -->
    <div class="canvas-wrapper" ref="canvasWrapperRef">
      <canvas 
        ref="canvasRef"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseLeave"
        @wheel="onWheel"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend.passive="onTouchEnd"
      ></canvas>

      <!-- Hover Tooltip -->
      <div 
        v-if="hoveredNode" 
        class="node-tooltip" 
        :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }"
      >
        <div class="tooltip-title-row">
          <span class="tooltip-dot" :style="{ backgroundColor: hoveredNode.color }"></span>
          <span class="tooltip-name">{{ hoveredNode.label }}</span>
        </div>
        <div class="tooltip-meta">
          <div class="tooltip-row">
            <span class="tooltip-k">type:</span>
            <span class="tooltip-v">{{ hoveredNode.type }}</span>
          </div>
          <div class="tooltip-row" v-if="hoveredNode.ip">
            <span class="tooltip-k">ip:</span>
            <span class="tooltip-v code-font">{{ hoveredNode.ip }}</span>
          </div>
          <div class="tooltip-row" v-if="hoveredNode.port">
            <span class="tooltip-k">port:</span>
            <span class="tooltip-v code-font">:{{ hoveredNode.port }}</span>
          </div>
          <div class="tooltip-row" v-if="hoveredNode.sublabel">
            <span class="tooltip-k">location / role:</span>
            <span class="tooltip-v">{{ hoveredNode.sublabel }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Graph Legend -->
    <div class="schematic-legend">
      <div class="legend-item">
        <span class="legend-chip coordinator"></span>
        <span class="legend-text">coordinator / mesh router</span>
      </div>
      <div class="legend-item">
        <span class="legend-chip router"></span>
        <span class="legend-text">hypervisor host</span>
      </div>
      <div class="legend-item">
        <span class="legend-chip end-device"></span>
        <span class="legend-text">microservice / container</span>
      </div>
      <div class="legend-item">
        <span class="legend-chip offline"></span>
        <span class="legend-text">backup / standby</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const containerRef = ref(null);
const canvasWrapperRef = ref(null);
const canvasRef = ref(null);

const physicsEnabled = ref(true);
const hoveredNode = ref(null);
const tooltipPos = ref({ x: 0, y: 0 });

// View transform
let scale = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;
let draggedNode = null;
let animFrameId = null;

// Initial Nodes Definition
const initialNodes = [
  // Core Mesh / Coordinator
  { id: 'gateway', label: 'tailscale mesh & traefik', sublabel: 'core gateway · 100.64.0.0/10', type: 'coordinator', ip: '100.64.0.1', color: '#00d2d3', radius: 18 },
  
  // Physical Hypervisors / Hosts
  { id: 'proxmox-01', label: 'node 1 (proxmox)', sublabel: 'core compute · i3-10100f / gtx 1050 ti', type: 'router', ip: '192.168.1.100', color: '#00cec9', radius: 15 },
  { id: 'omv-02', label: 'node 2 (openmediavault)', sublabel: 'nfs nas · celeron n2830', type: 'router', ip: '192.168.1.110', color: '#00cec9', radius: 15 },
  { id: 'proxmox-arm-03', label: 'node 3 (proxmox arm)', sublabel: 'apple m1 · aarch64 hypervisor', type: 'router', ip: '192.168.1.120', color: '#00cec9', radius: 15 },
  { id: 'k8s-node-04', label: 'node 4 (k8s worker)', sublabel: 'k3s agent · athlon ii x2 / gts 250', type: 'router', ip: '192.168.1.130', color: '#00cec9', radius: 15 },

  // Node 1 Services (Proxmox Compute)
  { id: 'homeassistant', label: 'home assistant', sublabel: 'iot core · lxc 103', type: 'end-device', ip: '192.168.1.103', port: 8123, color: '#10b981', radius: 10 },
  { id: 'zigbee2mqtt', label: 'zigbee2mqtt', sublabel: 'zb-bridge · lxc 104', type: 'end-device', ip: '192.168.1.104', port: 8080, color: '#10b981', radius: 9 },
  { id: 'mosquitto', label: 'mosquitto mqtt', sublabel: 'event broker · lxc 106', type: 'end-device', ip: '192.168.1.106', port: 1883, color: '#10b981', radius: 9 },
  { id: 'frigate', label: 'frigate nvr', sublabel: 'nvenc gpu · lxc 118', type: 'end-device', ip: '192.168.1.118', port: 5000, color: '#10b981', radius: 11 },
  { id: 'immich', label: 'immich photos', sublabel: 'ml backup · lxc 107', type: 'end-device', ip: '192.168.1.107', port: 2283, color: '#10b981', radius: 10 },
  { id: 'vaultwarden', label: 'vaultwarden', sublabel: 'bitwarden · lxc 105', type: 'end-device', ip: '192.168.1.105', port: 8080, color: '#10b981', radius: 9 },
  { id: 'grafana', label: 'grafana', sublabel: 'telemetry · lxc 120', type: 'end-device', ip: '192.168.1.120', port: 3000, color: '#10b981', radius: 10 },
  { id: 'prometheus', label: 'prometheus', sublabel: 'metrics · lxc 124', type: 'end-device', ip: '192.168.1.124', port: 9090, color: '#10b981', radius: 9 },
  { id: 'uptime-kuma', label: 'uptime kuma', sublabel: 'health ping · lxc 125', type: 'end-device', ip: '192.168.1.125', port: 3001, color: '#10b981', radius: 9 },
  { id: 'gitea', label: 'gitea forge', sublabel: 'git repo · lxc 108', type: 'end-device', ip: '192.168.1.108', port: 3000, color: '#10b981', radius: 9 },
  { id: 'woodpecker', label: 'woodpecker ci', sublabel: 'ci runners · lxc 109', type: 'end-device', ip: '192.168.1.109', port: 8000, color: '#10b981', radius: 9 },
  { id: 'pihole', label: 'pi-hole dns', sublabel: 'adblock · lxc 100', type: 'end-device', ip: '192.168.1.100', port: 80, color: '#10b981', radius: 10 },
  { id: 'wiki-docs', label: 'wiki docs', sublabel: 'knowledge base · lxc 123', type: 'end-device', ip: '192.168.1.123', port: 80, color: '#10b981', radius: 9 },

  // Node 2 Services (OpenMediaVault NAS)
  { id: 'nextcloud', label: 'nextcloud hub', sublabel: 'nfs cloud · lxc 111', type: 'end-device', ip: '192.168.1.111', port: 8080, color: '#10b981', radius: 10 },
  { id: 'jellyfin', label: 'jellyfin media', sublabel: 'streaming · lxc 112', type: 'end-device', ip: '192.168.1.112', port: 8096, color: '#10b981', radius: 10 },
  { id: 'qbittorrent', label: 'qbittorrent', sublabel: 'downloads · lxc 113', type: 'end-device', ip: '192.168.1.113', port: 8080, color: '#10b981', radius: 9 },
  { id: 'sonarr', label: 'sonarr', sublabel: 'tv series · lxc 114', type: 'end-device', ip: '192.168.1.114', port: 8989, color: '#10b981', radius: 8 },
  { id: 'radarr', label: 'radarr', sublabel: 'movies · lxc 115', type: 'end-device', ip: '192.168.1.115', port: 7878, color: '#10b981', radius: 8 },
  { id: 'bazarr', label: 'bazarr', sublabel: 'subtitles · lxc 116', type: 'end-device', ip: '192.168.1.116', port: 6767, color: '#10b981', radius: 8 },
  { id: 'prowlarr', label: 'prowlarr', sublabel: 'indexers · lxc 117', type: 'end-device', ip: '192.168.1.117', port: 9696, color: '#10b981', radius: 8 },

  // Node 3 Services (Apple M1)
  { id: 'm1-runner', label: 'm1 arm64 runner', sublabel: 'multi-arch compiler', type: 'end-device', ip: '192.168.1.121', color: '#10b981', radius: 9 },
  { id: 'm1-dns-backup', label: 'pi-hole standby', sublabel: 'secondary resolver', type: 'offline', ip: '192.168.1.122', color: '#e74c3c', radius: 8 },

  // Node 4 Services (k8s Worker)
  { id: 'k3s-agent', label: 'k3s pod worker', sublabel: 'containerd cri', type: 'end-device', ip: '192.168.1.131', color: '#10b981', radius: 9 },
  { id: 'async-queue', label: 'async queue worker', sublabel: 'batch compute', type: 'end-device', ip: '192.168.1.132', color: '#10b981', radius: 8 }
];

const initialLinks = [
  // Gateway to Hosts
  { source: 'gateway', target: 'proxmox-01', dashed: false },
  { source: 'gateway', target: 'omv-02', dashed: false },
  { source: 'gateway', target: 'proxmox-arm-03', dashed: false },
  { source: 'gateway', target: 'k8s-node-04', dashed: false },

  // Proxmox-01 to Compute Services
  { source: 'proxmox-01', target: 'homeassistant', dashed: false },
  { source: 'proxmox-01', target: 'frigate', dashed: false },
  { source: 'proxmox-01', target: 'immich', dashed: false },
  { source: 'proxmox-01', target: 'vaultwarden', dashed: false },
  { source: 'proxmox-01', target: 'grafana', dashed: false },
  { source: 'proxmox-01', target: 'prometheus', dashed: false },
  { source: 'proxmox-01', target: 'uptime-kuma', dashed: false },
  { source: 'proxmox-01', target: 'gitea', dashed: false },
  { source: 'proxmox-01', target: 'pihole', dashed: false },
  { source: 'proxmox-01', target: 'wiki-docs', dashed: false },

  // IoT Cross-links
  { source: 'homeassistant', target: 'zigbee2mqtt', dashed: true },
  { source: 'homeassistant', target: 'mosquitto', dashed: true },
  { source: 'homeassistant', target: 'frigate', dashed: true },
  { source: 'gitea', target: 'woodpecker', dashed: true },
  { source: 'grafana', target: 'prometheus', dashed: true },

  // OMV-02 to Storage & Media Services
  { source: 'omv-02', target: 'nextcloud', dashed: false },
  { source: 'omv-02', target: 'jellyfin', dashed: false },
  { source: 'omv-02', target: 'qbittorrent', dashed: false },
  { source: 'omv-02', target: 'sonarr', dashed: false },
  { source: 'omv-02', target: 'radarr', dashed: false },
  { source: 'sonarr', target: 'prowlarr', dashed: true },
  { source: 'radarr', target: 'prowlarr', dashed: true },
  { source: 'sonarr', target: 'qbittorrent', dashed: true },
  { source: 'radarr', target: 'qbittorrent', dashed: true },
  { source: 'sonarr', target: 'bazarr', dashed: true },

  // M1 ARM64 Workloads
  { source: 'proxmox-arm-03', target: 'm1-runner', dashed: false },
  { source: 'proxmox-arm-03', target: 'm1-dns-backup', dashed: true },

  // k8s Node 4 Workloads
  { source: 'k8s-node-04', target: 'k3s-agent', dashed: false },
  { source: 'k8s-node-04', target: 'async-queue', dashed: false }
];

let nodes = [];
let links = [];

function initNodes(width, height) {
  const centerX = width / 2;
  const centerY = height / 2;
  
  nodes = initialNodes.map((n, idx) => {
    let angle = (idx / initialNodes.length) * Math.PI * 2;
    let dist = n.type === 'coordinator' ? 0 : n.type === 'router' ? 140 : 230 + (idx % 3) * 35;
    return {
      ...n,
      x: centerX + Math.cos(angle) * dist + (Math.random() - 0.5) * 30,
      y: centerY + Math.sin(angle) * dist + (Math.random() - 0.5) * 30,
      vx: 0,
      vy: 0
    };
  });

  links = initialLinks.map(l => ({
    ...l,
    sourceNode: nodes.find(n => n.id === l.source),
    targetNode: nodes.find(n => n.id === l.target)
  })).filter(l => l.sourceNode && l.targetNode);
}

function updatePhysics() {
  if (!physicsEnabled.value) return;

  const width = canvasWrapperRef.value ? canvasWrapperRef.value.clientWidth : 800;
  const height = canvasWrapperRef.value ? canvasWrapperRef.value.clientHeight : 540;
  const centerX = width / 2;
  const centerY = height / 2;

  // Repulsion between all node pairs
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i];
      const n2 = nodes[j];
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const minDist = n1.radius + n2.radius + 35;
      
      const repForce = Math.min(8000 / (dist * dist), 12);
      const fx = (dx / dist) * repForce;
      const fy = (dy / dist) * repForce;

      if (n1 !== draggedNode) {
        n1.vx -= fx;
        n1.vy -= fy;
      }
      if (n2 !== draggedNode) {
        n2.vx += fx;
        n2.vy += fy;
      }
    }
  }

  // Attraction along links
  for (const link of links) {
    const s = link.sourceNode;
    const t = link.targetNode;
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const targetDist = s.type === 'coordinator' || t.type === 'coordinator' ? 140 : 90;
    const diff = dist - targetDist;
    const springForce = diff * 0.025;

    const fx = (dx / dist) * springForce;
    const fy = (dy / dist) * springForce;

    if (s !== draggedNode) {
      s.vx += fx;
      s.vy += fy;
    }
    if (t !== draggedNode) {
      t.vx -= fx;
      t.vy -= fy;
    }
  }

  // Gravity towards center
  for (const n of nodes) {
    if (n === draggedNode) continue;
    const dx = centerX - n.x;
    const dy = centerY - n.y;
    n.vx += dx * 0.003;
    n.vy += dy * 0.003;

    // Damping / Friction
    n.vx *= 0.88;
    n.vy *= 0.88;

    n.x += n.vx;
    n.y += n.vy;
  }
}

function render() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const dpr = window.devicePixelRatio || 1;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Apply camera Pan & Zoom
  ctx.scale(dpr, dpr);
  ctx.translate(panX, panY);
  ctx.scale(scale, scale);

  // 1. Draw Links
  for (const link of links) {
    const s = link.sourceNode;
    const t = link.targetNode;
    const isHovered = hoveredNode.value && (hoveredNode.value.id === s.id || hoveredNode.value.id === t.id);
    
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(t.x, t.y);

    if (link.dashed) {
      ctx.setLineDash([4, 4]);
    } else {
      ctx.setLineDash([]);
    }

    if (isHovered) {
      ctx.strokeStyle = '#00d2d3';
      ctx.lineWidth = 2.2;
    } else if (hoveredNode.value) {
      ctx.strokeStyle = 'rgba(214, 182, 186, 0.06)';
      ctx.lineWidth = 1;
    } else {
      ctx.strokeStyle = link.dashed ? 'rgba(0, 206, 201, 0.22)' : 'rgba(214, 182, 186, 0.18)';
      ctx.lineWidth = 1.2;
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw directional signal dot along links
    const midX = (s.x * 0.4 + t.x * 0.6);
    const midY = (s.y * 0.4 + t.y * 0.6);
    ctx.fillStyle = isHovered ? '#00d2d3' : 'rgba(200, 155, 158, 0.35)';
    ctx.beginPath();
    ctx.arc(midX, midY, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Draw Nodes
  for (const n of nodes) {
    const isHovered = hoveredNode.value && hoveredNode.value.id === n.id;
    const isDimmed = hoveredNode.value && !isHovered && !links.some(l => (l.sourceNode.id === hoveredNode.value.id && l.targetNode.id === n.id) || (l.targetNode.id === hoveredNode.value.id && l.sourceNode.id === n.id));

    ctx.save();
    ctx.globalAlpha = isDimmed ? 0.3 : 1;

    // Glowing aura for coordinator and hovered nodes
    if (n.type === 'coordinator' || isHovered) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius + (isHovered ? 8 : 5), 0, Math.PI * 2);
      ctx.fillStyle = n.type === 'coordinator' ? 'rgba(0, 210, 211, 0.25)' : 'rgba(200, 155, 158, 0.3)';
      ctx.fill();
    }

    // Node body
    ctx.beginPath();
    if (n.type === 'coordinator') {
      // Rounded Rectangle for Coordinator (matching Zigbee2MQTT style)
      const r = n.radius * 1.4;
      ctx.roundRect(n.x - r, n.y - r * 0.75, r * 2, r * 1.5, 6);
    } else {
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
    }

    ctx.fillStyle = n.color;
    ctx.fill();
    ctx.strokeStyle = isHovered ? '#ffffff' : 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Node Text Label
    ctx.font = isHovered ? 'bold 11px Plus Jakarta Sans, sans-serif' : '10px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = isHovered ? '#ffffff' : '#baa6a8';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // Label placement
    const textOffset = n.radius + 8;
    ctx.fillText(n.label, n.x + textOffset, n.y - 3);

    // Sublabel
    if (n.sublabel) {
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillStyle = '#827072';
      ctx.fillText(n.sublabel, n.x + textOffset, n.y + 9);
    }

    ctx.restore();
  }

  ctx.restore();

  updatePhysics();
  animFrameId = requestAnimationFrame(render);
}

function handleResize() {
  const canvas = canvasRef.value;
  const wrapper = canvasWrapperRef.value;
  if (!canvas || !wrapper) return;
  const dpr = window.devicePixelRatio || 1;
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight || 540;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  if (nodes.length === 0) {
    initNodes(width, height);
  }
}

// Mouse / Touch Interaction
function getCanvasCoords(e) {
  const canvas = canvasRef.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  const rawX = e.clientX - rect.left;
  const rawY = e.clientY - rect.top;
  
  // Inverse view transform
  const x = (rawX - panX) / scale;
  const y = (rawY - panY) / scale;
  return { x, y, rawX, rawY };
}

function findNodeAt(x, y) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    const dx = n.x - x;
    const dy = n.y - y;
    if (Math.sqrt(dx * dx + dy * dy) <= n.radius + 6) {
      return n;
    }
  }
  return null;
}

function onMouseDown(e) {
  const { x, y, rawX, rawY } = getCanvasCoords(e);
  const node = findNodeAt(x, y);
  if (node) {
    draggedNode = node;
  } else {
    isPanning = true;
    startPanX = rawX - panX;
    startPanY = rawY - panY;
  }
}

function onMouseMove(e) {
  const { x, y, rawX, rawY } = getCanvasCoords(e);
  
  if (draggedNode) {
    draggedNode.x = x;
    draggedNode.y = y;
    draggedNode.vx = 0;
    draggedNode.vy = 0;
  } else if (isPanning) {
    panX = rawX - startPanX;
    panY = rawY - startPanY;
  } else {
    const node = findNodeAt(x, y);
    hoveredNode.value = node;
    if (node) {
      tooltipPos.value = { x: rawX + 15, y: rawY + 10 };
    }
  }
}

function onMouseUp() {
  draggedNode = null;
  isPanning = false;
}

function onMouseLeave() {
  draggedNode = null;
  isPanning = false;
  hoveredNode.value = null;
}

function onWheel(e) {
  e.preventDefault();
  const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
  const newScale = Math.max(0.4, Math.min(3.0, scale * zoomFactor));
  
  const canvas = canvasRef.value;
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    panX = mouseX - (mouseX - panX) * (newScale / scale);
    panY = mouseY - (mouseY - panY) * (newScale / scale);
  }
  scale = newScale;
}

function onTouchStart(e) {
  if (e.touches.length === 1) {
    const t = e.touches[0];
    onMouseDown({ clientX: t.clientX, clientY: t.clientY });
  }
}

function onTouchMove(e) {
  if (e.touches.length === 1) {
    const t = e.touches[0];
    onMouseMove({ clientX: t.clientX, clientY: t.clientY });
  }
}

function onTouchEnd() {
  onMouseUp();
}

// Graph Button Actions
function resetView() {
  scale = 1;
  panX = 0;
  panY = 0;
  const width = canvasWrapperRef.value ? canvasWrapperRef.value.clientWidth : 800;
  const height = canvasWrapperRef.value ? canvasWrapperRef.value.clientHeight : 540;
  initNodes(width, height);
}

function togglePhysics() {
  physicsEnabled.value = !physicsEnabled.value;
}

function reheatSimulation() {
  for (const n of nodes) {
    n.vx += (Math.random() - 0.5) * 15;
    n.vy += (Math.random() - 0.5) * 15;
  }
}

function zoomIn() {
  scale = Math.min(3.0, scale * 1.2);
}

function zoomOut() {
  scale = Math.max(0.4, scale * 0.8);
}

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  animFrameId = requestAnimationFrame(render);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
  }
});
</script>

<style scoped>
.schematic-container {
  display: flex;
  flex-direction: column;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-lg);
  position: relative;
}

.schematic-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  background: rgba(0, 0, 0, 0.15);
}

.schematic-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: lowercase;
}

.schematic-subtitle {
  font-size: 0.78rem;
  color: var(--text-muted);
  text-transform: lowercase;
  margin-top: 0.15rem;
}

.graph-controls {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.ctrl-btn {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.ctrl-btn svg {
  width: 16px;
  height: 16px;
}

.ctrl-btn:hover {
  background: #3e2a2c;
  border-color: rgba(214, 182, 186, 0.3);
  color: #f5ecec;
}

.ctrl-btn.active {
  background: #3e2a2c;
  border-color: rgba(214, 182, 186, 0.35);
  color: #c89b9e;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 540px;
  background-color: #0c090a;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(62, 42, 44, 0.35) 0%, transparent 70%),
    radial-gradient(circle at 10% 20%, rgba(0, 206, 201, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 40%);
  cursor: grab;
  overflow: hidden;
}

.canvas-wrapper:active {
  cursor: grabbing;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.node-tooltip {
  position: absolute;
  pointer-events: none;
  background: rgba(20, 15, 17, 0.95);
  border: 1px solid rgba(214, 182, 186, 0.25);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8);
  border-radius: var(--radius-md);
  padding: 0.75rem 0.95rem;
  z-index: 20;
  backdrop-filter: blur(8px);
  min-width: 180px;
}

.tooltip-title-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.35rem;
}

.tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.tooltip-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #f5ecec;
  text-transform: lowercase;
}

.tooltip-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.75rem;
  text-transform: lowercase;
}

.tooltip-k {
  color: var(--text-muted);
}

.tooltip-v {
  color: var(--text-primary);
  font-weight: 600;
}

.schematic-legend {
  padding: 0.75rem 1.5rem;
  background: rgba(0, 0, 0, 0.25);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.legend-chip {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-chip.coordinator {
  width: 14px;
  height: 10px;
  border-radius: 3px;
  background: #00d2d3;
}

.legend-chip.router {
  background: #00cec9;
}

.legend-chip.end-device {
  background: #10b981;
}

.legend-chip.offline {
  background: #e74c3c;
}

.legend-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: lowercase;
}

@media (max-width: 768px) {
  .canvas-wrapper {
    height: 400px;
  }
  .schematic-legend {
    gap: 0.75rem;
  }
}
</style>
