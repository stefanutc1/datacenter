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
    navServices: 'Servicii (76)',
    navHardware: 'Flotă Hardware',
    navBlueprint: 'Arhitectură & Cyber',
    statusClusterActive: '4 noduri online',
    sublabelTag: 'Infrastructură & Servicii',

    heroTag: 'ARHITECTURĂ & PREZENTARE TEHNICĂ',
    heroTitle: 'Cluster eterogen bare-metal, cloud privat și laborator de securitate.',
    heroDescription: 'Documentație tehnică și prezentare interactivă a infrastructurii: virtualizare Proxmox VE pe Apple Silicon ARM64 și Intel x86_64, Windows Server Active Directory, stocare ZFS, segmentare firewall OPNsense, modele LLM locale pe GPU și automatizare.',
    
    metricComputeTitle: 'COMPUTE FIZIC',
    metricComputeCount: '4 Noduri',
    metricComputeDesc: 'Intel i3-10100F (GTX 1050 Ti), Apple M1 Silicon, ASUS Celeron OMV NAS și AMD Athlon II k3s.',
    
    metricVirtTitle: 'VIRTUALIZARE',
    metricVirtCount: '2 Hypervisori',
    metricVirtDesc: 'Proxmox VE x86_64 (42 workloads) & ARM64 (34 workloads) găzduind OPNsense, Windows AD, RHEL, BSD și containere LXC.',
    
    metricServicesTitle: 'SERVICII ACTIVE',
    metricServicesCount: '76 Workload-uri',
    metricServicesDesc: '71 containere LXC optimizate + 5 mașini virtuale QEMU/KVM pe ambele hypervisoare x86_64 și ARM64.',
    
    metricCyberTitle: 'SECURITATE & DFIR',
    metricCyberCount: 'SOC & Honeynet',
    metricCyberDesc: 'Wazuh SIEM/XDR, T-Pot DMZ, Suricata/Snort IDS, Sysmon, Atomic Red Team, Cuckoo/CAPEv2 și Volatility.',

    topologyTag: 'TOPOLOGIE DE REȚEA',
    topologyTitle: 'Vizualizare Spațială 3D a Rețelei',
    topologyDesc: 'Apasă pe noduri pentru inspectarea specificațiilor tehnice, relațiilor de rețea și manifestelor de configurare.',
    btnRotate: 'Rotire',
    btnReset: 'Resetare',
    btnLogical: 'Logic',
    btnPhysical: 'Fizic',
    meshActive: 'REȚEA ACTIVĂ',
    nodesLabel: 'NODURI',
    flowsLabel: 'CONEXIUNI',
    interactionHint: 'TRAGE PENTRU ROTIRE · SCROLL PENTRU ZOOM · CLICK PENTRU DETALII',
    catAll: 'Toate Straturile',
    catCompute: 'Compute & Hypervisori',
    catNetwork: 'Rețea & Ingress',
    catSecurity: 'Securitate & Cyber',
    catServices: 'Servicii Core',
    catElo: 'Control Plane AI',
    catStorage: 'Stocare & ZFS',
    catEdge: 'Senzori Edge',

    hwTag: 'HARDWARE FIZIC',
    hwTitle: 'Flota Hardware (4 Noduri de Calcul)',
    hwDesc: 'Infrastructură multi-arhitectură bare-metal: virtualizare Intel Core i3 x86_64, nod ARM64 Apple M1 UTM, NAS ZFS ASUS Celeron și worker Kubernetes AMD Athlon II.',
    hwCpu: 'Procesor (CPU)',
    hwOs: 'Sistem de Operare',
    hwRam: 'Capacitate RAM',
    hwStorage: 'Pool Stocare',
    hwGpu: 'Placă Video / Accelerator',
    hwPsu: 'Sursă Alimentare (PSU)',
    hwHostedWorkloads: 'Workload-uri Virtuale Găzduite pe acest Nod',
    btnLocate3D: 'LOCALIZEAZĂ ÎN 3D',

    srvTag: 'CATALOG SERVICII',
    srvTitle: 'Servicii & Workload-uri Active (76)',
    srvDesc: '76 de servicii containerizate LXC și mașini virtuale QEMU/KVM împărțite pe nodurile x86_64 (42) și ARM64 (34).',
    srvSearchPlaceholder: 'Caută serviciu, port, gazdă, categorie...',
    srvRamCeiling: 'Plafon RAM',
    srvStoragePool: 'Pool Stocare',
    btnLocateInMesh: 'LOCALIZEAZĂ ÎN 3D',
    srvCatAll: 'Toate Serviciile',
    srvCatCore: 'Infrastructură Core',
    srvCatStorage: 'Stocare & Sync',
    srvCatMedia: 'Media Streaming',
    srvCatMonitoring: 'Observabilitate',
    srvCatSecurity: 'Securitate & SSO',
    srvCatAutomation: 'Automatizare & IoT',
    srvCatCyber: 'Cyber & DFIR',
    srvCatAi: 'AI & Ollama LLM',

    bpTag: 'BLUEPRINT TEHNIC',
    bpTitle: 'Arhitectura și Blueprint-ul Tehnic',
    bpDesc: 'Specificații pentru izolarea VLAN, suita de securitate cibernetică, honeypots T-Pot, digital forensics (DFIR), stocare ZFS și telemetrie UPS.',
    tabVlan: 'Matrice Segmentare VLAN',
    tabCyber: 'Securitate Cibernetică & Honeypots',
    tabMemory: 'Bugete Alocare RAM',
    tabAi: 'Cascadă Rutare AI (ELO & Ollama)',
    tabDevSecOps: 'DevSecOps & Imutabilitate',

    inspectorSpec: 'SPECIFICAȚIE',
    inspectorCascade: 'RELAȚII',
    inspectorManifest: 'MANIFEST',
    inspectorRole: 'ROL TEHNIC',
    inspectorHostAllocation: 'GAZDĂ & RESURSE',
    inspectorComputeHost: 'Gazdă Compute',
    inspectorTierLevel: 'Nivel Strat',
    inspectorNetworkConfig: 'Configurație Rețea',
    inspectorIp: 'Adresă IP',
    inspectorPort: 'Port Expus',
    inspectorSubsystem: 'Subsistem',
    inspectorRelationshipChain: 'Lanț de Conexiuni',
    inspectorConnectedNodes: 'Noduri Conectate',
    inspectorCopySpec: 'COPIAZĂ SPEC',
    inspectorCopied: 'COPIAT!',

    footerSub: '— Proxmox VE · Windows Server AD · WireGuard · Wazuh XDR · DFIR · Ollama LLM',
    footerTop: 'SUS ↑',
    footerGithub: 'REPO GITHUB'
  },
  en: {
    navOverview: 'Overview',
    navTopology: '3D Topology',
    navServices: 'Services (76)',
    navHardware: 'Hardware Fleet',
    navBlueprint: 'Architecture & Cyber',
    statusClusterActive: '4 nodes online',
    sublabelTag: 'Infrastructure & Services',

    heroTag: 'SYSTEM ARCHITECTURE & OVERVIEW',
    heroTitle: 'A heterogeneous bare-metal compute cluster, private cloud, and security testing lab.',
    heroDescription: 'Technical documentation and interactive overview of the homelab infrastructure: Proxmox VE virtualization across Apple Silicon ARM64 and Intel x86_64, Windows Server Active Directory, ZFS storage, OPNsense firewall segmentation, local GPU LLMs, and automation.',
    
    metricComputeTitle: 'PHYSICAL COMPUTE',
    metricComputeCount: '4 Nodes',
    metricComputeDesc: 'Intel i3-10100F (GTX 1050 Ti), Apple M1 Silicon, ASUS Celeron OMV NAS, and AMD Athlon II k3s.',
    
    metricVirtTitle: 'VIRTUALIZATION',
    metricVirtCount: '2 Hypervisors',
    metricVirtDesc: 'Proxmox VE x86_64 (42 workloads) & ARM64 (34 workloads) hosting OPNsense, Windows AD, RHEL, BSD, and LXC containers.',
    
    metricServicesTitle: 'ACTIVE SERVICES',
    metricServicesCount: '76 Workloads',
    metricServicesDesc: '71 optimized LXC containers + 5 QEMU/KVM virtual machines across x86_64 and ARM64 hypervisors.',
    
    metricCyberTitle: 'SECURITY & DFIR',
    metricCyberCount: 'SOC & Honeynet',
    metricCyberDesc: 'Wazuh SIEM/XDR, T-Pot DMZ, Suricata/Snort IDS, Sysmon, Atomic Red Team, Cuckoo/CAPEv2, and Volatility.',

    topologyTag: 'NETWORK TOPOLOGY',
    topologyTitle: '3D Network Topology',
    topologyDesc: 'Click on nodes to inspect technical specifications, network relations, and configuration manifests.',
    btnRotate: 'Rotate',
    btnReset: 'Reset',
    btnLogical: 'Logical',
    btnPhysical: 'Physical',
    meshActive: 'NETWORK ONLINE',
    nodesLabel: 'NODES',
    flowsLabel: 'CONNECTIONS',
    interactionHint: 'DRAG TO ROTATE · SCROLL TO ZOOM · CLICK FOR DETAILS',
    catAll: 'All Layers',
    catCompute: 'Compute & Hypervisors',
    catNetwork: 'Network & Ingress',
    catSecurity: 'Security & Cyber',
    catServices: 'Core Services',
    catElo: 'AI Control Plane',
    catStorage: 'Storage & ZFS',
    catEdge: 'Edge Sensors',

    hwTag: 'PHYSICAL HARDWARE',
    hwTitle: 'Hardware Fleet (4 Compute Nodes)',
    hwDesc: 'Multi-architecture bare-metal infrastructure: Intel Core i3 x86_64 virtualization, Apple M1 ARM64 UTM node, ASUS Celeron ZFS NAS, and AMD Athlon II Kubernetes worker.',
    hwCpu: 'Processor (CPU)',
    hwOs: 'Operating System',
    hwRam: 'RAM Capacity',
    hwStorage: 'Storage Pool',
    hwGpu: 'GPU / ML Accelerator',
    hwPsu: 'Power Supply (PSU)',
    hwHostedWorkloads: 'Hosted Virtual Workloads on this Node',
    btnLocate3D: 'LOCATE IN 3D',

    srvTag: 'SERVICES CATALOG',
    srvTitle: 'Active Services & Workloads (76)',
    srvDesc: '76 containerized LXC services and QEMU/KVM virtual machines distributed across x86_64 (42) and ARM64 (34) nodes.',
    srvSearchPlaceholder: 'Search service, port, host, category...',
    srvRamCeiling: 'RAM Ceiling',
    srvStoragePool: 'Storage Pool',
    btnLocateInMesh: 'LOCATE IN 3D',
    srvCatAll: 'All Services',
    srvCatCore: 'Core Infrastructure',
    srvCatStorage: 'Storage & Sync',
    srvCatMedia: 'Media Streaming',
    srvCatMonitoring: 'Observability',
    srvCatSecurity: 'Security & SSO',
    srvCatAutomation: 'Automation & IoT',
    srvCatCyber: 'Cyber & DFIR',
    srvCatAi: 'AI & Ollama LLM',

    bpTag: 'TECHNICAL BLUEPRINT',
    bpTitle: 'System Architecture & Blueprint',
    bpDesc: 'Technical specifications for VLAN isolation, cybersecurity tooling, T-Pot honeypots, digital forensics (DFIR), ZFS storage, and UPS telemetry.',
    tabVlan: 'VLAN Segmentation Matrix',
    tabCyber: 'Cybersecurity & Honeypots',
    tabMemory: 'RAM Allocation Budgets',
    tabAi: 'AI Routing Cascade (ELO & Ollama)',
    tabDevSecOps: 'DevSecOps & Immutability',

    inspectorSpec: 'SPECIFICATION',
    inspectorCascade: 'RELATIONSHIPS',
    inspectorManifest: 'MANIFEST',
    inspectorRole: 'TECHNICAL ROLE',
    inspectorHostAllocation: 'HOST & CAPACITY',
    inspectorComputeHost: 'Compute Host',
    inspectorTierLevel: 'Layer Tier',
    inspectorNetworkConfig: 'Network Configuration',
    inspectorIp: 'IP Address',
    inspectorPort: 'Exposed Port',
    inspectorSubsystem: 'Subsystem',
    inspectorRelationshipChain: 'Connection Chain',
    inspectorConnectedNodes: 'Connected Nodes',
    inspectorCopySpec: 'COPY SPEC',
    inspectorCopied: 'COPIED!',

    footerSub: '— Proxmox VE · Windows Server AD · WireGuard · Wazuh XDR · DFIR · Ollama LLM',
    footerTop: 'TOP ↑',
    footerGithub: 'GITHUB REPO'
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang = signal<Language>('ro');

  get isRomanian(): boolean {
    return this.currentLang() === 'ro';
  }

  constructor() {
    const saved = localStorage.getItem('homelab_lang') as Language;
    if (saved === 'ro' || saved === 'en') {
      this.currentLang.set(saved);
    }
  }

  get t(): Translations {
    return TRANSLATIONS[this.currentLang()];
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    localStorage.setItem('homelab_lang', lang);
  }
}
