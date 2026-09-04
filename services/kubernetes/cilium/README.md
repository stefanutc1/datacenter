# Cilium eBPF CNI & Network Security

* **Cluster Target**: Hybrid Kubernetes Fleet (Node 1 Talos/k0s + Node 3 UTM ARM64)
* **Technology**: eBPF Host Routing, WireGuard Transparent Encryption, Hubble UI (:12000)
* **Role**: High-throughput container network interface replacing kube-proxy, enforcing Zero-Trust L3-L7 network policies, and providing deep telemetry.
