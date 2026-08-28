<template>
  <div class="elo-terminal-view fade-in">
    <!-- Top AI Control Center Banner -->
    <div class="terminal-banner glass-panel">
      <div class="banner-left">
        <div class="elo-avatar anim-glow">
          <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 3.3 2 6.2 5 7.4V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.6c3-1.2 5-4.1 5-7.4a8 8 0 0 0-8-8z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>
        </div>
        <div class="banner-text">
          <h2>ELO Autonomous Control Plane</h2>
          <p>ReAct Loop &bull; pgvector Semantic RAG &bull; Zero-Cost Cascade (Gemini &bull; Groq &bull; Ollama)</p>
        </div>
      </div>

      <!-- Right Audio Visualizer & Cascade Health -->
      <div class="banner-right">
        <div class="waveform-container">
          <canvas ref="audioCanvasRef" class="waveform-canvas" width="160" height="36"></canvas>
          <span class="waveform-label">Metal MPS Voice Engine</span>
        </div>
        <div class="cascade-badge">
          <span class="badge-dot pulse-emerald"></span>
          <span class="cascade-text">Groq LPU: <strong>340 t/s</strong></span>
        </div>
      </div>
    </div>

    <!-- Main Terminal Split Grid -->
    <div class="terminal-workspace">
      <!-- Left: Interactive Terminal Chat Interface -->
      <div class="chat-container glass-panel">
        <div class="chat-header">
          <div class="terminal-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <span class="terminal-title">elo-interactive-session@macbook-air-m1:~$</span>
          <button @click="clearHistory" class="btn-clear" title="Clear Console">
            <svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Clear
          </button>
        </div>

        <!-- Chat Message Log -->
        <div ref="chatLogRef" class="chat-log">
          <div v-for="(msg, idx) in messages" :key="idx" class="chat-msg" :class="msg.role">
            <div class="msg-header">
              <span class="msg-role">{{ msg.role === 'user' ? 'OPERATOR' : 'ELO CORE' }}</span>
              <span class="msg-time">{{ msg.time }}</span>
            </div>

            <!-- If message has ReAct CoT steps -->
            <div v-if="msg.steps && msg.steps.length > 0" class="cot-trace-block">
              <div class="cot-trace-header" @click="msg.showTrace = !msg.showTrace">
                <span class="cot-title">
                  <svg class="svg-icon-xs text-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                  ReAct Reasoning &amp; Tool Chain ({{ msg.steps.length }} steps)
                </span>
                <span class="cot-toggle">{{ msg.showTrace ? 'Hide' : 'Inspect' }}</span>
              </div>
              <div v-if="msg.showTrace" class="cot-steps-body">
                <div v-for="(step, sIdx) in msg.steps" :key="sIdx" class="cot-step-item" :class="step.type">
                  <span class="step-badge">{{ step.badge }}</span>
                  <span class="step-content">{{ step.text }}</span>
                </div>
              </div>
            </div>

            <div class="msg-body" v-html="formatMarkdown(msg.content)"></div>
          </div>

          <!-- Typing Stream Indicator -->
          <div v-if="isGenerating" class="chat-msg assistant generating">
            <div class="msg-header">
              <span class="msg-role">ELO CORE</span>
              <span class="msg-time">Thinking...</span>
            </div>
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <!-- Preset Interactive Pills -->
        <div class="pills-bar">
          <button 
            v-for="(pill, pIdx) in promptPills" 
            :key="pIdx" 
            class="prompt-pill"
            @click="sendPrompt(pill.text)"
            :disabled="isGenerating"
          >
            <span class="pill-icon">{{ pill.icon }}</span>
            {{ pill.label }}
          </button>
        </div>

        <!-- Input Bar -->
        <form @submit.prevent="handleSubmit" class="chat-input-bar">
          <input 
            v-model="inputQuery" 
            type="text" 
            placeholder="Type natural language command or request for ELO..."
            class="terminal-input"
            :disabled="isGenerating"
          />
          <button type="submit" class="btn-send" :disabled="!inputQuery.trim() || isGenerating">
            <svg class="svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </div>

      <!-- Right: Sub-Agent Swarm & Live Telemetry Inspector -->
      <div class="terminal-sidebar">
        <!-- Sub-Agent Swarm Status Cards -->
        <div class="sidebar-section glass-panel">
          <h3 class="sidebar-title">
            <svg class="svg-icon-xs text-amber" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Autonomous Sub-Agent Swarm
          </h3>

          <div class="swarm-list">
            <div class="swarm-card">
              <div class="swarm-header">
                <span class="swarm-name"> SecOps Threat-Hunter</span>
                <span class="swarm-status active">ACTIVE</span>
              </div>
              <p class="swarm-desc">Correlating Wazuh SIEM &amp; Suricata NIDS logs &bull; 0 Active Threats</p>
            </div>

            <div class="swarm-card">
              <div class="swarm-header">
                <span class="swarm-name"> SysAdmin Optimizer</span>
                <span class="swarm-status active">ACTIVE</span>
              </div>
              <p class="swarm-desc">KSM deduplication: 420 MB saved &bull; Proxmox RAM: 72% optimal</p>
            </div>

            <div class="swarm-card">
              <div class="swarm-header">
                <span class="swarm-name"> Smart Energy Agent</span>
                <span class="swarm-status active">STANDBY</span>
              </div>
              <p class="swarm-desc">Home Assistant power draw: 142W &bull; 0 Vampire loads detected</p>
            </div>

            <div class="swarm-card">
              <div class="swarm-header">
                <span class="swarm-name"> Predictive ZFS Healer</span>
                <span class="swarm-status active">HEALTHY</span>
              </div>
              <p class="swarm-desc">Scrutiny SMART: 0 Bad sectors &bull; Last snapshot: 10m ago</p>
            </div>
          </div>
        </div>

        <!-- Capability Token Ring Specs -->
        <div class="sidebar-section glass-panel">
          <h3 class="sidebar-title">
            <svg class="svg-icon-xs text-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Gatekeeper Clearance Matrix
          </h3>
          <div class="rings-grid">
            <div class="ring-row">
              <span class="ring-badge l0">L0</span>
              <span class="ring-text">Read-Only Telemetry (Auto-Executed)</span>
            </div>
            <div class="ring-row">
              <span class="ring-badge l1">L1</span>
              <span class="ring-text">Low-Impact Write (HMAC Audit Trail)</span>
            </div>
            <div class="ring-row">
              <span class="ring-badge l2">L2</span>
              <span class="ring-text">High-Impact (Telegram Approval Required)</span>
            </div>
            <div class="ring-row">
              <span class="ring-badge l3">L3</span>
              <span class="ring-text">Critical (2FA Time-Locked Challenge)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const inputQuery = ref('');
const isGenerating = ref(false);
const chatLogRef = ref(null);
const audioCanvasRef = ref(null);
let animAudioId = null;

const promptPills = [
  { icon: '', label: 'Cluster Health', text: 'Verifică starea nodurilor Proxmox și OpenMediaVault NAS' },
  { icon: '', label: 'SecOps Audit', text: 'Rulează un audit de securitate pe logurile OPNsense și Wazuh SIEM' },
  { icon: '', label: 'ESP32 Room Jump', text: 'Simulează schimbarea locației fizice prin radar ESP32 în Living' },
  { icon: '', label: 'Cascade Test', text: 'Testează cascada de modele gratuite Gemini -> Groq -> OpenRouter' }
];

const messages = ref([
  {
    role: 'assistant',
    time: '12:00:00',
    content: 'Salutare! Sunt **ELO (Enhanced Local Orchestrator)**. Controlul autonom al infrastructurii homelab este activat. Cu ce pot asista clusterul?',
    steps: [
      { type: 'reasoning', badge: ' SYSTEM_INIT', text: 'Loaded 19 registered tools into L0-L3 Gatekeeper.' },
      { type: 'action', badge: ' MEMORY_SYNC', text: 'Vector index pgvector synchronized (128-D cosine embeddings).' },
      { type: 'completed', badge: ' CASCADE_READY', text: 'Tier 1: Gemini 2.5 Flash | Tier 2: Groq LPU (Llama 3.3 70B).' }
],
    showTrace: true
  }
]);

const formatMarkdown = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>');
};

const sendPrompt = (txt) => {
  inputQuery.value = txt;
  handleSubmit();
};

const clearHistory = () => {
  messages.value = [];
};

const handleSubmit = async () => {
  if (!inputQuery.value.trim() || isGenerating.value) return;
  const userText = inputQuery.value;
  inputQuery.value = '';

  const now = new Date().toLocaleTimeString('ro-RO', { hour12: false });
  messages.value.push({
    role: 'user',
    time: now,
    content: userText
  });

  isGenerating.value = true;
  await nextTick();
  scrollToBottom();

  setTimeout(() => {
    let responseText = '';
    let steps = [];

    if (userText.toLowerCase().includes('proxmox') || userText.toLowerCase().includes('cluster') || userText.toLowerCase().includes('health')) {
      steps = [
        { type: 'reasoning', badge: ' REASONING', text: 'Operator requested cluster telemetry probe. Resolving target nodes.' },
        { type: 'action', badge: ' EXEC_TOOL', text: 'proxmox_get_cluster_status(node="pve", ip="192.168.1.132")' },
        { type: 'observation', badge: ' OBSERVATION', text: 'PVE Online: CPU 14%, RAM 5.8/8GB, GTX 1050 Ti VRAM 1.2/4GB, ZFS Pool 100% OK.' },
        { type: 'action', badge: ' EXEC_TOOL', text: 'nas_get_smart_status(ip="192.168.1.135")' },
        { type: 'observation', badge: ' OBSERVATION', text: 'OpenMediaVault NAS: 0 bad sectors, CPU temp 34°C.' },
        { type: 'completed', badge: ' SYNTHESIS', text: 'Cluster operates within optimal bounds. Zero degraded services.' }
];
      responseText = 'Toate cele **4 noduri hardware** funcționează optim:\n- **Proxmox VE (192.168.1.132)**: CPU 14%, RAM 5.8/8 GB, 31 containere active.\n- **OpenMediaVault NAS (192.168.1.135)**: Stocare ZFS sănătoasă, SMART 100% OK.\n- **Apple M1 Host (192.168.1.133)**: ELO Daemon activ, accelerare Metal MPS pregătită.\n- **k8s Worker**: nod conectat.';
    } else if (userText.toLowerCase().includes('securitate') || userText.toLowerCase().includes('secops') || userText.toLowerCase().includes('opnsense')) {
      steps = [
        { type: 'reasoning', badge: ' REASONING', text: 'Dispatching telemetry probe to SecOps Threat-Hunter sub-agent.' },
        { type: 'action', badge: ' EXEC_TOOL', text: 'opnsense_get_firewall_logs(limit=50)' },
        { type: 'observation', badge: ' OBSERVATION', text: '0 active brute-force attempts. CrowdSec LAPI reputation score: 100% clean.' },
        { type: 'completed', badge: ' AUDIT_DONE', text: 'Perimeter firewall stateful rules validated. No IP quarantines required.' }
];
      responseText = ' **Raport SecOps Threat-Hunter**:\n- **OPNsense Firewall (192.168.1.132:8443)**: Niciun atac detectat în ultimele 60 de minute.\n- **Suricata NIDS / Wazuh SIEM**: 0 alerte critice.\n- **CrowdSec LAPI**: Bouncer activat, reguli sincronizate.';
    } else if (userText.toLowerCase().includes('esp32') || userText.toLowerCase().includes('room') || userText.toLowerCase().includes('living')) {
      steps = [
        { type: 'reasoning', badge: ' REASONING', text: 'Processing ESP32 room-awareness radar telemetry.' },
        { type: 'action', badge: ' EXEC_TOOL', text: 'esp32_set_presence_zone(room="Living", rssi=-54)' },
        { type: 'observation', badge: ' OBSERVATION', text: 'Presence shifted to Living. Re-routing contextual smart home entities.' },
        { type: 'completed', badge: ' ZONE_UPDATED', text: 'Living zone active. Ambient lights and audio target updated.' }
];
      responseText = ' **ESP32 Room-Awareness Sincronizat**:\n- Locația operatorului a fost actualizată la **Living** (mmWave radar detecție continuă).\n- Comenzile vocale și automatizările Home Assistant sunt acum direcționate în proximitatea din Living.';
    } else {
      steps = [
        { type: 'reasoning', badge: ' REASONING', text: 'Query evaluated through ReAct pipeline and pgvector semantic memory store.' },
        { type: 'action', badge: ' RETRIEVAL', text: 'pgvector_search_context(query="' + userText + '")' },
        { type: 'completed', badge: ' INFERENCE', text: 'Generated response using Groq Llama 3.3 70B (340 tokens/sec).' }
];
      responseText = 'Comanda a fost executată cu succes prin **ELO ReAct Loop**. Toate sistemele homelab au procesat cererea conform politicilor de securitate L0-L3.';
    }

    messages.value.push({
      role: 'assistant',
      time: new Date().toLocaleTimeString('ro-RO', { hour12: false }),
      content: responseText,
      steps: steps,
      showTrace: true
    });

    isGenerating.value = false;
    nextTick(() => scrollToBottom());
  }, 1000);
};

const scrollToBottom = () => {
  if (chatLogRef.value) {
    chatLogRef.value.scrollTop = chatLogRef.value.scrollHeight;
  }
};

// Animated Audio Visualizer Canvas
const initAudioVisualizer = () => {
  if (!audioCanvasRef.value) return;
  const canvas = audioCanvasRef.value;
  const ctx = canvas.getContext('2d');
  const barCount = 20;

  const renderWave = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width / barCount;

    for (let i = 0; i < barCount; i++) {
      const height = isGenerating.value 
        ? Math.random() * (canvas.height - 6) + 4
        : (Math.sin(Date.now() / 200 + i * 0.5) * 6 + 10);
      
      const x = i * width;
      const y = (canvas.height - height) / 2;

      ctx.fillStyle = isGenerating.value ? '#bb86fc' : '#2ecc71';
      ctx.fillRect(x + 1, y, width - 2, height);
    }
    animAudioId = requestAnimationFrame(renderWave);
  };
  renderWave();
};

onMounted(() => {
  initAudioVisualizer();
});

onUnmounted(() => {
  if (animAudioId) cancelAnimationFrame(animAudioId);
});
</script>

<style scoped>
.elo-terminal-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.terminal-banner {
  padding: 1.25rem 1.75rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.elo-avatar {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, #8e44ad, #3498db);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.banner-text h2 {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
}

.banner-text p {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.banner-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.waveform-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.waveform-label {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.cascade-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  background: rgba(46, 204, 113, 0.1);
  border: 1px solid rgba(46, 204, 113, 0.25);
  font-size: 0.75rem;
}

.pulse-emerald {
  width: 8px;
  height: 8px;
  background: #2ecc71;
  border-radius: 50%;
  box-shadow: 0 0 8px #2ecc71;
}

.terminal-workspace {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
}

.chat-container {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: rgba(18, 14, 15, 0.85);
  height: 650px;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  background: rgba(0, 0, 0, 0.25);
}

.terminal-dots {
  display: flex;
  gap: 0.4rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.red { background: #e74c3c; }
.dot.yellow { background: #f1c40f; }
.dot.green { background: #2ecc71; }

.terminal-title {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.btn-clear {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.chat-log {
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-msg {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  max-width: 90%;
  line-height: 1.5;
  font-size: 0.85rem;
}

.chat-msg.user {
  align-self: flex-end;
  background: rgba(62, 42, 44, 0.6);
  border: 1px solid rgba(184, 117, 122, 0.3);
}

.chat-msg.assistant {
  align-self: flex-start;
  background: rgba(36, 26, 28, 0.65);
  border: 1px solid var(--border-color);
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 700;
}

.cot-trace-block {
  margin: 0.5rem 0;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(142, 68, 173, 0.3);
  overflow: hidden;
}

.cot-trace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  background: rgba(142, 68, 173, 0.15);
  font-size: 0.75rem;
}

.cot-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
}

.cot-steps-body {
  padding: 0.6rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
}

.cot-step-item {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.step-badge {
  font-weight: 700;
  color: #bb86fc;
}

.step-content {
  color: var(--text-secondary);
}

.pills-bar {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  overflow-x: auto;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid var(--border-color);
}

.prompt-pill {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.prompt-pill:hover {
  background: rgba(62, 42, 44, 0.5);
  border-color: var(--border-color-hover);
  transform: translateY(-2px);
}

.chat-input-bar {
  display: flex;
  padding: 0.75rem 1rem;
  gap: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.terminal-input {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 0.85rem;
  outline: none;
}

.terminal-input:focus {
  border-color: var(--accent-primary-light);
}

.btn-send {
  padding: 0 1rem;
  border-radius: 8px;
  background: var(--accent-primary);
  border: 1px solid var(--border-color);
  color: #fff;
  cursor: pointer;
}

.terminal-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-section {
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.sidebar-title {
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.swarm-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.swarm-card {
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
}

.swarm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.swarm-name {
  font-size: 0.8rem;
  font-weight: 700;
}

.swarm-status {
  font-size: 0.65rem;
  font-weight: 700;
  color: #2ecc71;
}

.swarm-desc {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin: 0;
}

.rings-grid {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ring-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.75rem;
}

.ring-badge {
  font-family: var(--font-mono);
  font-weight: 800;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.65rem;
}

.ring-badge.l0 { background: rgba(52, 152, 219, 0.2); color: #3498db; }
.ring-badge.l1 { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }
.ring-badge.l2 { background: rgba(241, 196, 15, 0.2); color: #f1c40f; }
.ring-badge.l3 { background: rgba(231, 76, 60, 0.2); color: #e74c3c; }

.svg-icon { width: 22px; height: 22px; }
.svg-icon-sm { width: 16px; height: 16px; }
.svg-icon-xs { width: 12px; height: 12px; }

@media (max-width: 1000px) {
  .terminal-workspace {
    grid-template-columns: 1fr;
  }
}
</style>
