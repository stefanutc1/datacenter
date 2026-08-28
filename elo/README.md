# 🧠 ELO — Autonomous AI Operating Layer & Orchestrator

Personal autonomous AI operating layer and orchestration platform connecting Homelab infrastructure (Proxmox VE, OpenMediaVault, Home Assistant, OPNsense), Academic/Business ERP, and Cyber Defense into a unified JARVIS-style intelligence.

---

## 🏗️ Architecture

```
elo/
├── apps/
│   └── elo-core/              # FastAPI Daemon, ReAct Engine, Watchdog, Web UI, Telemetry
│       ├── src/elo_core/
│       │   ├── engine.py              # Central ReAct loop & security gating
│       │   ├── registry.py            # Tool Registry with L0-L3 security policies
│       │   ├── telemetry.py           # Multi-node async TCP prober & psutil host metrics
│       │   ├── proxmox_client.py      # Live Proxmox VE REST API client (QEMU/LXC/snapshots)
│       │   ├── homeassistant_client.py# Smart Home REST/WS API client (lights/switches/sensors)
│       │   ├── opnsense_client.py     # OPNsense firewall & CrowdSec cyber shield
│       │   ├── watchdog.py            # Background autonomous self-healing watchdog loop
│       │   ├── notifier.py            # Phone SMS (Twilio/Gateway), Push (NTFY), Telegram
│       │   ├── knowledge.py           # Homelab semantic knowledge base & RAG search
│       │   └── static/index.html      # Holographic Arc Reactor Web UI & "Hey ELO" Wake Word
│       └── tests/
│
├── packages/
│   ├── elo-ai-client/         # Tiered Multi-Provider Cascade Router with Zero-Latency Failover
│   │   ├── cloud_client.py        # Google Gemini Direct (gemini-3.6-flash / gemini-2.5-pro)
│   │   ├── openrouter_client.py   # OpenRouter.ai Universal Hub (GPT-4o, Claude 3.5, DeepSeek)
│   │   ├── openai_client.py       # OpenAI Direct (gpt-4o-mini, gpt-4o)
│   │   ├── claude_client.py       # Anthropic Direct (claude-3-5-sonnet)
│   │   ├── local_client.py        # Local Self-Hosted Ollama / vLLM (Metal MPS)
│   │   ├── mock_client.py         # Deterministic mock client with rich markdown formatting
│   │   └── router.py              # Cascade Router with automatic 5m quota cooldown
│   │
│   ├── elo-contracts/         # Pydantic v2 Schemas (SecurityLevel L0-L3, Tools, Events)
│   └── elo-security/          # Zero-trust Gatekeeper, HMAC Capability Tokens, Approval Queues
│
├── docker-compose.yml         # PostgreSQL 16 (pgvector) + Redis 7 local stack
├── infra/init-db.sql          # Semantic memory, audit logs, and approval schemas
└── .env.example               # Secure environment template (zero secrets)
```

---

## ⚡ Tiered Multi-Provider AI Cascade

$$\text{Tier 1: Google Gemini} \xrightarrow[\text{Out of Credits / 429}]{\mathbf{\text{Instant 0ms Failover}}} \mathbf{\text{Tier 2: OpenRouter Hub}} \xrightarrow{\text{Failover}} \text{Tier 3: OpenAI Direct} \xrightarrow{\text{Failover}} \text{Tier 4: Claude} \xrightarrow{\text{Failover}} \text{Tier 5: Ollama} \xrightarrow{\text{Failover}} \text{Tier 6: Mock}$$

* **Zero-Latency Quota Failover**: If Gemini or any provider runs out of credits, hits rate limits (`429`), or returns `insufficient_quota`, ELO instantly falls back to OpenRouter or Claude without interrupting the user.
* **Smart 5-Minute Cooldown**: Exhausted providers are placed on temporary cooldown so subsequent turns skip them in `0ms` instead of wasting time waiting for failed API calls.

---

## 🛡️ Security Levels (L0–L3)

* **`L0_READ_ONLY`**: Status checks, telemetries, doc searches (auto-executed instantaneu).
* **`L1_LOW_WRITE`**: Smart home device toggles, SMS alerts (auto-executed + audit log).
* **`L2_HIGH_IMPACT`**: VM reboot/stop/snapshot, IP blocking (requires interactive user approval on UI/Telegram/Phone).
* **`L3_CRITICAL`**: Destructive actions, system wipe (requires 2FA strict challenge).

---

## 🚀 Quickstart

### 1. Setup Virtual Environment
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e packages/elo-contracts -e packages/elo-security -e packages/elo-ai-client -e apps/elo-core
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and configure your GEMINI_API_KEY, OPENROUTER_API_KEY, ADMIN_PHONE_NUMBER, etc.
```

### 3. Run Automated Tests
```bash
pytest -v
```

### 4. Launch ELO Core Daemon
```bash
uvicorn elo_core.main:app --host 0.0.0.0 --port 8000 --reload
```
Open `http://localhost:8000` to access the Holographic Arc Reactor UI with **"Hey ELO"** voice recognition!

---

## 📡 Core API Endpoints

* `GET /health` — Status of the AI core and cascaded providers.
* `GET /v1/telemetry` — Real-time multi-node probing (Proxmox, NAS, M1).
* `POST /v1/chat` — ReAct conversational engine and autonomous tool executor.
* `GET /v1/proxmox/status` — Live Proxmox VE REST API cluster status.
* `GET /v1/homeassistant/states` — Smart home devices and sensor states.
* `GET /v1/opnsense/status` — OPNsense gateway health and cyber defenses.
* `GET /v1/watchdog/status` — Status of the 30s background self-healing watchdog.
* `GET /v1/approvals` — Pending L2/L3 security approval requests.
* `POST /v1/approvals/{id}/resolve` — Approve or reject security gate actions.
* `GET /v1/audit` — Immutable cryptographic audit log.
