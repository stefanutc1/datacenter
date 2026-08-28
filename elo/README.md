# ELO — AI Operating Layer & Orchestrator

Personal AI operating layer and orchestration platform connecting Homelab infrastructure, academic/business ERP, and commercial retail SaaS.

---

## 🏗️ Monorepo Architecture

```
elo/
├── packages/
│   ├── elo-contracts/         # Pydantic v2 schemas: SecurityLevel (L0-L3), Tools, Events
│   ├── elo-security/          # Zero-trust Gatekeeper, HMAC Capability Tokens, Approval Queues
│   └── elo-ai-client/         # Hybrid LLM Router (Ollama/vLLM Local + Gemini/Claude Cloud)
│
├── apps/
│   └── elo-core/              # FastAPI Daemon, Tool Registry, ReAct Engine, Telegram Bot, CLI
│
├── infra/
│   └── init-db.sql            # PostgreSQL 16 + pgvector schema initialization
│
├── docker-compose.yml         # Postgres pgvector + Redis 7 local stack
├── .env.example               # Environment variables template
└── pyproject.toml
```

---

## 🚀 Quickstart

### 1. Activați mediul virtual și instalați pachetele

```bash
cd /Users/s3nnnzzzatyeeee/.gemini/antigravity/scratch/elo
source .venv/bin/activate
pip install -e packages/elo-contracts -e packages/elo-security -e packages/elo-ai-client -e apps/elo-core
```

### 2. Rulați testele automate

```bash
pytest -v
```

### 3. Porniți CLI-ul interactiv ELO

```bash
python -m elo_core.cli
```

### 4. Porniți serverul FastAPI (REST API & Webhooks)

```bash
uvicorn elo_core.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🛡️ Niveluri de Securitate Implementate

* **`L0_READ_ONLY`**: Interogări de stare și telemetrie (auto-executate instantaneu).
* **`L1_LOW_WRITE`**: Acțiuni idempotente cu impact redus (auto-executate + audit log).
* **`L2_HIGH_IMPACT`**: Restart containere, modificări financiare (necesită aprobare interactivă Telegram/Web/CLI).
* **`L3_CRITICAL`**: Comenzi distructive, ștergere date, 2FA challenge strict.

---

## 📡 API Endpoints

* `GET /health` — Statusul sistemului și al routerului LLM.
* `GET /v1/tools` — Lista uneltelor înregistrate cu nivelul de securitate asociat.
* `POST /v1/chat` — Procesare ReAct a mesajelor utilizatorului.
* `GET /v1/approvals` — Lista ticketelor de aprobare active (L2/L3).
* `POST /v1/approvals/{id}/resolve` — Rezolvarea aprobărilor (`approved: true/false`).
* `GET /v1/audit` — Jurnalul de audit securizat.
