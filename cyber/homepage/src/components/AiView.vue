<template>
  <div class="ai-view fade-in">
    <!-- Top Workspace Header -->
    <div class="ai-header glass-panel">
      <div class="header-top-row">
        <div>
          <div class="room-badge-row">
            <span class="room-tag">ai threat ops ade</span>
            <h2 class="room-title">ai threat memory &amp; security mcp</h2>
          </div>
          <p class="room-subtitle">autonomous threat correlation agents, mitre att&amp;ck vector memory, sigma rule generators, and security model context protocols.</p>
        </div>

        <div class="ade-telemetry">
          <div class="tele-chip active">
            <span class="tele-dot green"></span>
            <span>mcp active (4 security servers)</span>
          </div>
          <div class="tele-chip">
            <span class="tele-dot purple"></span>
            <span>ai threat agent: online</span>
          </div>
          <div class="tele-chip">
            <span class="tele-dot cyan"></span>
            <span>mitre att&amp;ck rag: synced</span>
          </div>
          <div class="tele-chip">
            <span class="tele-dot amber"></span>
            <span>ioc extraction pipeline: live</span>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="sub-nav-row">
        <div class="sub-nav-tabs">
          <button 
            v-for="tab in subTabs" 
            :key="tab.id"
            class="sub-tab-btn" 
            :class="{ active: activeSubTab === tab.id }"
            @click="activeSubTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="view-mode-toggle">
          <button 
            class="mode-btn" 
            :class="{ active: viewMode === 'graph' }" 
            @click="viewMode = 'graph'"
          >
            <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8.7 10.7l6.6-3.4M8.7 13.3l6.6 3.4"/></svg>
            graph
          </button>
          <button 
            class="mode-btn" 
            :class="{ active: viewMode === 'markdown' }" 
            @click="viewMode = 'markdown'"
          >
            <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            markdown
          </button>
        </div>
      </div>
    </div>

    <!-- Main ADE Workspace -->
    <div class="ade-workspace glass-panel">
      <!-- Left Tree Explorer -->
      <aside class="ade-sidebar">
        <div class="sidebar-search">
          <svg class="search-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="search" type="text" placeholder="search agents, mcp, mitre rag..." />
        </div>

        <div class="tree-container">
          <div v-for="section in filteredSections" :key="section.name" class="tree-group">
            <div class="tree-group-header" @click="toggleGroup(section.name)">
              <span class="chevron" :class="{ rotated: openGroups[section.name] }">›</span>
              <span class="group-name">{{ section.name }}</span>
              <span class="group-count">{{ section.items.length }}</span>
            </div>

            <ul v-if="openGroups[section.name]" class="tree-item-list">
              <li 
                v-for="item in section.items" 
                :key="item.id"
                class="tree-item"
                :class="{ active: selectedItem && selectedItem.id === item.id }"
                @click="selectItem(item)"
              >
                <span class="item-dot" :style="{ backgroundColor: item.color || '#a855f7' }"></span>
                <span class="item-label">{{ item.name }}</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <!-- Center Content: Force-Directed Knowledge Graph OR Markdown View -->
      <main class="ade-center">
        <!-- View 1: Interactive AI Knowledge Graph -->
        <div v-if="viewMode === 'graph'" class="graph-canvas-box">
          <!-- Graph Toolbar -->
          <div class="graph-toolbar">
            <div class="pill-filters">
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterFolders" />
                <span>threat folders</span>
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterTags" />
                <span>mitre tags</span>
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" v-model="filterFocus" />
                <span>focus</span>
              </label>
              <span class="link-counter">⬡ {{ activeLinksCount }} links</span>
            </div>

            <div class="canvas-actions">
              <button class="icon-btn" @click="resetGraph" title="reset camera">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
              <button class="icon-btn" @click="reheatGraph" title="reheat physics">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              </button>
            </div>
          </div>

          <!-- Canvas Viewport -->
          <div class="canvas-viewport" ref="canvasWrapper">
            <canvas 
              ref="graphCanvas"
              @mousedown="onMouseDown"
              @mousemove="onMouseMove"
              @mouseup="onMouseUp"
              @mouseleave="onMouseLeave"
              @wheel="onWheel"
            ></canvas>

            <!-- Tooltip -->
            <div 
              v-if="hoveredNode" 
              class="ai-tooltip"
              :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }"
            >
              <div class="tooltip-header">
                <span class="tooltip-chip" :style="{ backgroundColor: hoveredNode.color }"></span>
                <strong>{{ hoveredNode.label }}</strong>
              </div>
              <p class="tooltip-type">{{ hoveredNode.category }} · {{ hoveredNode.type }}</p>
              <p class="tooltip-desc">{{ hoveredNode.description }}</p>
            </div>
          </div>
        </div>

        <!-- View 2: Markdown & Configuration Reader -->
        <div v-else class="markdown-reader">
          <div v-if="selectedItem" class="doc-container">
            <div class="doc-header">
              <div class="doc-badge-row">
                <span class="doc-cat-pill">{{ selectedItem.category }}</span>
                <span class="doc-type-pill">{{ selectedItem.type }}</span>
              </div>
              <h2 class="doc-title">{{ selectedItem.name }}</h2>
              <p class="doc-desc">{{ selectedItem.description }}</p>
            </div>

            <div class="doc-section" v-if="selectedItem.systemPrompt">
              <h3>agent directive &amp; system prompt</h3>
              <pre class="code-block"><code>{{ selectedItem.systemPrompt }}</code></pre>
            </div>

            <div class="doc-section" v-if="selectedItem.mcpConfig">
              <h3>security mcp server json configuration</h3>
              <pre class="code-block"><code>{{ JSON.stringify(selectedItem.mcpConfig, null, 2) }}</code></pre>
            </div>

            <div class="doc-section" v-if="selectedItem.vectorSchema">
              <h3>mitre att&amp;ck vector rag schema</h3>
              <div class="schema-grid">
                <div class="schema-item">
                  <span class="schema-k">embedding model:</span>
                  <span class="schema-v">{{ selectedItem.vectorSchema.model }}</span>
                </div>
                <div class="schema-item">
                  <span class="schema-k">dimensions:</span>
                  <span class="schema-v">{{ selectedItem.vectorSchema.dimensions }}d</span>
                </div>
                <div class="schema-item">
                  <span class="schema-k">index backend:</span>
                  <span class="schema-v">{{ selectedItem.vectorSchema.engine }}</span>
                </div>
              </div>
            </div>

            <div class="doc-section" v-if="selectedItem.quickCommand">
              <h3>cli execution command</h3>
              <pre class="code-block"><code>{{ selectedItem.quickCommand }}</code></pre>
            </div>
          </div>

          <div v-else class="empty-doc">
            <p>select an ai agent, security mcp server, or mitre memory node to view technical runbooks.</p>
          </div>
        </div>
      </main>

      <!-- Right Item Inspector Drawer -->
      <aside v-if="selectedItem" class="ade-inspector">
        <div class="inspector-header">
          <div class="inspector-title-row">
            <span class="inspector-dot" :style="{ backgroundColor: selectedItem.color || '#a855f7' }"></span>
            <h4>{{ selectedItem.name }}</h4>
          </div>
          <button class="close-inspector-btn" @click="selectedItem = null"></button>
        </div>

        <div class="inspector-body">
          <div class="inspect-item">
            <span class="inspect-label">category</span>
            <span class="inspect-val">{{ selectedItem.category }}</span>
          </div>
          <div class="inspect-item">
            <span class="inspect-label">type</span>
            <span class="inspect-val">{{ selectedItem.type }}</span>
          </div>
          <div class="inspect-item" v-if="selectedItem.endpoint">
            <span class="inspect-label">endpoint</span>
            <span class="inspect-val code-font">{{ selectedItem.endpoint }}</span>
          </div>
          <div class="inspect-item">
            <span class="inspect-label">summary</span>
            <p class="inspect-text">{{ selectedItem.description }}</p>
          </div>

          <div class="inspector-tags" v-if="selectedItem.tags">
            <span v-for="tag in selectedItem.tags" :key="tag" class="tag-pill">#{{ tag }}</span>
          </div>

          <button class="switch-doc-btn" @click="viewMode = 'markdown'">
            open full markdown docs 
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';

const activeSubTab = ref('all');
const viewMode = ref('graph');
const search = ref('');
const selectedItem = ref(null);
const hoveredNode = ref(null);
const tooltipPos = ref({ x: 0, y: 0 });

const canvasWrapper = ref(null);
const graphCanvas = ref(null);

const filterFolders = ref(true);
const filterTags = ref(true);
const filterFocus = ref(false);

const subTabs = [
  { id: 'all', label: 'all components' },
  { id: 'agents', label: 'threat agents' },
  { id: 'memory', label: 'mitre & ioc memory' },
  { id: 'skills', label: 'skills' },
  { id: 'mcp', label: 'security mcp' },
  { id: 'models', label: 'models & engines' }
];

const openGroups = reactive({
  ' pinned': true,
  ' threat agents': true,
  ' mitre & ioc memory': true,
  ' security mcp': true,
  ' skills': true,
  ' models & engines': true
});

function toggleGroup(name) {
  openGroups[name] = !openGroups[name];
}

// AI Knowledge Base Data for CyberLab
const aiKnowledgeData = [
  // Threat Agents
  {
    id: 'ai-threat-correlation-agent',
    name: 'ai threat correlation agent',
    category: 'agents',
    type: 'soc correlation engine',
    color: '#c084fc',
    radius: 16,
    endpoint: 'python3 ai/agent.py',
    description: 'autonomous threat hunter reading unified auth.log/syslog, extracting malicious iocs, mapping to mitre att&ck techniques, and generating markdown incident reports.',
    tags: ['agent', 'mitre', 'threat-hunting', 'ioc-parser', 'soc'],
    systemPrompt: `you are the cyberlab autonomous threat hunting agent. analyze log events, identify brute-force patterns, map to mitre t1110, t1046, t1059, and produce automated executive incident reports.`,
    quickCommand: 'python3 ai/agent.py --logs /var/log/auth.log --output report.md'
  },
  {
    id: 'ioc-extractor-engine',
    name: 'ioc regex & ner extractor',
    category: 'agents',
    type: 'threat intelligence parser',
    color: '#c084fc',
    radius: 14,
    endpoint: 'python3 ai/ioc_extractor.py',
    description: 'high-throughput regex & ner artifact extractor capturing ipv4/ipv6, fqdn c2 domains, md5/sha-256 hashes, and anomalous base64 payloads.',
    tags: ['agent', 'ioc', 'regex', 'ner', 'intel'],
    quickCommand: 'python3 ai/ioc_extractor.py --input /var/log/suricata/eve.json'
  },
  {
    id: 'sigma-rule-synth-agent',
    name: 'sigma rule generator agent',
    category: 'agents',
    type: 'rule synthesis engine',
    color: '#c084fc',
    radius: 13,
    description: 'translates red team execution telemetry from atomic red team runs directly into reusable production sigma detection rules.',
    tags: ['agent', 'sigma', 'detection-as-code', 'yaml']
  },
  {
    id: 'wazuh-active-response-ai',
    name: 'wazuh active response daemon',
    category: 'agents',
    type: 'automated ips agent',
    color: '#c084fc',
    radius: 13,
    description: 'evaluates real-time agent heuristic anomaly scores and triggers host quarantine / firewall drop rules.',
    tags: ['agent', 'wazuh', 'ips', 'quarantine']
  },

  // Security MCP
  {
    id: 'wazuh-mcp',
    name: 'wazuh-siem-mcp',
    category: 'mcp',
    type: 'security model context protocol',
    color: '#8e5e63',
    radius: 13,
    endpoint: 'mcp://wazuh.soc.lan:55000',
    description: 'mcp tool interface querying wazuh agents, active rule alerts, syscheck fim violations, and rootcheck vulnerabilities.',
    tags: ['mcp', 'wazuh', 'siem', 'tool-calling'],
    mcpConfig: {
      mcpServers: {
        wazuh: {
          command: "node",
          args: ["/opt/cyberlab/mcp/wazuh-mcp.js"],
          env: { WAZUH_API: "https://192.168.64.33:55000" }
        }
      }
    }
  },
  {
    id: 'suricata-mcp',
    name: 'suricata-eve-mcp',
    category: 'mcp',
    type: 'security model context protocol',
    color: '#8e5e63',
    radius: 13,
    endpoint: 'mcp://suricata.soc.lan',
    description: 'streams live eve.json deep packet inspection alerts, tls certificate fingerprints, and http payload metadata to llm agents.',
    tags: ['mcp', 'suricata', 'nids', 'eve.json']
  },
  {
    id: 'kali-offensive-mcp',
    name: 'kali-sandbox-mcp',
    category: 'mcp',
    type: 'offensive model context protocol',
    color: '#8e5e63',
    radius: 12,
    endpoint: 'mcp://kali.utm.lan:2222',
    description: 'safely executes sandboxed offensive reconnaissance (nmap, nikto, metasploit checks) inside isolated utm vm via mcp.',
    tags: ['mcp', 'kali', 'offensive', 'sandbox']
  },
  {
    id: 'chainsaw-mcp',
    name: 'chainsaw-evtx-mcp',
    category: 'mcp',
    type: 'forensics model context protocol',
    color: '#8e5e63',
    radius: 12,
    endpoint: 'mcp://chainsaw.dfir.lan',
    description: 'fast rust-powered evtx log parser matching windows event logs against sigma rules directly from agent tool calls.',
    tags: ['mcp', 'chainsaw', 'dfir', 'sigma', 'rust']
  },

  // MITRE & Memory
  {
    id: 'mitre-attack-rag',
    name: 'mitre enterprise att&ck rag memory',
    category: 'memory',
    type: 'vector semantic index',
    color: '#a855f7',
    radius: 15,
    description: 'chromadb vector store containing all 190+ enterprise mitre att&ck techniques, tactics, sub-techniques, and detection mitigations.',
    tags: ['memory', 'mitre', 'att&ck', 'rag', 'embeddings'],
    vectorSchema: { model: 'sentence-transformers/all-MiniLM-L6-v2', dimensions: 384, engine: 'chromadb local' }
  },
  {
    id: 'cve-exploit-memory',
    name: 'cve & kev vulnerability vector store',
    category: 'memory',
    type: 'cve intelligence index',
    color: '#a855f7',
    radius: 13,
    description: 'indexed database of known exploited vulnerabilities (cisa kev) and proof-of-concept exploit patterns.',
    tags: ['memory', 'cve', 'kev', 'vulnerabilities']
  },
  {
    id: 'dfir-playbook-memory',
    name: 'dfir live incident triage memory',
    category: 'memory',
    type: 'playbook semantic store',
    color: '#a855f7',
    radius: 13,
    description: 'step-by-step incident response runbooks for compromised ssh keys, web shell discovery, and lateral movement isolation.',
    tags: ['memory', 'dfir', 'runbooks', 'playbooks']
  },

  // Skills
  {
    id: 'adversary-emulation-skill',
    name: 'adversary-emulation-skill',
    category: 'skills',
    type: 'executable skill',
    color: '#6b9e78',
    radius: 11,
    description: 'automates multi-stage attack simulations using atomic red team and linpeas, logging full telemetry to suricata and wazuh.',
    tags: ['skill', 'red-team', 'mitre', 'emulation']
  },
  {
    id: 'ioc-triage-skill',
    name: 'ioc-triage-skill',
    category: 'skills',
    type: 'executable skill',
    color: '#6b9e78',
    radius: 11,
    description: 'queries virustotal, abuseipdb, and cisa feeds to calculate composite risk scores for extracted threat indicators.',
    tags: ['skill', 'osint', 'ioc', 'enrichment']
  },
  {
    id: 'live-pcap-dissect-skill',
    name: 'live-pcap-dissect-skill',
    category: 'skills',
    type: 'executable skill',
    color: '#6b9e78',
    radius: 10,
    description: 'extracts http headers, tls ja3/ja4 hashes, and dns tunneling payloads using tshark and cyberchef.',
    tags: ['skill', 'pcap', 'wireshark', 'ja3']
  },

  // Models & Engines
  {
    id: 'sec-bert-model',
    name: 'sec-bert / local threat llm',
    category: 'models',
    type: 'cybersecurity language model',
    color: '#cfa16a',
    radius: 13,
    endpoint: 'http://localhost:11434/api/generate',
    description: 'specialized local llm fine-tuned for log triage, deobfuscating malicious powershell/bash, and explaining cve impact.',
    tags: ['model', 'sec-bert', 'local-llm', 'nlp']
  },
  {
    id: 'suricata-eve-stream',
    name: 'suricata eve.json stream engine',
    category: 'models',
    type: 'telemetry streaming engine',
    color: '#cfa16a',
    radius: 13,
    description: 'real-time socket stream broadcasting json alert events to promtail, loki, and ai correlation agent.',
    tags: ['telemetry', 'suricata', 'streaming', 'eve']
  }
];

const aiGraphLinks = [
  // Agent -> MCP
  { source: 'ai-threat-correlation-agent', target: 'wazuh-mcp' },
  { source: 'ai-threat-correlation-agent', target: 'suricata-mcp' },
  { source: 'ai-threat-correlation-agent', target: 'chainsaw-mcp' },
  { source: 'ioc-extractor-engine', target: 'suricata-mcp' },
  { source: 'adversary-emulation-skill', target: 'kali-offensive-mcp' },

  // Agent -> Memory
  { source: 'ai-threat-correlation-agent', target: 'mitre-attack-rag' },
  { source: 'ai-threat-correlation-agent', target: 'cve-exploit-memory' },
  { source: 'ai-threat-correlation-agent', target: 'dfir-playbook-memory' },
  { source: 'sigma-rule-synth-agent', target: 'mitre-attack-rag' },

  // Agent -> Skills
  { source: 'ai-threat-correlation-agent', target: 'ioc-triage-skill' },
  { source: 'ai-threat-correlation-agent', target: 'live-pcap-dissect-skill' },

  // Memory -> Memory
  { source: 'mitre-attack-rag', target: 'cve-exploit-memory' },
  { source: 'mitre-attack-rag', target: 'dfir-playbook-memory' },

  // Models & Engines
  { source: 'ai-threat-correlation-agent', target: 'sec-bert-model' },
  { source: 'suricata-eve-stream', target: 'ioc-extractor-engine' },
  { source: 'wazuh-active-response-ai', target: 'wazuh-mcp' }
];

const treeSections = computed(() => {
  return [
    {
      name: ' pinned',
      items: [
        aiKnowledgeData.find(i => i.id === 'ai-threat-correlation-agent'),
        aiKnowledgeData.find(i => i.id === 'mitre-attack-rag'),
        aiKnowledgeData.find(i => i.id === 'wazuh-mcp')
].filter(Boolean)
    },
    {
      name: ' threat agents',
      items: aiKnowledgeData.filter(i => i.category === 'agents')
    },
    {
      name: ' mitre & ioc memory',
      items: aiKnowledgeData.filter(i => i.category === 'memory')
    },
    {
      name: ' security mcp',
      items: aiKnowledgeData.filter(i => i.category === 'mcp')
    },
    {
      name: ' skills',
      items: aiKnowledgeData.filter(i => i.category === 'skills')
    },
    {
      name: ' models & engines',
      items: aiKnowledgeData.filter(i => i.category === 'models')
    }
];
});

const filteredSections = computed(() => {
  if (!search.value.trim()) return treeSections.value;
  const q = search.value.toLowerCase();
  return treeSections.value.map(s => ({
    ...s,
    items: s.items.filter(i => 
      i.name.toLowerCase().includes(q) || 
      i.description.toLowerCase().includes(q) ||
      (i.tags && i.tags.some(t => t.toLowerCase().includes(q)))
    )
  })).filter(s => s.items.length > 0);
});

const activeLinksCount = computed(() => aiGraphLinks.length);

function selectItem(item) {
  selectedItem.value = item;
}

let graphNodes = [];
let graphLinks = [];
let scale = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;
let draggedNode = null;
let animFrameId = null;

function initGraph(width, height) {
  const centerX = width / 2;
  const centerY = height / 2;

  graphNodes = aiKnowledgeData.map((n, idx) => {
    const angle = (idx / aiKnowledgeData.length) * Math.PI * 2;
    const dist = n.category === 'agents' ? 100 : n.category === 'memory' ? 170 : 240;
    return {
      ...n,
      label: n.name,
      x: centerX + Math.cos(angle) * dist + (Math.random() - 0.5) * 40,
      y: centerY + Math.sin(angle) * dist + (Math.random() - 0.5) * 40,
      vx: 0,
      vy: 0
    };
  });

  graphLinks = aiGraphLinks.map(l => ({
    ...l,
    sourceNode: graphNodes.find(n => n.id === l.source),
    targetNode: graphNodes.find(n => n.id === l.target)
  })).filter(l => l.sourceNode && l.targetNode);
}

function updatePhysics() {
  const width = canvasWrapper.value ? canvasWrapper.value.clientWidth : 700;
  const height = canvasWrapper.value ? canvasWrapper.value.clientHeight : 500;
  const centerX = width / 2;
  const centerY = height / 2;

  for (let i = 0; i < graphNodes.length; i++) {
    for (let j = i + 1; j < graphNodes.length; j++) {
      const n1 = graphNodes[i];
      const n2 = graphNodes[j];
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const repForce = Math.min(6500 / (dist * dist), 10);
      const fx = (dx / dist) * repForce;
      const fy = (dy / dist) * repForce;

      if (n1 !== draggedNode) { n1.vx -= fx; n1.vy -= fy; }
      if (n2 !== draggedNode) { n2.vx += fx; n2.vy += fy; }
    }
  }

  for (const link of graphLinks) {
    const s = link.sourceNode;
    const t = link.targetNode;
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const springForce = (dist - 120) * 0.03;
    const fx = (dx / dist) * springForce;
    const fy = (dy / dist) * springForce;

    if (s !== draggedNode) { s.vx += fx; s.vy += fy; }
    if (t !== draggedNode) { t.vx -= fx; t.vy += fy; }
  }

  for (const n of graphNodes) {
    if (n === draggedNode) continue;
    n.vx += (centerX - n.x) * 0.003;
    n.vy += (centerY - n.y) * 0.003;
    n.vx *= 0.88;
    n.vy *= 0.88;
    n.x += n.vx;
    n.y += n.vy;
  }
}

function renderGraph() {
  const canvas = graphCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.scale(dpr, dpr);
  ctx.translate(panX, panY);
  ctx.scale(scale, scale);

  // Draw Curved Bezier Links
  for (const link of graphLinks) {
    const s = link.sourceNode;
    const t = link.targetNode;
    const isHovered = hoveredNode.value && (hoveredNode.value.id === s.id || hoveredNode.value.id === t.id);

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    
    const midX = (s.x + t.x) / 2;
    const midY = (s.y + t.y) / 2;
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const normalX = -dy * 0.15;
    const normalY = dx * 0.15;

    ctx.quadraticCurveTo(midX + normalX, midY + normalY, t.x, t.y);

    if (isHovered) {
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.2;
    } else {
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.22)';
      ctx.lineWidth = 1.2;
    }
    ctx.stroke();
  }

  // Draw Nodes
  for (const n of graphNodes) {
    const isHovered = hoveredNode.value && hoveredNode.value.id === n.id;
    const isSelected = selectedItem.value && selectedItem.value.id === n.id;

    ctx.save();

    if (isHovered || isSelected) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius + 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(192, 132, 252, 0.25)';
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
    ctx.fillStyle = n.color || '#a855f7';
    ctx.fill();
    ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = isHovered || isSelected ? 'bold 10px Plus Jakarta Sans, sans-serif' : '9px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = isHovered || isSelected ? '#ffffff' : '#baa6a8';
    ctx.textAlign = 'center';
    ctx.fillText(n.name, n.x, n.y + n.radius + 12);

    ctx.restore();
  }

  ctx.restore();

  updatePhysics();
  animFrameId = requestAnimationFrame(renderGraph);
}

function handleResize() {
  const canvas = graphCanvas.value;
  const wrapper = canvasWrapper.value;
  if (!canvas || !wrapper) return;
  const dpr = window.devicePixelRatio || 1;
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight || 520;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  if (graphNodes.length === 0) {
    initGraph(width, height);
  }
}

function getCoords(e) {
  const canvas = graphCanvas.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  const rawX = e.clientX - rect.left;
  const rawY = e.clientY - rect.top;
  const x = (rawX - panX) / scale;
  const y = (rawY - panY) / scale;
  return { x, y, rawX, rawY };
}

function findNode(x, y) {
  for (let i = graphNodes.length - 1; i >= 0; i--) {
    const n = graphNodes[i];
    const dx = n.x - x;
    const dy = n.y - y;
    if (Math.sqrt(dx * dx + dy * dy) <= n.radius + 6) return n;
  }
  return null;
}

function onMouseDown(e) {
  const { x, y, rawX, rawY } = getCoords(e);
  const n = findNode(x, y);
  if (n) {
    draggedNode = n;
    selectedItem.value = n;
  } else {
    isPanning = true;
    startPanX = rawX - panX;
    startPanY = rawY - panY;
  }
}

function onMouseMove(e) {
  const { x, y, rawX, rawY } = getCoords(e);
  if (draggedNode) {
    draggedNode.x = x;
    draggedNode.y = y;
    draggedNode.vx = 0;
    draggedNode.vy = 0;
  } else if (isPanning) {
    panX = rawX - startPanX;
    panY = rawY - startPanY;
  } else {
    const n = findNode(x, y);
    hoveredNode.value = n;
    if (n) {
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
  const canvas = graphCanvas.value;
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    panX = mouseX - (mouseX - panX) * (newScale / scale);
    panY = mouseY - (mouseY - panY) * (newScale / scale);
  }
  scale = newScale;
}

function resetGraph() {
  scale = 1;
  panX = 0;
  panY = 0;
  const width = canvasWrapper.value ? canvasWrapper.value.clientWidth : 700;
  const height = canvasWrapper.value ? canvasWrapper.value.clientHeight : 520;
  initGraph(width, height);
}

function reheatGraph() {
  for (const n of graphNodes) {
    n.vx += (Math.random() - 0.5) * 15;
    n.vy += (Math.random() - 0.5) * 15;
  }
}

onMounted(() => {
  selectedItem.value = aiKnowledgeData[0];
  handleResize();
  window.addEventListener('resize', handleResize);
  animFrameId = requestAnimationFrame(renderGraph);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (animFrameId) cancelAnimationFrame(animFrameId);
});
</script>

<style scoped>
.ai-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
}

.ai-header {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.room-badge-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.25rem;
}

.room-tag {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: #c084fc;
  background: rgba(168, 85, 247, 0.12);
  border: 1px solid rgba(168, 85, 247, 0.25);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: lowercase;
}

.room-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  text-transform: lowercase;
}

.room-subtitle {
  font-size: 0.82rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.ade-telemetry {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tele-chip {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-family: var(--font-mono);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  padding: 0.3rem 0.65rem;
  border-radius: 20px;
  color: var(--text-secondary);
  text-transform: lowercase;
}

.tele-chip.active {
  background: rgba(107, 158, 120, 0.12);
  border-color: rgba(107, 158, 120, 0.3);
  color: var(--accent-green);
}

.tele-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.tele-dot.green { background: #6b9e78; box-shadow: 0 0 6px #6b9e78; }
.tele-dot.purple { background: #a855f7; box-shadow: 0 0 6px #a855f7; }
.tele-dot.cyan { background: #00cec9; box-shadow: 0 0 6px #00cec9; }
.tele-dot.amber { background: #cfa16a; box-shadow: 0 0 6px #cfa16a; }

.sub-nav-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  flex-wrap: wrap;
}

.sub-nav-tabs {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.sub-tab-btn {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  text-transform: lowercase;
  transition: all 0.15s ease;
}

.sub-tab-btn:hover {
  color: var(--text-primary);
  border-color: var(--border-color-hover);
}

.sub-tab-btn.active {
  background: #3e2a2c;
  border-color: rgba(214, 182, 186, 0.3);
  color: #f5ecec;
}

.view-mode-toggle {
  display: flex;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.2rem;
  gap: 0.2rem;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-transform: lowercase;
}

.mode-btn.active {
  background: #3e2a2c;
  color: #f5ecec;
}

/* ADE Split Workspace */
.ade-workspace {
  display: flex;
  min-height: 560px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.ade-sidebar {
  width: 250px;
  background: rgba(0, 0, 0, 0.25);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.sidebar-search {
  position: relative;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.search-svg {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--text-muted);
}

.sidebar-search input {
  width: 100%;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.4rem 0.6rem 0.4rem 2rem;
  font-size: 0.75rem;
  color: var(--text-primary);
  outline: none;
  text-transform: lowercase;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.tree-group {
  margin-bottom: 0.25rem;
}

.tree-group-header {
  display: flex;
  align-items: center;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: lowercase;
  gap: 0.35rem;
}

.tree-group-header:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.02);
}

.chevron {
  font-size: 0.85rem;
  transition: transform 0.15s ease;
}

.chevron.rotated {
  transform: rotate(90deg);
}

.group-name {
  flex: 1;
}

.group-count {
  font-size: 0.65rem;
  font-family: var(--font-mono);
  background: rgba(255, 255, 255, 0.04);
  padding: 0.05rem 0.3rem;
  border-radius: 8px;
}

.tree-item-list {
  list-style: none;
  padding-left: 1.25rem;
}

.tree-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.65rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  margin: 0.1rem 0.4rem 0.1rem 0;
  text-transform: lowercase;
}

.tree-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
}

.tree-item.active {
  background: #3e2a2c;
  color: #f5ecec;
  font-weight: 600;
  border: 1px solid rgba(214, 182, 186, 0.2);
}

.item-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.item-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ADE Center */
.ade-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #0d090a;
}

.graph-canvas-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.graph-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid var(--border-color);
  background: rgba(0, 0, 0, 0.2);
}

.pill-filters {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  color: var(--text-secondary);
  cursor: pointer;
  text-transform: lowercase;
}

.link-counter {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  color: #c084fc;
  background: rgba(168, 85, 247, 0.1);
  padding: 0.15rem 0.45rem;
  border-radius: 10px;
}

.canvas-actions {
  display: flex;
  gap: 0.3rem;
}

.icon-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn svg { width: 14px; height: 14px; }
.icon-btn:hover { background: #3e2a2c; color: #f5ecec; }

.canvas-viewport {
  flex: 1;
  position: relative;
  cursor: grab;
  overflow: hidden;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 65%),
    radial-gradient(circle at 10% 80%, rgba(62, 42, 44, 0.35) 0%, transparent 50%);
}

.canvas-viewport:active {
  cursor: grabbing;
}

.canvas-viewport canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.ai-tooltip {
  position: absolute;
  pointer-events: none;
  background: rgba(20, 15, 17, 0.95);
  border: 1px solid rgba(214, 182, 186, 0.25);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.85rem;
  z-index: 20;
  backdrop-filter: blur(8px);
  min-width: 200px;
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: #f5ecec;
  margin-bottom: 0.2rem;
  text-transform: lowercase;
}

.tooltip-chip { width: 8px; height: 8px; border-radius: 50%; }
.tooltip-type { font-size: 0.7rem; color: #c084fc; font-family: var(--font-mono); text-transform: lowercase; }
.tooltip-desc { font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem; text-transform: lowercase; }

/* Markdown Reader */
.markdown-reader {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.doc-header {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
}

.doc-badge-row {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
}

.doc-cat-pill {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  background: rgba(168, 85, 247, 0.12);
  color: #c084fc;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  text-transform: lowercase;
}

.doc-type-pill {
  font-size: 0.68rem;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  text-transform: lowercase;
}

.doc-title {
  font-size: 1.35rem;
  color: var(--text-primary);
  margin-bottom: 0.3rem;
  text-transform: lowercase;
}

.doc-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: lowercase;
}

.doc-section {
  margin-bottom: 1.25rem;
}

.doc-section h3 {
  font-size: 0.8rem;
  font-family: var(--font-mono);
  color: var(--text-muted);
  margin-bottom: 0.4rem;
  text-transform: lowercase;
}

.code-block {
  background: #060405;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.85rem;
  font-size: 0.78rem;
  color: #c084fc;
  overflow-x: auto;
}

.schema-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
}

.schema-item {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.schema-k { font-size: 0.7rem; color: var(--text-muted); text-transform: lowercase; }
.schema-v { font-size: 0.8rem; color: var(--text-primary); font-family: var(--font-mono); font-weight: 600; text-transform: lowercase; }

.empty-doc {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

/* Right Inspector */
.ade-inspector {
  width: 260px;
  background: rgba(0, 0, 0, 0.35);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.inspector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.inspector-title-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.inspector-dot { width: 8px; height: 8px; border-radius: 50%; }
.inspector-title-row h4 { font-size: 0.85rem; color: var(--text-primary); text-transform: lowercase; }
.close-inspector-btn { color: var(--text-muted); font-size: 0.85rem; }

.inspector-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.inspect-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.inspect-label { font-size: 0.68rem; color: var(--text-muted); text-transform: lowercase; }
.inspect-val { font-size: 0.78rem; color: var(--text-primary); font-weight: 600; text-transform: lowercase; }
.inspect-text { font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4; text-transform: lowercase; }

.inspector-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.25rem;
}

.tag-pill {
  font-size: 0.68rem;
  color: #c084fc;
  background: rgba(168, 85, 247, 0.08);
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-sm);
  text-transform: lowercase;
}

.switch-doc-btn {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #f5ecec;
  background: #3e2a2c;
  border: 1px solid rgba(214, 182, 186, 0.25);
  padding: 0.45rem;
  border-radius: var(--radius-md);
  text-transform: lowercase;
  text-align: center;
}

.switch-doc-btn:hover {
  background: #54393c;
}

@media (max-width: 1024px) {
  .ade-workspace {
    flex-direction: column;
  }
  .ade-sidebar, .ade-inspector {
    width: 100%;
  }
  .canvas-viewport {
    height: 400px;
  }
}
</style>
