# T-Pot Multi-Honeypot Platform (VM 213)

* **Host**: Node 1 (Intel i3-10100F x86_64)
* **VMID**: VM 213
* **Name**: `tpot-honeypot`
* **vCPU**: 4 Cores
* **RAM**: 8,192 MB (8 GB) with VirtIO dynamic memory ballooning to 4,096 MB (4 GB)
* **Storage**: 60 GB NVMe disk (`local-lvm:vm-213-disk-0`)
* **IP**: `192.168.1.213` (Web UI on port 64297)
* **Role**: All-in-one multi-honeypot decoy system powered by Telekom Security. Runs 20+ specialized honeypot daemons (Cowrie, Dionaea, Conpot, Honeytrap, Heralding) aggregating real-world threat telemetry, brute-force patterns, and zero-day exploitation attempts into Elasticsearch, Kibana, and Suricata IDS.
