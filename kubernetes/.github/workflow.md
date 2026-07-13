```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub Repository
    participant Runner as Self-Hosted Runner (Attic Node)
    participant K8s as k3s Kubernetes Cluster

    Dev->>GH: Push code changes (.github/workflows/)
    GH->>Runner: Dispatch job to self-hosted runner
    Note over Runner: Runs inside localized network<br/>with secure internal access
    Runner->>K8s: Execute dry-run / apply manifests
    K8s-->>Runner: Confirm deployment status
    Runner-->>GH: Report build & deployment results
