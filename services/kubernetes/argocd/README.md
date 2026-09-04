# ArgoCD GitOps Continuous Delivery

* **Cluster Target**: Hybrid Kubernetes Fleet (Node 1 Talos/k0s + Node 3 UTM ARM64)
* **Namespace**: `argocd`
* **Port**: 8080 (Web UI / API)
* **Role**: Automated GitOps engine synchronizing Kubernetes deployments from `github.com/stefanutc1/homelab.git` with drift detection and self-healing.
