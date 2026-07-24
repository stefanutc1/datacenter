# ☸️ Kubernetes & GitOps

## k3s Cluster Architecture

The Kubernetes layer runs a lightweight, production-tuned k3s cluster configured via Ansible in `kubernetes/ansible/`.

```
┌─────────────────────────────────────────────────────────┐
│              k3s Single-Node / Multi-Worker             │
│                                                         │
│  Control Plane (k3s-server)                             │
│  ├── Embedded SQLite / Kine datastore                   │
│  ├── CoreDNS & Traefik disabled (handled by NPM)        │
│  └── Flannel VXLAN overlay network                      │
│                                                         │
│  FluxCD Controller Layer                                │
│  ├── Source Controller (polls stefannut/homelab @ 5m)   │
│  ├── Kustomize Controller (evaluates manifests)         │
│  └── Notification Controller (Discord webhooks)         │
└─────────────────────────────────────────────────────────┘
```

## Continuous Reconciliation with FluxCD

FluxCD monitors `kubernetes/gitops/` in the main repository:

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: homelab-repo
  namespace: flux-system
spec:
  interval: 5m0s
  url: https://github.com/stefannut/homelab
  ref:
    branch: main
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: cluster-workloads
  namespace: flux-system
spec:
  interval: 10m0s
  path: "./kubernetes/gitops/clusters/homelab"
  prune: true
  sourceRef:
    kind: GitRepository
    name: homelab-repo
```
