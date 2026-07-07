# Contributing Guide

This document defines the standards for adding, modifying, and maintaining services within this repository. It exists to keep the infrastructure predictable, auditable, and safe to operate — whether you're the sole maintainer returning after months away, or a collaborator seeing the repo for the first time.

This repository is scoped strictly to **services** (application layer, managed via Docker Compose and orchestrated with Ansible). Networking, firewall rules, and OPNsense configuration live in a separate repository and are out of scope here.

---

## 1. Guiding Principles

- **Infrastructure as Code**: Every change to a running service must be traceable to a commit. No manual `docker exec` fixes that aren't reflected in the repo.
- **Secrets never touch version control.** No exceptions, no "just this once."
- **Modularity**: Each service is self-contained and independently deployable. A new service should never require editing unrelated services to function.
- **Separation of concerns**: This repo handles services. Network topology, VLANs, firewall rules, and reverse proxy routing at the network level belong in the `opnsense` repository.

---

## 2. Secrets Management

This is the single most important rule in this repository.

### Rules

1. **No secrets in Git, ever.** This includes API keys, passwords, tokens, database credentials, TLS private keys, and connection strings.
2. All secrets are provided via:
   - A local `.env` file (per service, git-ignored), **or**
   - An external vault/secrets manager (e.g., HashiCorp Vault, Ansible Vault, Bitwarden Secrets Manager) for anything deployed via automation.
3. Every service folder that requires secrets **must** include an `.env.example` file with the required variable names and placeholder/dummy values — never real ones.
4. `.env` is included in the root `.gitignore` and must not be re-added on a per-service basis.
5. If a secret is accidentally committed:
   - Rotate the credential immediately. Assume it is compromised the moment it hits Git history, even in a private repo.
   - Purge it from history (`git filter-repo` or equivalent) — do not rely on a follow-up commit to "remove" it.

### Ansible-managed secrets

For any secret consumed during an Ansible deployment (as opposed to a static `.env` read directly by Compose), use **Ansible Vault**:

```bash
ansible-vault encrypt group_vars/all/secrets.yml
```

Never commit an unencrypted `group_vars/*/secrets.yml`. The vault password itself is never stored in the repository, in plaintext files, or in chat/notes committed alongside it.

---

## 3. Adding a New Service

All services live under `/services/<service-name>/`. Before opening a PR (or committing directly, if working solo), confirm the folder matches this structure:

```
services/<service-name>/
├── docker-compose.yml
├── .env.example
├── README.md
└── volumes/            # if the service requires bind-mounted persistent data
    └── .gitkeep
```

### 3.1 `docker-compose.yml` requirements

- Pin image versions explicitly (`image: nginx:1.27.0`, not `nginx:latest`). Reproducibility matters more than always running bleeding-edge.
- Define all persistent data via named volumes or explicit bind mounts under `volumes/` — never rely on a container's anonymous/ephemeral filesystem for anything that must survive a redeploy.
- Set explicit container names and restart policies (`restart: unless-stopped` is the default expectation).
- Attach the service to the appropriate external Docker network (see `README.md` at the repo root for current network naming) rather than declaring ad hoc networks per service.
- Reference secrets via `env_file: .env`, never hardcoded inline.

### 3.2 `README.md` requirements

Each service's `README.md` should be short but complete enough that someone unfamiliar with the service can deploy and recover it. At minimum:

- **Purpose**: One or two sentences on what the service does and why it's in the homelab.
- **Dependencies**: Other services or external resources it requires (databases, reverse proxy, DNS entries).
- **Ports**: Exposed ports and their intended access scope (internal only vs. reverse-proxied).
- **Persistent data**: What's stored, where, and backup considerations.
- **Environment variables**: A table or list matching `.env.example`.
- **Restore procedure**: The minimum steps to bring this service back from a backup.

### 3.3 Persistent volume mapping

- Bind-mounted data goes under `services/<service-name>/volumes/`.
- Do **not** commit actual data contents — only a `.gitkeep` to preserve the folder structure, if needed. Add the concrete data path to `.gitignore`.
- Document the mapping explicitly in the service's `README.md` (host path → container path), even though the host path is git-ignored.

---

## 4. Updating Existing Configurations

- Changes to an existing `docker-compose.yml` should be made in a dedicated commit (or PR) that references *why* the change is happening (version bump, config fix, resource limit adjustment) — not bundled silently into unrelated work.
- Breaking changes (port changes, volume path changes, required new environment variables) must be called out at the top of the commit message and reflected in the service's `README.md` in the same change.
- If a change requires a one-time manual migration step (e.g., moving data to a new volume path), document that step in the README under a `## Migration Notes` section, and remove it once it's no longer relevant to new deployments.

---

## 5. Deployment via Ansible

Deployment and lifecycle management of services on hosts is handled through Ansible. Compose files describe *what* a service is; Ansible describes *where* and *how* it gets deployed.

### 5.1 Inventory conventions

- Hosts are grouped by role, not by hostname alone (e.g., `[docker_hosts]`, `[backup_targets]`), so playbooks can target a role rather than an individual machine.
- New hosts are added to `inventory/hosts.yml` (or the equivalent inventory file in use) under the appropriate group. Include a comment above non-obvious entries explaining the host's purpose.
- Host-specific variables (IP, SSH user, Docker Compose project path) go in `host_vars/<hostname>.yml`, not inline in the inventory file, to keep the inventory readable as it grows.
- Group-wide variables go in `group_vars/<group>.yml`.

Example inventory addition:

```yaml
# inventory/hosts.yml
docker_hosts:
  hosts:
    homelab-node02:
      ansible_host: 10.0.20.12
      ansible_user: deploy
```

### 5.2 Playbook expectations

- Each service should be deployable independently via tags (`ansible-playbook deploy.yml --tags "service-name"`), so a single-service redeploy doesn't require running the entire playbook.
- Idempotency is mandatory: running a playbook twice in a row should result in zero changes on the second run, assuming no drift.
- Any task that could be destructive (volume removal, container recreation with data loss potential) should be explicit and never a default behavior triggered by a routine deploy.

---

## 6. Commit and PR Conventions

- Commit messages should state *what* changed and, where not obvious, *why*. `Add vaultwarden service` is fine for a net-new addition; `Fix vaultwarden backup path` should briefly note what was broken.
- One logical change per commit where practical — a service addition and an unrelated config fix should not share a commit.
- If working via PRs (solo or collaborative), the PR description should confirm:
  - [ ] No secrets are present in the diff.
  - [ ] `.env.example` is updated if new environment variables were introduced.
  - [ ] The service's `README.md` reflects the current state of the service.
  - [ ] Image versions are pinned, not `latest`.

---
