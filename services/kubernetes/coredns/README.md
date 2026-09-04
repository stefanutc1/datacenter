# CoreDNS Cluster DNS & Service Discovery

* **Cluster Target**: Hybrid Kubernetes Fleet (Node 1 Talos/k0s + Node 3 UTM ARM64)
* **Namespace**: `kube-system`
* **Port**: 53 UDP/TCP
* **Role**: In-cluster split-horizon DNS resolver and service discovery, forwarding upstream requests to Pi-hole (`192.168.1.4`).
