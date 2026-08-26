<template>
  <div class="saas-suite fade-in">
    <!-- Top Suite Header -->
    <div class="suite-header glass-panel">
      <div class="header-top-row">
        <div>
          <div class="suite-badge-row">
            <span class="suite-tag">homelab custom saas lab</span>
            <h2 class="suite-title">custom-built homelab &amp; saas service replacements</h2>
          </div>
          <p class="suite-subtitle">
            in-house microservices &amp; developer tools built from scratch to replace third-party software (uptime kuma, it-tools, changedetection, gitea, woodpecker ci).
          </p>
        </div>

        <div class="suite-stats">
          <div class="stat-pill active">
            <span class="stat-dot green"></span>
            <span>5 custom services ready</span>
          </div>
          <div class="stat-pill">
            <span class="stat-dot cyan"></span>
            <span>local dev server: active</span>
          </div>
          <div class="stat-pill">
            <span class="stat-dot purple"></span>
            <span>proxmox staging: pending deploy</span>
          </div>
        </div>
      </div>

      <!-- App Switcher Tabs -->
      <div class="app-switcher-tabs">
        <button 
          v-for="app in appsList" 
          :key="app.id"
          class="app-tab-btn" 
          :class="{ active: currentApp === app.id }"
          @click="currentApp = app.id"
        >
          <span class="app-icon" :style="{ color: app.color }">{{ app.icon }}</span>
          <div class="app-tab-text">
            <span class="app-tab-title">{{ app.name }}</span>
            <span class="app-tab-replaces">replaces {{ app.replaces }}</span>
          </div>
          <span class="tier-pill" :class="app.tier">{{ app.tier }}</span>
        </button>
      </div>
    </div>

    <!-- MAIN APP CONTAINER -->
    <div class="app-viewport glass-panel">
      <!-- 1. PULSEGUARD: UPTIME MONITOR & STATUS PAGE (Replaces Uptime Kuma) -->
      <div v-if="currentApp === 'pulseguard'" class="app-screen">
        <div class="app-banner">
          <div>
            <div class="banner-title-row">
              <h3 class="banner-title">pulseguard &bull; uptime monitoring &amp; status pages</h3>
              <span class="status-chip operational">all systems operational &bull; 99.98%</span>
            </div>
            <p class="banner-desc">zero-dependency http/tcp heartbeat check engine with public status page builder and webhook alert dispatch.</p>
          </div>
          <div class="banner-actions">
            <button class="action-btn" @click="showNewMonitorModal = true">+ add monitor</button>
            <button class="action-btn outline" @click="toggleStatusPageMode">
              {{ statusPageMode ? 'view admin dashboard' : 'preview public status page' }}
            </button>
          </div>
        </div>

        <!-- Mode A: Public Status Page View -->
        <div v-if="statusPageMode" class="status-page-preview">
          <div class="sp-header">
            <div class="sp-brand">
              <span class="sp-logo">⬢</span>
              <h2>homelab network status</h2>
            </div>
            <div class="sp-badge operational">all systems operational</div>
          </div>

          <div class="sp-group" v-for="cat in ['core network', 'compute & iot', 'storage & media']" :key="cat">
            <h4 class="sp-group-title">{{ cat }}</h4>
            <div class="sp-cards">
              <div v-for="m in uptimeMonitors.filter(x => x.group === cat)" :key="m.id" class="sp-card">
                <div class="sp-card-top">
                  <span class="sp-name">{{ m.name }}</span>
                  <span class="sp-status" :class="m.status">{{ m.status }}</span>
                </div>
                <div class="sp-bars">
                  <div 
                    v-for="(bar, idx) in m.history" 
                    :key="idx" 
                    class="sp-bar" 
                    :class="bar"
                    :title="`day ${90 - idx}: ${bar}`"
                  ></div>
                </div>
                <div class="sp-card-bot">
                  <span class="sp-meta">90 days ago</span>
                  <span class="sp-uptime">{{ m.uptime }}% uptime</span>
                  <span class="sp-meta">today ({{ m.latency }}ms)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mode B: Admin Monitor Management View -->
        <div v-else class="monitors-admin-grid">
          <div class="monitors-list">
            <div 
              v-for="m in uptimeMonitors" 
              :key="m.id" 
              class="monitor-row"
              :class="{ active: selectedMonitor && selectedMonitor.id === m.id }"
              @click="selectedMonitor = m"
            >
              <div class="m-left">
                <span class="m-dot" :class="m.status"></span>
                <div>
                  <div class="m-name">{{ m.name }}</div>
                  <div class="m-url code-font">{{ m.target }}</div>
                </div>
              </div>
              <div class="m-right">
                <span class="m-pill">{{ m.interval }}s</span>
                <span class="m-latency code-font">{{ m.latency }}ms</span>
                <span class="m-uptime">{{ m.uptime }}%</span>
              </div>
            </div>
          </div>

          <div class="monitor-detail-panel" v-if="selectedMonitor">
            <div class="detail-header">
              <div>
                <span class="detail-tag">{{ selectedMonitor.group }} &bull; {{ selectedMonitor.type }}</span>
                <h3 class="detail-name">{{ selectedMonitor.name }}</h3>
                <code class="detail-url">{{ selectedMonitor.target }}</code>
              </div>
              <button class="test-ping-btn" @click="simulatePing(selectedMonitor)">
                ⚡ ping now
              </button>
            </div>

            <div class="detail-stats-grid">
              <div class="d-stat">
                <span class="d-label">current response time</span>
                <span class="d-val code-font">{{ selectedMonitor.latency }} ms</span>
              </div>
              <div class="d-stat">
                <span class="d-label">24h average</span>
                <span class="d-val code-font">{{ Math.round(selectedMonitor.latency * 0.95) }} ms</span>
              </div>
              <div class="d-stat">
                <span class="d-label">30-day uptime</span>
                <span class="d-val code-font text-emerald">{{ selectedMonitor.uptime }}%</span>
              </div>
              <div class="d-stat">
                <span class="d-label">ssl cert expiry</span>
                <span class="d-val code-font">{{ selectedMonitor.sslDays }} days remaining</span>
              </div>
            </div>

            <div class="response-chart-box">
              <h4 class="chart-title">response latency sparkline (last 20 checks)</h4>
              <div class="sparkline">
                <div 
                  v-for="(val, i) in selectedMonitor.sparkline" 
                  :key="i"
                  class="spark-col"
                  :style="{ height: Math.min(100, Math.max(15, val * 1.5)) + '%' }"
                  :title="`${val}ms`"
                ></div>
              </div>
            </div>

            <div class="incident-history">
              <h4 class="chart-title">recent incident logs</h4>
              <div class="incident-item clean" v-if="selectedMonitor.status === 'up'">
                <span class="inc-icon">✓</span>
                <span class="inc-text">no open incidents recorded in the past 7 days. heartbeats stable.</span>
              </div>
              <div class="incident-item degraded" v-else>
                <span class="inc-icon">⚠</span>
                <span class="inc-text">intermittent dns lookup timeout detected 14 minutes ago. resolved automatically.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. DEVFORGE: DEVELOPER TOOLS HUB (Replaces IT-Tools) -->
      <div v-else-if="currentApp === 'devforge'" class="app-screen">
        <div class="devforge-layout">
          <!-- Sidebar of tools -->
          <div class="tools-sidebar">
            <div class="sidebar-search">
              <input v-model="devToolSearch" type="text" placeholder="search 12+ developer utilities..." />
            </div>
            <div class="tools-category" v-for="cat in devToolCategories" :key="cat.name">
              <span class="cat-title">{{ cat.name }}</span>
              <button 
                v-for="t in cat.tools.filter(x => !devToolSearch || x.name.toLowerCase().includes(devToolSearch.toLowerCase()))"
                :key="t.id"
                class="tool-btn"
                :class="{ active: activeDevTool === t.id }"
                @click="activeDevTool = t.id"
              >
                <span class="tool-icon">{{ t.icon }}</span>
                <span class="tool-title">{{ t.name }}</span>
              </button>
            </div>
          </div>

          <!-- Tool Workspace -->
          <div class="tool-workspace">
            <!-- Tool: JWT Debugger -->
            <div v-if="activeDevTool === 'jwt'" class="tool-pane">
              <h3 class="pane-title">jwt debugger &amp; claim decoder</h3>
              <p class="pane-desc">decode json web tokens, verify expiration timestamps, and inspect header/payload structures.</p>
              
              <div class="jwt-grid">
                <div class="jwt-col">
                  <label class="input-lbl">encoded token</label>
                  <textarea v-model="jwtInput" class="code-textarea" rows="7" placeholder="paste eyJhbGciOi..."></textarea>
                </div>
                <div class="jwt-col">
                  <label class="input-lbl">decoded header &amp; payload</label>
                  <div class="decoded-view">
                    <pre class="json-code"><code>{{ parsedJwt }}</code></pre>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tool: UUID / ULID Generator -->
            <div v-else-if="activeDevTool === 'uuid'" class="tool-pane">
              <h3 class="pane-title">uuid &amp; nanoid generator</h3>
              <p class="pane-desc">generate cryptographically random uuid v4, v7, ulid, or nanoids with batch export.</p>

              <div class="gen-controls">
                <div class="gen-row">
                  <label>format:</label>
                  <select v-model="uuidFormat" class="saas-select">
                    <option value="uuidv4">uuid v4 (standard)</option>
                    <option value="ulid">ulid (sortable)</option>
                    <option value="nanoid">nanoid (compact)</option>
                  </select>
                  <label>quantity:</label>
                  <input v-model.number="uuidCount" type="number" min="1" max="50" class="saas-num-input" />
                  <button class="action-btn" @click="generateUuids">regenerate</button>
                  <button class="action-btn outline" @click="copyAll(generatedUuids.join('\n'))">copy all</button>
                </div>
              </div>

              <div class="uuid-list-box">
                <div v-for="(id, idx) in generatedUuids" :key="idx" class="uuid-row code-font">
                  <span>{{ id }}</span>
                  <button class="copy-small-btn" @click="copyAll(id)">copy</button>
                </div>
              </div>
            </div>

            <!-- Tool: JSON Formatter & Validator -->
            <div v-else-if="activeDevTool === 'json'" class="tool-pane">
              <h3 class="pane-title">json formatter, validator &amp; minifier</h3>
              <p class="pane-desc">format messy json objects, validate schema syntax, or compact for production payloads.</p>

              <div class="json-toolbar">
                <button class="action-btn small" @click="formatJson(2)">format (2 spaces)</button>
                <button class="action-btn small" @click="formatJson(4)">format (4 spaces)</button>
                <button class="action-btn small outline" @click="minifyJson">minify</button>
                <button class="action-btn small outline" @click="clearJson">clear</button>
              </div>

              <div class="json-grid">
                <textarea v-model="jsonInput" class="code-textarea" rows="12" placeholder="paste raw json here..."></textarea>
              </div>
              <div v-if="jsonError" class="json-error-banner">
                <span>⚠ invalid json: {{ jsonError }}</span>
              </div>
            </div>

            <!-- Tool: Crypto Hasher -->
            <div v-else-if="activeDevTool === 'hash'" class="tool-pane">
              <h3 class="pane-title">cryptographic hash &amp; hmac calculator</h3>
              <p class="pane-desc">calculate sha-256, sha-512, md5, sha-1, and keyed hmac digests in real-time.</p>

              <label class="input-lbl">input text</label>
              <textarea v-model="hashInput" class="code-textarea" rows="3" placeholder="enter text to hash..."></textarea>

              <div class="hash-results-grid">
                <div class="hash-result-card" v-for="h in computedHashes" :key="h.algo">
                  <div class="h-card-top">
                    <span class="h-algo">{{ h.algo }}</span>
                    <button class="copy-small-btn" @click="copyAll(h.hash)">copy</button>
                  </div>
                  <code class="h-val">{{ h.hash }}</code>
                </div>
              </div>
            </div>

            <!-- Tool: Base64 & URL Encoder -->
            <div v-else-if="activeDevTool === 'base64'" class="tool-pane">
              <h3 class="pane-title">base64 &amp; url encoder / decoder</h3>
              <p class="pane-desc">bidirectional utf-8 to base64, hex, and url encoding tool.</p>

              <div class="b64-grid">
                <div class="b64-col">
                  <label class="input-lbl">plain text</label>
                  <textarea v-model="b64Plain" class="code-textarea" rows="6" placeholder="type regular text..."></textarea>
                </div>
                <div class="b64-col">
                  <label class="input-lbl">base64 encoded</label>
                  <textarea v-model="b64Encoded" class="code-textarea" rows="6" placeholder="base64 string..."></textarea>
                </div>
              </div>
            </div>

            <!-- Tool: Cron Expression Builder -->
            <div v-else-if="activeDevTool === 'cron'" class="tool-pane">
              <h3 class="pane-title">cron expression humanizer &amp; scheduler</h3>
              <p class="pane-desc">translate 5-part cron syntax into natural language schedules and calculate next execution timestamps.</p>

              <div class="cron-box">
                <input v-model="cronExpr" type="text" class="cron-input code-font" placeholder="*/5 * * * *" />
                <div class="cron-meaning">
                  <span class="meaning-label">human schedule:</span>
                  <span class="meaning-val">{{ parsedCronMeaning }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. PRICESCOPE / WEBWATCHER: WEB CHANGE MONITOR (Replaces ChangeDetection.io) -->
      <div v-else-if="currentApp === 'pricescope'" class="app-screen">
        <div class="app-banner">
          <div>
            <div class="banner-title-row">
              <h3 class="banner-title">pricescope &bull; web change &amp; price tracker</h3>
              <span class="status-chip operational">4 active targets watching</span>
            </div>
            <p class="banner-desc">tracks visual html modifications, extracts e-commerce pricing drops, and triggers instant alerts.</p>
          </div>
          <div class="banner-actions">
            <button class="action-btn" @click="runAllChecks">⚡ check all now</button>
          </div>
        </div>

        <div class="targets-grid">
          <div v-for="t in watchTargets" :key="t.id" class="target-card">
            <div class="target-top">
              <div>
                <span class="target-category">{{ t.category }}</span>
                <h4 class="target-name">{{ t.name }}</h4>
                <a :href="t.url" target="_blank" class="target-url code-font">{{ t.url }}</a>
              </div>
              <div class="target-price-box" v-if="t.currentPrice">
                <span class="price-val">{{ t.currentPrice }} ron</span>
                <span class="price-drop" :class="{ drop: t.priceChange < 0 }">{{ t.priceChange }}%</span>
              </div>
            </div>

            <div class="diff-viewer">
              <div class="diff-header">
                <span class="diff-lbl">last detected modification ({{ t.lastChecked }})</span>
                <span class="diff-tag">css selector: <code>{{ t.selector }}</code></span>
              </div>
              <div class="diff-lines">
                <div v-for="(line, i) in t.diffSnippet" :key="i" class="diff-line" :class="line.type">
                  <span class="diff-prefix">{{ line.prefix }}</span>
                  <span class="diff-content code-font">{{ line.text }}</span>
                </div>
              </div>
            </div>

            <div class="target-bot">
              <span class="bot-info">schedule: every {{ t.interval }} &bull; notification: telegram &amp; discord</span>
              <button class="check-one-btn" @click="checkTarget(t)">check target</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. GITFORGE LITE: MINI GIT REPO SERVER (Replaces Gitea) -->
      <div v-else-if="currentApp === 'gitforge'" class="app-screen">
        <div class="git-layout">
          <div class="git-repo-header">
            <div class="repo-meta-row">
              <span class="repo-type-chip">public repository</span>
              <h3 class="repo-name">stefannut / homelab-core</h3>
              <span class="branch-selector">🌿 branch: main</span>
            </div>
            <div class="repo-stats-row">
              <span><strong>142</strong> commits</span> &bull;
              <span><strong>4</strong> branches</span> &bull;
              <span><strong>12</strong> services</span> &bull;
              <button class="clone-btn" @click="copyAll('git clone https://git.homelab.lan/stefannut/homelab-core.git')">
                📋 copy clone url
              </button>
            </div>
          </div>

          <div class="git-explorer-grid">
            <div class="file-tree-box">
              <div class="tree-top-bar">
                <span>files in repository</span>
              </div>
              <ul class="repo-files-list">
                <li 
                  v-for="f in repoFiles" 
                  :key="f.path"
                  class="repo-file-item"
                  :class="{ active: selectedFile && selectedFile.path === f.path }"
                  @click="selectedFile = f"
                >
                  <span class="f-icon">{{ f.isDir ? '📁' : '📄' }}</span>
                  <span class="f-name">{{ f.name }}</span>
                  <span class="f-msg">{{ f.lastCommit }}</span>
                </li>
              </ul>
            </div>

            <div class="code-viewer-box" v-if="selectedFile">
              <div class="code-top-bar">
                <span class="code-file-name">{{ selectedFile.path }}</span>
                <span class="code-lines">{{ selectedFile.lines }} lines &bull; {{ selectedFile.size }}</span>
              </div>
              <pre class="code-pre"><code>{{ selectedFile.content }}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. PIPERUNNER CI/CD: LIGHTWEIGHT PIPELINE RUNNER (Replaces Woodpecker CI) -->
      <div v-else-if="currentApp === 'piperunner'" class="app-screen">
        <div class="pipeline-header">
          <div>
            <div class="pipe-title-row">
              <h3 class="pipe-title">piperunner &bull; autonomous ci/cd engine</h3>
              <span class="pipe-badge" :class="pipelineStatus">{{ pipelineStatus }}</span>
            </div>
            <p class="pipe-desc">executes multi-stage containerized build, lint, and test pipelines defined in .custom-ci.yml.</p>
          </div>
          <button class="run-pipe-btn" :disabled="pipelineRunning" @click="triggerPipeline">
            <span v-if="!pipelineRunning">▶ trigger pipeline execution</span>
            <span v-else>⏳ executing stages...</span>
          </button>
        </div>

        <div class="pipeline-stages-row">
          <div 
            v-for="(stage, idx) in pipelineStages" 
            :key="stage.name" 
            class="stage-card"
            :class="stage.status"
          >
            <div class="stage-step-num">{{ idx + 1 }}</div>
            <div class="stage-info">
              <div class="stage-name">{{ stage.name }}</div>
              <div class="stage-dur code-font">{{ stage.duration }}</div>
            </div>
            <div class="stage-status-icon">
              <span v-if="stage.status === 'passed'">✓</span>
              <span v-else-if="stage.status === 'running'" class="spin-dot">◷</span>
              <span v-else-if="stage.status === 'failed'">✕</span>
              <span v-else>○</span>
            </div>
          </div>
        </div>

        <div class="terminal-log-box">
          <div class="terminal-header">
            <span class="term-dot red"></span>
            <span class="term-dot yellow"></span>
            <span class="term-dot green"></span>
            <span class="term-title">piperunner live runner logs &bull; container sandbox</span>
          </div>
          <div class="terminal-body" ref="terminalBody">
            <div v-for="(log, i) in pipelineLogs" :key="i" class="log-line code-font" :class="log.type">
              <span class="log-time">{{ log.time }}</span>
              <span class="log-msg">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const currentApp = ref('pulseguard');

const appsList = [
  { id: 'pulseguard', name: 'pulseguard', replaces: 'uptime kuma', icon: '⚡', color: '#10b981', tier: 'tier 1: immediate' },
  { id: 'devforge', name: 'devforge tools', replaces: 'it-tools', icon: '🛠', color: '#00cec9', tier: 'tier 1: immediate' },
  { id: 'pricescope', name: 'pricescope', replaces: 'changedetection', icon: '👁', color: '#cfa16a', tier: 'tier 1: immediate' },
  { id: 'gitforge', name: 'gitforge lite', replaces: 'gitea', icon: '🌿', color: '#c084fc', tier: 'tier 2: masterclass' },
  { id: 'piperunner', name: 'piperunner ci', replaces: 'woodpecker ci', icon: '🚀', color: '#e74c3c', tier: 'tier 2: masterclass' }
];

// ==========================================
// 1. PULSEGUARD (Uptime Kuma Replacement)
// ==========================================
const statusPageMode = ref(false);
const showNewMonitorModal = ref(false);

const uptimeMonitors = ref([
  {
    id: 'traefik',
    name: 'traefik reverse proxy',
    target: 'https://traefik.homelab.lan',
    group: 'core network',
    type: 'http',
    interval: 30,
    status: 'up',
    uptime: 99.99,
    latency: 4,
    sslDays: 78,
    sparkline: [4, 5, 4, 6, 4, 3, 5, 4, 4, 5, 6, 4, 3, 4, 5, 4, 4, 3, 4, 4],
    history: Array(90).fill('up')
  },
  {
    id: 'pihole',
    name: 'pi-hole local dns',
    target: 'udp://192.168.1.100:53',
    group: 'core network',
    type: 'dns',
    interval: 15,
    status: 'up',
    uptime: 100.0,
    latency: 1,
    sslDays: 365,
    sparkline: [1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1],
    history: Array(90).fill('up')
  },
  {
    id: 'homeassistant',
    name: 'home assistant iot core',
    target: 'http://192.168.1.103:8123',
    group: 'compute & iot',
    type: 'http',
    interval: 30,
    status: 'up',
    uptime: 99.95,
    latency: 12,
    sslDays: 78,
    sparkline: [11, 14, 12, 15, 12, 11, 13, 16, 12, 11, 14, 12, 13, 11, 12, 15, 12, 11, 12, 12],
    history: Array(90).fill('up')
  },
  {
    id: 'nextcloud',
    name: 'nextcloud private storage',
    target: 'http://192.168.1.111:8080',
    group: 'storage & media',
    type: 'http',
    interval: 60,
    status: 'up',
    uptime: 99.88,
    latency: 28,
    sslDays: 78,
    sparkline: [25, 29, 31, 28, 27, 30, 28, 26, 32, 28, 27, 29, 30, 28, 27, 31, 28, 26, 28, 28],
    history: Array(88).fill('up').concat(['degraded', 'up'])
  },
  {
    id: 'immich',
    name: 'immich ml photo server',
    target: 'http://192.168.1.107:2283',
    group: 'storage & media',
    type: 'http',
    interval: 60,
    status: 'up',
    uptime: 99.92,
    latency: 18,
    sslDays: 78,
    sparkline: [18, 19, 21, 17, 18, 20, 18, 19, 18, 17, 18, 22, 18, 19, 17, 18, 20, 18, 19, 18],
    history: Array(90).fill('up')
  }
]);

const selectedMonitor = ref(uptimeMonitors.value[0]);

function toggleStatusPageMode() {
  statusPageMode.value = !statusPageMode.value;
}

function simulatePing(m) {
  m.latency = Math.floor(Math.random() * 8) + (m.type === 'dns' ? 1 : 10);
  m.sparkline.shift();
  m.sparkline.push(m.latency);
}

// ==========================================
// 2. DEVFORGE (IT-Tools Replacement)
// ==========================================
const devToolSearch = ref('');
const activeDevTool = ref('jwt');

const devToolCategories = [
  {
    name: 'token & auth',
    tools: [
      { id: 'jwt', name: 'jwt debugger', icon: '🔑' },
      { id: 'uuid', name: 'uuid / nanoid', icon: '🎲' }
    ]
  },
  {
    name: 'data & formatters',
    tools: [
      { id: 'json', name: 'json formatter', icon: '📋' },
      { id: 'base64', name: 'base64 & url', icon: '🔤' }
    ]
  },
  {
    name: 'crypto & time',
    tools: [
      { id: 'hash', name: 'hash & hmac', icon: '🔒' },
      { id: 'cron', name: 'cron humanizer', icon: '⏰' }
    ]
  }
];

// JWT Logic
const jwtInput = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdGVmYW5udXQiLCJuYW1lIjoic3RlZmFuIG51dGEiLCJyb2xlIjoiYWRtaW4iLCJpc3MiOiJob21lbGFiLWNsdXN0ZXIiLCJpYXQiOjE3MjQ1MDAwMDAsImV4cCI6MTc1NjA0OTYwMH0.signature_sample');

const parsedJwt = computed(() => {
  try {
    const parts = jwtInput.value.trim().split('.');
    if (parts.length >= 2) {
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      return JSON.stringify({ header, payload, status: 'valid format' }, null, 2);
    }
    return 'invalid jwt format (expected 3 dot-separated segments)';
  } catch (e) {
    return `error decoding token: ${e.message}`;
  }
});

// UUID Generator
const uuidFormat = ref('uuidv4');
const uuidCount = ref(5);
const generatedUuids = ref([]);

function generateUuids() {
  const list = [];
  for (let i = 0; i < uuidCount.value; i++) {
    if (uuidFormat.value === 'uuidv4') {
      list.push(crypto.randomUUID());
    } else if (uuidFormat.value === 'ulid') {
      list.push('01J6H' + Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase());
    } else {
      list.push(Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12));
    }
  }
  generatedUuids.value = list;
}
generateUuids();

// JSON Formatter
const jsonInput = ref('{"name":"homelab","nodes":4,"active":true,"services":["traefik","immich","homeassistant","nextcloud"]}');
const jsonError = ref('');

function formatJson(spaces) {
  try {
    jsonError.value = '';
    const obj = JSON.parse(jsonInput.value);
    jsonInput.value = JSON.stringify(obj, null, spaces);
  } catch (e) {
    jsonError.value = e.message;
  }
}

function minifyJson() {
  try {
    jsonError.value = '';
    const obj = JSON.parse(jsonInput.value);
    jsonInput.value = JSON.stringify(obj);
  } catch (e) {
    jsonError.value = e.message;
  }
}

function clearJson() {
  jsonInput.value = '';
  jsonError.value = '';
}

// Hasher
const hashInput = ref('homelab-secure-master-key');
const computedHashes = computed(() => {
  const str = hashInput.value || '';
  // Lightweight hash representations for demo
  let sha256 = '';
  let md5 = '';
  let sha1 = '';
  for (let i = 0; i < 64; i++) {
    sha256 += ((str.charCodeAt(i % str.length) || 42) * (i + 7) % 16).toString(16);
  }
  for (let i = 0; i < 32; i++) {
    md5 += ((str.charCodeAt(i % str.length) || 13) * (i + 3) % 16).toString(16);
  }
  for (let i = 0; i < 40; i++) {
    sha1 += ((str.charCodeAt(i % str.length) || 99) * (i + 5) % 16).toString(16);
  }

  return [
    { algo: 'sha-256', hash: sha256 },
    { algo: 'sha-512', hash: sha256 + sha256 },
    { algo: 'md5', hash: md5 },
    { algo: 'sha-1', hash: sha1 }
  ];
});

// Base64
const b64Plain = ref('welcome to homelab custom dev suite!');
const b64Encoded = computed({
  get: () => {
    try { return btoa(b64Plain.value); } catch(e) { return ''; }
  },
  set: (val) => {
    try { b64Plain.value = atob(val); } catch(e) {}
  }
});

// Cron
const cronExpr = ref('*/15 * * * *');
const parsedCronMeaning = computed(() => {
  const c = cronExpr.value.trim();
  if (c === '*/15 * * * *') return 'runs every 15 minutes across all days';
  if (c === '0 0 * * *') return 'runs daily at midnight (00:00 utc)';
  if (c === '0 4 * * 0') return 'runs every sunday at 04:00 am (weekly backups)';
  return 'custom periodic cron schedule';
});

function copyAll(text) {
  navigator.clipboard.writeText(text);
}

// ==========================================
// 3. PRICESCOPE (ChangeDetection Replacement)
// ==========================================
const watchTargets = ref([
  {
    id: 'emag-gpu',
    name: 'emag nvidia gtx/rtx clearance',
    url: 'https://emag.ro/search/nvidia-rtx',
    category: 'e-commerce & price',
    selector: '.product-new-price',
    currentPrice: 1249,
    priceChange: -12.5,
    lastChecked: '4 minutes ago',
    interval: '30m',
    diffSnippet: [
      { type: 'normal', prefix: ' ', text: '<div class="product-title">geforce rtx 3060 12gb</div>' },
      { type: 'removed', prefix: '-', text: '<span class="old-price">1429.99 ron</span>' },
      { type: 'added', prefix: '+', text: '<span class="new-price">1249.00 ron (-12.5% discount)</span>' },
      { type: 'normal', prefix: ' ', text: '<div class="stock-badge in-stock">in stock (ready to ship)</div>' }
    ]
  },
  {
    id: 'proxmox-news',
    name: 'proxmox ve release notes',
    url: 'https://pve.proxmox.com/wiki/Roadmap',
    category: 'web content monitor',
    selector: '#mw-content-text',
    currentPrice: null,
    priceChange: null,
    lastChecked: '12 minutes ago',
    interval: '2h',
    diffSnippet: [
      { type: 'normal', prefix: ' ', text: '== Proxmox VE 9.2 Changelog ==' },
      { type: 'added', prefix: '+', text: '* Linux Kernel 6.8.8-2-pve default' },
      { type: 'added', prefix: '+', text: '* Enhanced ZFS 2.2.4 block cloning' }
    ]
  }
]);

function runAllChecks() {
  for (const t of watchTargets.value) {
    t.lastChecked = 'just now';
  }
}

function checkTarget(t) {
  t.lastChecked = 'just now';
}

// ==========================================
// 4. GITFORGE LITE (Gitea Replacement)
// ==========================================
const repoFiles = [
  { name: 'services/', isDir: true, path: 'services/', lines: '--', size: '12 folders', lastCommit: 'feat: add custom saas suite' },
  { name: 'docker-compose.yml', isDir: false, path: 'docker-compose.yml', lines: 48, size: '1.4 kb', lastCommit: 'chore: update traefik routes', content: `version: '3.8'\nservices:\n  traefik:\n    image: traefik:v3.0\n    ports:\n      - "80:80"\n      - "443:443"\n    volumes:\n      - /var/run/docker.sock:/var/run/docker.sock:ro` },
  { name: 'README.md', isDir: false, path: 'README.md', lines: 35, size: '2.1 kb', lastCommit: 'docs: update 4-node topology', content: `# Homelab Infrastructure\n\n4-Node Physical Hypervisors:\n- Node 1: Proxmox VE (i3-10100F + GTX 1050 Ti)\n- Node 2: OpenMediaVault (Celeron N2830)\n- Node 3: Proxmox2 (Apple M1 ARM64)\n- Node 4: k8s-node-04 (Athlon II X2 220)` }
];

const selectedFile = ref(repoFiles[1]);

// ==========================================
// 5. PIPERUNNER CI/CD (Woodpecker Replacement)
// ==========================================
const pipelineRunning = ref(false);
const pipelineStatus = ref('passed');
const terminalBody = ref(null);

const pipelineStages = ref([
  { name: '1. lint & validate', duration: '1.2s', status: 'passed' },
  { name: '2. unit & integration tests', duration: '3.4s', status: 'passed' },
  { name: '3. build vite assets', duration: '2.1s', status: 'passed' },
  { name: '4. containerize & push', duration: '4.8s', status: 'passed' },
  { name: '5. proxmox webhook deploy', duration: '0.9s', status: 'passed' }
]);

const pipelineLogs = ref([
  { time: '00:00:01', type: 'info', message: '[piperunner] clone repo stefannut/homelab @ commit 22cedfa...' },
  { time: '00:00:02', type: 'success', message: '✓ stage 1: eslint & yamllint passed (0 errors, 0 warnings)' },
  { time: '00:00:05', type: 'success', message: '✓ stage 2: vitest & jest suite executed (24/24 tests passing)' },
  { time: '00:00:07', type: 'success', message: '✓ stage 3: vite build completed: dist/ generated in 640ms' },
  { time: '00:00:12', type: 'success', message: '✓ stage 4: docker build -t homelab/custom-suite:latest tagged' },
  { time: '00:00:13', type: 'success', message: '✓ stage 5: proxmox lxc webhook triggered & containers reloaded' },
  { time: '00:00:13', type: 'info', message: '[piperunner] pipeline completed with status SUCCESS in 12.4s' }
]);

function triggerPipeline() {
  if (pipelineRunning.value) return;
  pipelineRunning.value = true;
  pipelineStatus.value = 'running';
  pipelineLogs.value = [{ time: '00:00:00', type: 'info', message: '[piperunner] starting pipeline execution run #104...' }];

  for (const s of pipelineStages.value) {
    s.status = 'pending';
  }

  let step = 0;
  const timer = setInterval(() => {
    if (step < pipelineStages.value.length) {
      if (step > 0) pipelineStages.value[step - 1].status = 'passed';
      pipelineStages.value[step].status = 'running';
      pipelineLogs.value.push({
        time: `00:00:0${step * 2 + 1}`,
        type: 'info',
        message: `executing step ${step + 1}: ${pipelineStages.value[step].name}...`
      });
      step++;
    } else {
      pipelineStages.value[step - 1].status = 'passed';
      pipelineLogs.value.push({
        time: '00:00:11',
        type: 'success',
        message: '[piperunner] all 5 stages passed cleanly! deployment complete.'
      });
      pipelineRunning.value = false;
      pipelineStatus.value = 'passed';
      clearInterval(timer);
    }
  }, 1000);
}
</script>

<style scoped>
.saas-suite {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
}

.suite-header {
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

.suite-badge-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.25rem;
}

.suite-tag {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: #cfa16a;
  background: rgba(207, 161, 106, 0.12);
  border: 1px solid rgba(207, 161, 106, 0.25);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
  text-transform: lowercase;
}

.suite-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  text-transform: lowercase;
}

.suite-subtitle {
  font-size: 0.82rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

.suite-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.stat-pill {
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

.stat-pill.active {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--accent-emerald);
}

.stat-dot { width: 6px; height: 6px; border-radius: 50%; }
.stat-dot.green { background: #10b981; box-shadow: 0 0 6px #10b981; }
.stat-dot.cyan { background: #00cec9; box-shadow: 0 0 6px #00cec9; }
.stat-dot.purple { background: #a855f7; box-shadow: 0 0 6px #a855f7; }

.app-switcher-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.65rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1.25rem;
}

.app-tab-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  text-align: left;
}

.app-tab-btn:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: var(--border-color-hover);
  color: var(--text-primary);
}

.app-tab-btn.active {
  background: #3e2a2c;
  border-color: rgba(214, 182, 186, 0.35);
  color: #f5ecec;
}

.app-icon { font-size: 1.2rem; }
.app-tab-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.app-tab-title { font-size: 0.82rem; font-weight: 700; text-transform: lowercase; }
.app-tab-replaces { font-size: 0.68rem; color: var(--text-muted); text-transform: lowercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.tier-pill {
  font-size: 0.58rem;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  text-transform: lowercase;
}

/* App Viewport */
.app-viewport {
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  min-height: 580px;
}

.app-banner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.25rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.banner-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.banner-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: lowercase;
}

.status-chip {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  padding: 0.15rem 0.55rem;
  border-radius: 12px;
  text-transform: lowercase;
}

.status-chip.operational {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.banner-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
  text-transform: lowercase;
}

.banner-actions { display: flex; gap: 0.5rem; }

.action-btn {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-sm);
  background: #3e2a2c;
  border: 1px solid rgba(214, 182, 186, 0.25);
  color: #f5ecec;
  cursor: pointer;
  text-transform: lowercase;
}

.action-btn:hover { background: #54393c; }

.action-btn.outline {
  background: transparent;
  color: var(--text-secondary);
}

.action-btn.small { padding: 0.25rem 0.55rem; font-size: 0.72rem; }

/* PulseGuard Public Status Page */
.status-page-preview {
  background: #080607;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.sp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
}

.sp-brand { display: flex; align-items: center; gap: 0.5rem; }
.sp-logo { color: #10b981; font-size: 1.2rem; }
.sp-brand h2 { font-size: 1.15rem; color: var(--text-primary); text-transform: lowercase; }

.sp-badge.operational {
  background: #10b981;
  color: #052e16;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  text-transform: lowercase;
}

.sp-group { margin-bottom: 1.5rem; }
.sp-group-title { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.6rem; text-transform: lowercase; }

.sp-cards { display: flex; flex-direction: column; gap: 0.65rem; }

.sp-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
}

.sp-card-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.sp-name { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); text-transform: lowercase; }
.sp-status { font-size: 0.72rem; font-family: var(--font-mono); color: #10b981; text-transform: lowercase; }

.sp-bars {
  display: flex;
  gap: 2px;
  height: 24px;
  margin-bottom: 0.4rem;
}

.sp-bar {
  flex: 1;
  background: #10b981;
  border-radius: 2px;
}

.sp-bar.degraded { background: #cfa16a; }

.sp-card-bot {
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: var(--text-muted);
  text-transform: lowercase;
}

/* PulseGuard Admin */
.monitors-admin-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.25rem;
}

.monitors-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.monitor-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  cursor: pointer;
}

.monitor-row:hover { background: rgba(255, 255, 255, 0.03); }
.monitor-row.active { background: #3e2a2c; border-color: rgba(214, 182, 186, 0.35); }

.m-left { display: flex; align-items: center; gap: 0.6rem; }
.m-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
.m-name { font-size: 0.82rem; font-weight: 600; color: var(--text-primary); text-transform: lowercase; }
.m-url { font-size: 0.68rem; color: var(--text-muted); }

.m-right { display: flex; align-items: center; gap: 0.5rem; }
.m-pill { font-size: 0.65rem; background: rgba(255, 255, 255, 0.04); padding: 0.1rem 0.35rem; border-radius: 4px; color: var(--text-muted); }
.m-latency { font-size: 0.72rem; color: #00cec9; }
.m-uptime { font-size: 0.72rem; color: #10b981; font-weight: 600; }

.monitor-detail-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.85rem;
}

.detail-tag { font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono); text-transform: lowercase; }
.detail-name { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); text-transform: lowercase; margin: 0.15rem 0; }
.detail-url { font-size: 0.75rem; color: #00cec9; }

.test-ping-btn {
  font-size: 0.75rem;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-sm);
  background: #3e2a2c;
  color: #f5ecec;
  border: 1px solid rgba(214, 182, 186, 0.25);
  cursor: pointer;
  text-transform: lowercase;
}

.detail-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.65rem;
}

.d-stat {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.d-label { font-size: 0.68rem; color: var(--text-muted); text-transform: lowercase; }
.d-val { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); }

.response-chart-box, .incident-history {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.85rem;
}

.chart-title { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: lowercase; }

.sparkline {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 55px;
  padding-top: 5px;
}

.spark-col {
  flex: 1;
  background: #00cec9;
  border-radius: 2px;
}

.incident-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  padding: 0.45rem;
  border-radius: var(--radius-sm);
  text-transform: lowercase;
}

.incident-item.clean { background: rgba(16, 185, 129, 0.08); color: #10b981; }
.incident-item.degraded { background: rgba(207, 161, 106, 0.08); color: #cfa16a; }

/* DevForge */
.devforge-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1.25rem;
}

.tools-sidebar {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.tools-category { display: flex; flex-direction: column; gap: 0.25rem; }
.cat-title { font-size: 0.68rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: lowercase; margin-bottom: 0.2rem; }

.tool-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.78rem;
  text-transform: lowercase;
  cursor: pointer;
  text-align: left;
}

.tool-btn:hover { background: rgba(255, 255, 255, 0.04); color: var(--text-primary); }
.tool-btn.active { background: #3e2a2c; color: #f5ecec; font-weight: 600; }

.tool-workspace {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
}

.pane-title { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); text-transform: lowercase; }
.pane-desc { font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem; margin-bottom: 1rem; text-transform: lowercase; }

.input-lbl { font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.3rem; display: block; text-transform: lowercase; }

.code-textarea {
  width: 100%;
  background: #060405;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  font-size: 0.78rem;
  color: #f5ecec;
  font-family: var(--font-mono);
  outline: none;
  resize: vertical;
}

.jwt-grid, .b64-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.decoded-view { background: #060405; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.75rem; height: 160px; overflow: auto; }
.json-code { font-size: 0.75rem; color: #00cec9; font-family: var(--font-mono); margin: 0; }

.gen-controls { margin-bottom: 1rem; }
.gen-row { display: flex; align-items: center; gap: 0.6rem; font-size: 0.75rem; color: var(--text-muted); text-transform: lowercase; flex-wrap: wrap; }
.saas-select, .saas-num-input { background: #060405; border: 1px solid var(--border-color); color: #f5ecec; padding: 0.35rem 0.55rem; border-radius: var(--radius-sm); font-size: 0.75rem; outline: none; }
.saas-num-input { width: 60px; }

.uuid-list-box { background: #060405; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.5rem; display: flex; flex-direction: column; gap: 0.3rem; max-height: 250px; overflow-y: auto; }
.uuid-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: #00cec9; padding: 0.25rem 0.5rem; border-radius: 4px; }
.uuid-row:hover { background: rgba(255, 255, 255, 0.03); }

.copy-small-btn { font-size: 0.65rem; background: #3e2a2c; border: 1px solid rgba(214, 182, 186, 0.25); color: #f5ecec; padding: 0.15rem 0.45rem; border-radius: 4px; cursor: pointer; text-transform: lowercase; }

.json-toolbar { display: flex; gap: 0.4rem; margin-bottom: 0.75rem; }
.json-error-banner { margin-top: 0.5rem; font-size: 0.75rem; color: #e74c3c; background: rgba(231, 76, 60, 0.1); padding: 0.4rem 0.6rem; border-radius: 4px; }

.hash-results-grid { display: grid; grid-template-columns: 1fr; gap: 0.5rem; margin-top: 0.75rem; }
.hash-result-card { background: #060405; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.5rem 0.75rem; }
.h-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
.h-algo { font-size: 0.68rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: lowercase; }
.h-val { font-size: 0.75rem; color: #00cec9; word-break: break-all; }

.cron-box { background: #060405; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
.cron-input { font-size: 1.1rem; background: transparent; border: 1px solid var(--border-color); color: #cfa16a; padding: 0.5rem; border-radius: var(--radius-sm); outline: none; }
.cron-meaning { font-size: 0.82rem; display: flex; gap: 0.5rem; text-transform: lowercase; }
.meaning-label { color: var(--text-muted); }
.meaning-val { color: var(--text-primary); font-weight: 600; }

/* PriceScope */
.targets-grid { display: flex; flex-direction: column; gap: 1rem; }
.target-card { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; }
.target-top { display: flex; justify-content: space-between; align-items: flex-start; }
.target-category { font-size: 0.68rem; font-family: var(--font-mono); color: #cfa16a; text-transform: lowercase; }
.target-name { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); text-transform: lowercase; margin: 0.15rem 0; }
.target-url { font-size: 0.72rem; color: var(--text-muted); }

.target-price-box { text-align: right; }
.price-val { font-size: 1.2rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-mono); }
.price-drop { display: block; font-size: 0.75rem; font-weight: 700; color: #10b981; }
.price-drop.drop { color: #10b981; }

.diff-viewer { background: #060405; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.75rem; }
.diff-header { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.4rem; text-transform: lowercase; }
.diff-lines { display: flex; flex-direction: column; gap: 2px; }
.diff-line { display: flex; gap: 0.5rem; font-size: 0.75rem; padding: 0.15rem 0.4rem; border-radius: 2px; }
.diff-line.added { background: rgba(16, 185, 129, 0.15); color: #10b981; }
.diff-line.removed { background: rgba(231, 76, 60, 0.15); color: #e74c3c; }
.diff-line.normal { color: var(--text-secondary); }

.target-bot { display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: var(--text-muted); text-transform: lowercase; }
.check-one-btn { font-size: 0.72rem; padding: 0.25rem 0.55rem; border-radius: var(--radius-sm); background: #3e2a2c; color: #f5ecec; border: 1px solid rgba(214, 182, 186, 0.2); cursor: pointer; text-transform: lowercase; }

/* GitForge */
.git-layout { display: flex; flex-direction: column; gap: 1rem; }
.git-repo-header { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; }
.repo-meta-row { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.4rem; }
.repo-type-chip { font-size: 0.68rem; font-family: var(--font-mono); background: rgba(192, 132, 252, 0.12); color: #c084fc; padding: 0.15rem 0.45rem; border-radius: 4px; text-transform: lowercase; }
.repo-name { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); text-transform: lowercase; }
.branch-selector { font-size: 0.72rem; background: rgba(255, 255, 255, 0.05); padding: 0.2rem 0.5rem; border-radius: 4px; color: var(--text-muted); text-transform: lowercase; }
.repo-stats-row { font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; text-transform: lowercase; }
.clone-btn { font-size: 0.72rem; background: #3e2a2c; border: 1px solid rgba(214, 182, 186, 0.25); color: #f5ecec; padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer; text-transform: lowercase; }

.git-explorer-grid { display: grid; grid-template-columns: 280px 1fr; gap: 1rem; }
.file-tree-box { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 0.75rem; }
.tree-top-bar { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem; margin-bottom: 0.4rem; text-transform: lowercase; }

.repo-files-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.25rem; }
.repo-file-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; padding: 0.4rem 0.5rem; border-radius: 4px; color: var(--text-secondary); cursor: pointer; text-transform: lowercase; }
.repo-file-item:hover { background: rgba(255, 255, 255, 0.03); color: var(--text-primary); }
.repo-file-item.active { background: #3e2a2c; color: #f5ecec; font-weight: 600; }
.f-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.f-msg { font-size: 0.65rem; color: var(--text-muted); max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.code-viewer-box { background: #060405; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
.code-top-bar { display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
.code-file-name { color: #c084fc; font-family: var(--font-mono); font-weight: 600; }
.code-pre { font-size: 0.78rem; color: #f5ecec; font-family: var(--font-mono); margin: 0; overflow: auto; max-height: 350px; }

/* PipeRunner */
.pipeline-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-color); padding-bottom: 1.25rem; margin-bottom: 1.5rem; }
.pipe-title-row { display: flex; align-items: center; gap: 0.6rem; }
.pipe-title { font-size: 1.2rem; font-weight: 700; color: var(--text-primary); text-transform: lowercase; }
.pipe-badge { font-size: 0.7rem; font-family: var(--font-mono); padding: 0.15rem 0.55rem; border-radius: 12px; text-transform: lowercase; }
.pipe-badge.passed { background: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.25); }
.pipe-badge.running { background: rgba(207, 161, 106, 0.12); color: #cfa16a; border: 1px solid rgba(207, 161, 106, 0.25); }

.pipe-desc { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem; text-transform: lowercase; }

.run-pipe-btn { font-size: 0.8rem; font-weight: 700; padding: 0.5rem 1rem; border-radius: var(--radius-sm); background: #e74c3c; color: #ffffff; border: none; cursor: pointer; text-transform: lowercase; }
.run-pipe-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.pipeline-stages-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
.stage-card { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.75rem; display: flex; align-items: center; gap: 0.65rem; }
.stage-step-num { width: 22px; height: 22px; border-radius: 50%; background: rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: var(--text-muted); font-weight: 700; }
.stage-info { flex: 1; }
.stage-name { font-size: 0.75rem; font-weight: 600; color: var(--text-primary); text-transform: lowercase; }
.stage-dur { font-size: 0.68rem; color: var(--text-muted); }
.stage-status-icon { font-size: 0.85rem; }
.stage-card.passed .stage-status-icon { color: #10b981; }
.stage-card.running .stage-status-icon { color: #cfa16a; }
.stage-card.running { border-color: rgba(207, 161, 106, 0.4); background: rgba(207, 161, 106, 0.05); }

.terminal-log-box { background: #060405; border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; }
.terminal-header { background: #120e0f; border-bottom: 1px solid var(--border-color); padding: 0.6rem 0.85rem; display: flex; align-items: center; gap: 0.4rem; }
.term-dot { width: 10px; height: 10px; border-radius: 50%; }
.term-dot.red { background: #ff5f56; }
.term-dot.yellow { background: #ffbd2e; }
.term-dot.green { background: #27c93f; }
.term-title { font-size: 0.72rem; color: var(--text-muted); margin-left: 0.5rem; text-transform: lowercase; }

.terminal-body { padding: 0.85rem; max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.3rem; }
.log-line { font-size: 0.75rem; display: flex; gap: 0.65rem; }
.log-time { color: #827072; flex-shrink: 0; }
.log-msg { word-break: break-all; }
.log-line.info .log-msg { color: #baa6a8; }
.log-line.success .log-msg { color: #10b981; font-weight: 600; }

@media (max-width: 900px) {
  .monitors-admin-grid, .devforge-layout, .git-explorer-grid { grid-template-columns: 1fr; }
}
</style>
