# Rook Ceph Cloud-Native Distributed Storage Orchestrator

* **Cluster Target**: Hybrid Kubernetes Fleet (Node 1 Talos/k0s + Node 3 UTM ARM64)
* **Namespace**: `rook-ceph`
* **Dashboard Port**: 7000 / 8443
* **Storage Pools**: CephBlockPool (RBD), CephFilesystem (CephFS), ObjectStore (RGW S3)
* **Role**: Turns raw SSD/NVMe disk devices across nodes into a resilient, self-healing, distributed cloud storage cluster with automatic data replication and dynamic PV provisioning.
