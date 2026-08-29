# Contributing to Homelab & ELO

Thank you for your interest in contributing to the **Homelab & ELO (Enhanced Local Orchestrator)** platform! This repository contains the declarative infrastructure configurations, automation playbooks, local orchestrator services, and web dashboard for a self-hosted homelab environment.

---

## Table of Contents
1. [Monorepo Architecture Overview](#1-monorepo-architecture-overview)
2. [Development Environment Setup](#2-development-environment-setup)
3. [Conventional Commits & Git Standards](#3-conventional-commits--git-standards)
4. [Testing & Quality Assurance](#4-testing--quality-assurance)
5. [Code Quality & Linting Baselines](#5-code-quality--linting-baselines)
6. [Pull Request & Review Process](#6-pull-request--review-process)
7. [Security & Data Hygiene Rules](#7-security--data-hygiene-rules)

---

## 1. Monorepo Architecture Overview

The codebase is organized as a unified monorepo:

```
homelab/
├── .github/workflows/         # CI/CD Workflows & Quality Checks
├── ai/                        # Antigravity Model Context Protocol (MCP) Server
├── ansible/                   # Ansible Playbooks, Inventories & CIS Hardening Roles
├── cyber/                     # Defensive SIEM / SOC Telemetry & CTF Labs
├── elo/                       # ELO Control Plane & Automation Agents
│   ├── apps/
│   │   ├── elo-core/          # FastAPI Daemon, Watchdog, Memory & Tools
│   │   └── elo-desktop-macos/ # Native C# .NET 10 macOS Application (.dmg)
│   └── packages/
│       ├── elo-contracts/     # Type-Safe Pydantic v2 Models
│       ├── elo-security/      # Zero-Trust Gatekeeper & Capability Tokens
│       └── elo-ai-client/     # Free-Tier Fallback Cascade Client (Groq/Gemini/Ollama)
├── scripts/                   # System Administration & PuTTY Automation Toolkit
├── services/                  # Production Docker Compose Workloads (31 Stacks)
├── terraform/                 # Infrastructure as Code for Proxmox VMs
└── web/                       # Unified Vue 3 / Vite Dashboard & Documentation
```

---

## 2. Development Environment Setup

### Prerequisites
- **Python**: `3.9` through `3.13` (recommended: `3.12`)
- **Node.js**: `22.x LTS` + `npm`
- **Docker & Docker Compose**: `v2.24+`
- **.NET SDK**: `10.0` (for macOS Desktop App development)
- **Git**: `2.40+`

### Initializing the Local Environment

```bash
# 1. Clone repository
git clone https://github.com/stefanutc1/homelab.git
cd homelab

# 2. Setup ELO Python virtual environment
cd elo
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install pytest pytest-asyncio pytest-cov httpx pydantic psutil uvicorn fastapi pyyaml python-dotenv
pip install -e packages/elo-contracts -e packages/elo-security -e packages/elo-ai-client -e apps/elo-core

# 3. Setup Web Dashboard
cd ../web
npm install
```

---

## 3. Conventional Commits & Git Standards

We strictly adhere to the **Conventional Commits 1.0.0** specification:

```
<type>(<scope>): <short description in imperative mood>

[optional body explaining why and context]

[optional footer for issue tracking: Fixes #123]
```

### Supported Commit Types:
* `feat`: A new feature (e.g. adding a new ELO agent or tool).
* `fix`: A bug fix (e.g. patching failover router cooldown or network timeout).
* `docs`: Documentation updates (e.g. `README.md`, `SECURITY.md`, `ARCHITECTURE.md`).
* `refactor`: Code restructuring without modifying behavior.
* `test`: Adding or correcting automated tests.
* `ci`: CI/CD workflow, runner, or packaging updates.
* `security`: Vulnerability remediation or gatekeeper policy updates.
* `chore`: Dependency updates, formatting, and routine housekeeping.

---

## 4. Testing & Quality Assurance

All features and bug fixes must include automated test coverage:

```bash
# Run full ELO test suite with coverage
cd elo
pytest -v --cov=elo_core --cov=elo_security --cov=elo_ai_client --cov=elo_contracts -o asyncio_mode=auto

# Test multi-distribution Linux portability locally
cd ..
sh scripts/test_distro_compatibility.sh
```

**Quality Baseline**: All **28/28 tests** must pass 100% green before any PR will be considered for review.

---

## 5. Code Quality & Linting Baselines

Before submitting a PR, ensure all local linters pass cleanly:

```bash
# 1. Python Linting & Formatting (Ruff)
ruff check elo/
ruff format elo/

# 2. Python Static Type Checking (MyPy)
mypy --ignore-missing-imports elo/packages/elo-contracts/src elo/packages/elo-security/src elo/packages/elo-ai-client/src elo/apps/elo-core/src

# 3. Shell Script Portability (ShellCheck)
find scripts ai elo .github -name "*.sh" -exec shellcheck -e SC1091 -e SC2086 {} +

# 4. YAML Syntax Verification (Yamllint)
yamllint -d "{extends: default, rules: {line-length: {max: 300}, document-start: disable}}" .

# 5. Frontend Build Verification (Vue 3 / Vite)
cd web && npm run build
```

---

## 6. Pull Request & Review Process

1. **Branch Naming**:
   - `feature/name-of-feature`
   - `fix/issue-description`
   - `ci/pipeline-enhancement`
2. **Pull Request Checklist**:
   - [] Branch is rebased against the latest `main`.
   - [] All automated tests pass (`pytest -v`).
   - [] Linters (`ruff`, `mypy`, `shellcheck`, `yamllint`) return 0 errors.
   - [] Documentation (`README.md`, `ARCHITECTURE.md`) has been updated.
   - [] No API keys, credentials, or `.env` files are included.
3. **CI Quality Gate**:
   - The CI Pipeline must execute and pass on GitHub Actions.

---

## 7. Security & Data Hygiene Rules

> [!CAUTION]
> **Zero Credential Exposure Rule**:
> Never commit `.env` files, production tokens (`TELEGRAM_BOT_TOKEN`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`), private SSH keys, or wireguard configuration files.
> All secrets must remain local or managed via environment variables and GitHub Action Secrets.
