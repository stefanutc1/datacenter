import { Injectable, signal } from '@angular/core';

export type Language = 'ro' | 'en';

export interface Translations {
  // Navigation & Header
  navOverview: string;
  navTopology: string;
  navServices: string;
  navHardware: string;
  navBlueprint: string;
  statusClusterActive: string;
  sublabelTag: string;

  // Overview / Hero
  heroTag: string;
  heroTitle: string;
  heroDescription: string;
  metricComputeTitle: string;
  metricComputeCount: string;
  metricComputeDesc: string;
  metricVirtTitle: string;
  metricVirtCount: string;
  metricVirtDesc: string;
  metricServicesTitle: string;
  metricServicesCount: string;
  metricServicesDesc: string;
  metricCyberTitle: string;
  metricCyberCount: string;
  metricCyberDesc: string;

  // 3D Topology
  topologyTag: string;
  topologyTitle: string;
  topologyDesc: string;
  btnRotate: string;
  btnReset: string;
  btnLogical: string;
  btnPhysical: string;
  meshActive: string;
  nodesLabel: string;
  flowsLabel: string;
  interactionHint: string;
  catAll: string;
  catCompute: string;
  catNetwork: string;
  catSecurity: string;
  catServices: string;
  catElo: string;
  catStorage: string;
  catEdge: string;

  // Hardware Fleet
  hwTag: string;
  hwTitle: string;
  hwDesc: string;
  hwCpu: string;
  hwOs: string;
  hwRam: string;
  hwStorage: string;
  hwGpu: string;
  hwPsu: string;
  hwHostedWorkloads: string;
  btnLocate3D: string;

  // Service Catalog
  srvTag: string;
  srvTitle: string;
  srvDesc: string;
  srvSearchPlaceholder: string;
  srvRamCeiling: string;
  srvStoragePool: string;
  btnLocateInMesh: string;
  srvCatAll: string;
  srvCatCore: string;
  srvCatStorage: string;
  srvCatMedia: string;
  srvCatMonitoring: string;
  srvCatSecurity: string;
  srvCatAutomation: string;
  srvCatCyber: string;
  srvCatAi: string;

  // Architecture Blueprint
  bpTag: string;
  bpTitle: string;
  bpDesc: string;
  tabVlan: string;
  tabCyber: string;
  tabMemory: string;
  tabAi: string;
  tabDevSecOps: string;

  // Node Inspector
  inspectorSpec: string;
  inspectorCascade: string;
  inspectorManifest: string;
  inspectorRole: string;
  inspectorHostAllocation: string;
  inspectorComputeHost: string;
  inspectorTierLevel: string;
  inspectorNetworkConfig: string;
  inspectorIp: string;
  inspectorPort: string;
  inspectorSubsystem: string;
  inspectorRelationshipChain: string;
  inspectorConnectedNodes: string;
  inspectorCopySpec: string;
  inspectorCopied: string;

  // Footer
  footerSub: string;
  footerTop: string;
  footerGithub: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  ro: {
    navOverview: 'Prezentare',
    navTopology: 'Topologie 3D',
    navServices: 'Servicii (36)',
    navHardware: 'Flotă Hardware',
    navBlueprint: 'Arhitectură & Cyber',
    statusClusterActive: 'CLUSTER OPERAȚIONAL',
    sublabelTag: '// Digital Twin Infrastructură',

    heroTag: 'ARHITECTURĂ DE INFRASTRUCTURĂ & DIGITAL TWIN',
    heroTitle: 'Cluster eterogen bare-metal, cloud privat și poligon de securitate cibernetică.',
    heroDescription: 'Înregistrare de inginerie și copie digitală interactivă ce îmbină virtualizarea Proxmox VE pe Apple Silicon ARM64 și Intel x86_64 cu Windows Server Active Directory, pool-uri ZFS, segmentare zero-trust, Ollama LLM local pe GPU și orchestrare autonomă.',
    
    metricComputeTitle: 'COMPUTE FIZIC',
    metricComputeCount: '4 Noduri',
    metricComputeDesc: 'Intel i3-10100F (GTX 1050 Ti), Apple M1 Silicon, ASUS Celeron OMV NAS și AMD Athlon II k3s.',
    
    metricVirtTitle: 'VIRTUALIZARE',
    metricVirtCount: '2 Hypervisori',
    metricVirtDesc: 'Proxmox VE x86_64 & ARM64 găzduind OPNsense, Windows Server 2025, Ollama și 24 de containere LXC.',
    
    metricServicesTitle: 'MICROSERVICII',
    metricServicesCount: '36 Workload-uri',
    metricServicesDesc: 'Servicii containerizate: stocare ZFS, media streaming, CI/CD Woodpecker, Git, Wikipedia și telemetrie.',
    
    metricCyberTitle: 'CYBER & DFIR',
    metricCyberCount: 'SOC & Honeynet',
    metricCyberDesc: 'Wazuh SIEM/XDR, T-Pot DMZ, Suricata/Snort IDS, Sysmon, Atomic Red Team, Cuckoo/CAPEv2 și Volatility.',

    topologyTag: 'VIZUALIZARE SPAȚIALĂ',
    topologyTitle: 'Digital Twin Interactiv al Infrastructurii',
    topologyDesc: 'Apasă pe noduri pentru inspectarea specificațiilor, relațiilor de rețea și manifestelor de configurare.',
    btnRotate: 'Rotire',
    btnReset: 'Resetare',
    btnLogical: 'Logic',
    btnPhysical: 'Fizic',
    meshActive: 'MESH ACTIV',
    nodesLabel: 'NODURI',
    flowsLabel: 'FLUXURI ACTIVE',
    interactionHint: 'TRAGE PENTRU ROTIRE · SCROLL PENTRU ZOOM · CLICK PENTRU DETALII',
    catAll: 'Toate Straturile',
    catCompute: 'Compute & Hypervisori',
    catNetwork: 'Rețea & Ingress',
    catSecurity: 'Securitate & Cyber',
    catServices: 'Workload-uri Core',
    catElo: 'Control Plane AI',
    catStorage: 'Stocare & ZFS',
    catEdge: 'Senzori Edge',

    hwTag: 'ARHITECTURĂ COMPUTE FIZIC & INVENTAR HARDWARE',
    hwTitle: 'Flota Hardware Fizică (4 Noduri Compute)',
    hwDesc: 'Sursă de adevăr din hardware/hardware.md — infrastructură multi-arhitectură bare-metal: virtualizare Intel Core i3, noduri ARM64 Apple M1 UTM, NAS ZFS ASUS Celeron și worker Kubernetes AMD Athlon II.',
    hwCpu: 'Procesor (CPU)',
    hwOs: 'Sistem de Operare',
    hwRam: 'Capacitate RAM',
    hwStorage: 'Pool Stocare',
    hwGpu: 'Placă Video / Accelerator ML',
    hwPsu: 'Sursă Alimentare (PSU)',
    hwHostedWorkloads: 'Workload-uri Virtuale Găzduite pe acest Nod',
    btnLocate3D: 'LOCALIZEAZĂ ÎN 3D',

    srvTag: 'CATALOG DE MICROSERVICII & WORKLOAD-URI',
    srvTitle: 'Servicii Containerizate Active (36)',
    srvDesc: 'Microservicii live, baze de date, modele LLM locale, Wikipedia offline și sandboxes rulate pe Proxmox x86_64, ARM64 și storage ZFS cu alocări stricte de resurse.',
    srvSearchPlaceholder: 'Caută serviciu, port, gazdă, categorie...',
    srvRamCeiling: 'Plafon RAM',
    srvStoragePool: 'Pool Stocare',
    btnLocateInMesh: 'LOCALIZEAZĂ ÎN MESH 3D',
    srvCatAll: 'Toate Serviciile',
    srvCatCore: 'Infrastructură Core',
    srvCatStorage: 'Stocare & Sync',
    srvCatMedia: 'Media Streaming',
    srvCatMonitoring: 'Observabilitate',
    srvCatSecurity: 'Securitate & SSO',
    srvCatAutomation: 'Automatizare & IoT',
    srvCatCyber: 'Cyber & DFIR',
    srvCatAi: 'AI & Ollama LLM',

    bpTag: 'SCHEMA TEHNICĂ & SPECIFICAȚII DE REȚEA',
    bpTitle: 'Arhitectura și Blueprint-ul Clusterului',
    bpDesc: 'Specificații tehnice pentru izolarea VLAN, suita de apărare cibernetică, honeypots T-Pot, digital forensics (DFIR), bugete RAM și cascade LLM.',
    tabVlan: 'Matrice Segmentare VLAN',
    tabCyber: 'Securitate Cibernetică, DFIR & Honeypots',
    tabMemory: 'Bugete Alocare RAM',
    tabAi: 'Cascadă Rutare AI (ELO & Ollama)',
    tabDevSecOps: 'DevSecOps & Imutabilitate',

    inspectorSpec: 'SPECIFICAȚIE',
    inspectorCascade: 'RELAȚII',
    inspectorManifest: 'MANIFEST',
    inspectorRole: 'ROL FUNCȚIONAL & ARHITECTURAL',
    inspectorHostAllocation: 'GAZDĂ & ALOCARE CAPACITATE',
    inspectorComputeHost: 'Gazdă Compute',
    inspectorTierLevel: 'Nivel Strat',
    inspectorNetworkConfig: 'Configurație Rețea',
    inspectorIp: 'Adresă IP',
    inspectorPort: 'Port Expus',
    inspectorSubsystem: 'Subsistem',
    inspectorRelationshipChain: 'Lanț de Relații End-to-End',
    inspectorConnectedNodes: 'Noduri Mesh Conectate',
    inspectorCopySpec: 'COPIAZĂ SPEC',
    inspectorCopied: 'COPIAT!',

    footerSub: '— Proxmox VE · Windows Server AD · WireGuard · Wazuh XDR · DFIR · Ollama LLM · ELO',
    footerTop: 'SUS ↑',
    footerGithub: 'REPO GITHUB'
  },
  en: {
    navOverview: 'Overview',
    navTopology: '3D Topology',
    navServices: 'Services (36)',
    navHardware: 'Hardware Fleet',
    navBlueprint: 'Cyber & Architecture',
    statusClusterActive: 'CLUSTER OPERATIONAL',
    sublabelTag: '// Infrastructure Digital Twin',

    heroTag: 'INFRASTRUCTURE ARCHITECTURE & DIGITAL TWIN',
    heroTitle: 'A heterogeneous bare-metal compute cluster, private cloud, and cyber defense proving ground.',
    heroDescription: 'An engineering record and interactive digital twin spanning Apple Silicon ARM64, Intel x86_64 virtualization with Windows Server Active Directory, ZFS storage pools, zero-trust network segmentation, local GPU Ollama LLMs, and autonomous AI cluster orchestration.',
    
    metricComputeTitle: 'PHYSICAL COMPUTE',
    metricComputeCount: '4 Nodes',
    metricComputeDesc: 'Intel i3-10100F (GTX 1050 Ti), Apple M1 Silicon, ASUS Celeron OMV NAS, and AMD Athlon II k3s.',
    
    metricVirtTitle: 'VIRTUALIZATION',
    metricVirtCount: '2 Hypervisors',
    metricVirtDesc: 'Proxmox VE x86_64 & ARM64 hosting OPNsense, Windows Server 2025, Ollama, and 24 LXC containers.',
    
    metricServicesTitle: 'MICROSERVICES',
    metricServicesCount: '36 Workloads',
    metricServicesDesc: 'Containerized services: ZFS storage, media streaming, Woodpecker CI/CD, Git, Wikipedia, and telemetry.',
    
    metricCyberTitle: 'CYBER & DFIR',
    metricCyberCount: 'SOC & Honeynet',
    metricCyberDesc: 'Wazuh SIEM/XDR, T-Pot DMZ, Suricata/Snort IDS, Sysmon, Atomic Red Team, Cuckoo/CAPEv2, and Volatility.',

    topologyTag: 'SPATIAL VISUALIZATION',
    topologyTitle: 'Interactive Infrastructure Digital Twin',
    topologyDesc: 'Click nodes to inspect technical specs, network relationships, and compose manifests.',
    btnRotate: 'Rotate',
    btnReset: 'Reset',
    btnLogical: 'Logical',
    btnPhysical: 'Physical',
    meshActive: 'MESH ACTIVE',
    nodesLabel: 'NODES',
    flowsLabel: 'LIVE FLOWS',
    interactionHint: 'DRAG TO ROTATE · SCROLL TO ZOOM · CLICK TO INSPECT',
    catAll: 'All Layers',
    catCompute: 'Compute & Hypervisors',
    catNetwork: 'Network & Ingress',
    catSecurity: 'Security & Cyber',
    catServices: 'Core Workloads',
    catElo: 'AI Control Plane',
    catStorage: 'Storage & ZFS',
    catEdge: 'Edge Sensors',

    hwTag: 'PHYSICAL COMPUTE ARCHITECTURE & HARDWARE INVENTORY',
    hwTitle: 'Physical Hardware Fleet (4 Compute Nodes)',
    hwDesc: 'Single source of truth from hardware/hardware.md — multi-architecture bare-metal infrastructure: Intel Core i3 virtualization, Apple M1 Silicon ARM64 UTM nodes, ASUS Celeron ZFS storage NAS, and AMD Athlon II Kubernetes worker.',
    hwCpu: 'Processor (CPU)',
    hwOs: 'Operating System',
    hwRam: 'RAM Capacity',
    hwStorage: 'Storage Pool',
    hwGpu: 'Graphics / ML Accelerator',
    hwPsu: 'Power Supply (PSU)',
    hwHostedWorkloads: 'Hosted Virtual Workloads & Services',
    btnLocate3D: 'LOCATE IN 3D',

    srvTag: 'MICROSERVICES CATALOG & WORKLOAD ROSTER',
    srvTitle: 'Active Containerized Services (36)',
    srvDesc: 'Live microservices, databases, local LLM models, offline Wikipedia, and sandboxes running on Proxmox x86_64, ARM64, and ZFS storage with explicit resource allocations.',
    srvSearchPlaceholder: 'Search service, port, host, category...',
    srvRamCeiling: 'RAM Ceiling',
    srvStoragePool: 'Storage Pool',
    btnLocateInMesh: 'LOCATE IN 3D MESH',
    srvCatAll: 'All Services',
    srvCatCore: 'Core Infrastructure',
    srvCatStorage: 'Storage & Sync',
    srvCatMedia: 'Media Streaming',
    srvCatMonitoring: 'Observability',
    srvCatSecurity: 'Security & SSO',
    srvCatAutomation: 'Automation & IoT',
    srvCatCyber: 'Cyber & DFIR',
    srvCatAi: 'AI & Ollama LLM',

    bpTag: 'ENGINEERING BLUEPRINT & NETWORK SCHEMATICS',
    bpTitle: 'Cluster Architecture Blueprint',
    bpDesc: 'Technical specifications for VLAN isolation, cyber defense toolchains, T-Pot honeypots, digital forensics (DFIR), RAM budgets, and AI model routing cascades.',
    tabVlan: 'VLAN Segmentation Matrix',
    tabCyber: 'Cyber Security, DFIR & Honeypots',
    tabMemory: 'RAM Allocation Budgets',
    tabAi: 'AI Routing Cascade (ELO & Ollama)',
    tabDevSecOps: 'DevSecOps & Immutability',

    inspectorSpec: 'SPECIFICATION',
    inspectorCascade: 'RELATIONSHIPS',
    inspectorManifest: 'MANIFEST',
    inspectorRole: 'FUNCTION & ARCHITECTURAL ROLE',
    inspectorHostAllocation: 'HOST & CAPACITY ALLOCATION',
    inspectorComputeHost: 'Compute Host',
    inspectorTierLevel: 'Tier Level',
    inspectorNetworkConfig: 'Network Configuration',
    inspectorIp: 'IP Address',
    inspectorPort: 'Exposed Port',
    inspectorSubsystem: 'Subsystem',
    inspectorRelationshipChain: 'End-to-End Relationship Chain',
    inspectorConnectedNodes: 'Connected Mesh Nodes',
    inspectorCopySpec: 'COPY SPEC',
    inspectorCopied: 'COPIED!',

    footerSub: '— Proxmox VE · Windows Server AD · WireGuard · Wazuh XDR · DFIR · Ollama LLM · ELO',
    footerTop: 'TOP ↑',
    footerGithub: 'GITHUB REPO'
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang = signal<Language>('ro');

  constructor() {
    const saved = localStorage.getItem('homelab_lang') as Language;
    if (saved === 'ro' || saved === 'en') {
      this.currentLang.set(saved);
    }
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    localStorage.setItem('homelab_lang', lang);
  }

  get t(): Translations {
    return TRANSLATIONS[this.currentLang()];
  }
}
