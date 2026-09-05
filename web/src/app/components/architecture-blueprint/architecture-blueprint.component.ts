import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';

export interface ForensicCase {
  id: string;
  caseId: string;
  title: string;
  badge: string;
  classification: string;
  date: string;
  author: string;
  status: string;
  summary: string;
  attackVector: string;
  reverseFindings: string[];
  financialFlow: string;
  iocs: { type: string; value: string }[];
  datacenterDefense: string;
  repoPath: string;
  githubUrl: string;
  mitreAttack: string[];
}

@Component({
  selector: 'app-architecture-blueprint',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="blueprint" class="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      
      <!-- Section Header -->
      <div class="space-y-2 mb-8">
        <div class="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">
          {{ ts.t.bpTag }}
        </div>
        <h2 class="text-3xl sm:text-4xl font-serif font-normal text-slate-50 tracking-tight">
          {{ ts.t.bpTitle }}
        </h2>
        <p class="text-sm text-slate-300 max-w-3xl font-sans font-normal leading-relaxed">
          {{ ts.t.bpDesc }}
        </p>
      </div>

      <!-- Interactive Blueprint Tabs -->
      <div class="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2 font-sans">
        <button
          (click)="activeTab = 'cloud'"
          [class.bg-obsidian-750]="activeTab === 'cloud'"
          [class.text-slate-950]="activeTab === 'cloud'"
          [class.font-bold]="activeTab === 'cloud'"
          [class.text-slate-300]="activeTab !== 'cloud'"
          [class.bg-obsidian-900]="activeTab !== 'cloud'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Multi-Cloud Hibrid & CI/CD (9 Fluxuri)' : 'Hybrid Multi-Cloud & CI/CD (9 Workflows)' }}
        </button>
        <button
          (click)="activeTab = 'vlan'"
          [class.bg-obsidian-750]="activeTab === 'vlan'"
          [class.text-slate-950]="activeTab === 'vlan'"
          [class.font-bold]="activeTab === 'vlan'"
          [class.text-slate-300]="activeTab !== 'vlan'"
          [class.bg-obsidian-900]="activeTab !== 'vlan'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Matrice VLAN & Firewall' : 'VLAN & Firewall Matrix' }}
        </button>
        <button
          (click)="activeTab = 'power'"
          [class.bg-obsidian-750]="activeTab === 'power'"
          [class.text-slate-950]="activeTab === 'power'"
          [class.font-bold]="activeTab === 'power'"
          [class.text-slate-300]="activeTab !== 'power'"
          [class.bg-obsidian-900]="activeTab !== 'power'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'UPS & Telemetrie Energie' : 'UPS & Power Telemetry' }}
        </button>
        <button
          (click)="activeTab = 'storage'"
          [class.bg-obsidian-750]="activeTab === 'storage'"
          [class.text-slate-950]="activeTab === 'storage'"
          [class.font-bold]="activeTab === 'storage'"
          [class.text-slate-300]="activeTab !== 'storage'"
          [class.bg-obsidian-900]="activeTab !== 'storage'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Stocare ZFS & Pool-uri' : 'ZFS Storage Pools' }}
        </button>
        <button
          (click)="activeTab = 'cyber'"
          [class.bg-obsidian-750]="activeTab === 'cyber'"
          [class.text-slate-950]="activeTab === 'cyber'"
          [class.font-bold]="activeTab === 'cyber'"
          [class.text-slate-300]="activeTab !== 'cyber'"
          [class.bg-obsidian-900]="activeTab !== 'cyber'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.t.tabCyber }}
        </button>
        <button
          (click)="activeTab = 'zerotrust'"
          [class.bg-obsidian-750]="activeTab === 'zerotrust'"
          [class.text-slate-950]="activeTab === 'zerotrust'"
          [class.font-bold]="activeTab === 'zerotrust'"
          [class.text-slate-300]="activeTab !== 'zerotrust'"
          [class.bg-obsidian-900]="activeTab !== 'zerotrust'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Laborator Zero-Trust & GitOps' : 'Zero-Trust & GitOps Proving Ground' }}
        </button>
        <button
          (click)="activeTab = 'generator'"
          [class.bg-obsidian-750]="activeTab === 'generator'"
          [class.text-slate-950]="activeTab === 'generator'"
          [class.font-bold]="activeTab === 'generator'"
          [class.text-slate-300]="activeTab !== 'generator'"
          [class.bg-obsidian-900]="activeTab !== 'generator'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Generator IaC & Runbooks' : 'IaC Generator & Runbooks' }}
        </button>
        <button
          (click)="activeTab = 'chaos'"
          [class.bg-obsidian-750]="activeTab === 'chaos'"
          [class.text-slate-950]="activeTab === 'chaos'"
          [class.font-bold]="activeTab === 'chaos'"
          [class.text-slate-300]="activeTab !== 'chaos'"
          [class.bg-obsidian-900]="activeTab !== 'chaos'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Ingineria Haosului & Reziliență' : 'Chaos & Resiliency' }}
        </button>
        <button
          (click)="activeTab = 'observability'"
          [class.bg-obsidian-750]="activeTab === 'observability'"
          [class.text-slate-950]="activeTab === 'observability'"
          [class.font-bold]="activeTab === 'observability'"
          [class.text-slate-300]="activeTab !== 'observability'"
          [class.bg-obsidian-900]="activeTab !== 'observability'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Observabilitate LGTM & SLO' : 'LGTM & SLO Metrics' }}
        </button>
        <button
          (click)="activeTab = 'glossary'"
          [class.bg-obsidian-750]="activeTab === 'glossary'"
          [class.text-slate-950]="activeTab === 'glossary'"
          [class.font-bold]="activeTab === 'glossary'"
          [class.text-slate-300]="activeTab !== 'glossary'"
          [class.bg-obsidian-900]="activeTab !== 'glossary'"
          class="px-3.5 py-2 rounded-xl text-xs font-medium border border-obsidian-750 transition-all whitespace-nowrap"
        >
          {{ ts.isRomanian ? 'Glosar Tehnic' : 'Technical Glossary' }}
        </button>
      </div>

      <!-- TAB: MULTI-CLOUD & CI/CD QUALITY MATRIX -->
      @if (activeTab === 'cloud') {
        <div class="space-y-8">
          
          <!-- Cloud Providers Grid -->
          <div class="space-y-3">
            <h3 class="text-base font-sans font-bold text-slate-100 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-slate-400"></span>
              {{ ts.isRomanian ? 'Infrastructură Multi-Cloud Hibridă (Terraform Declarativ)' : 'Hybrid Multi-Cloud Infrastructure (Declarative Terraform)' }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <!-- Azure -->
              <div class="p-5 rounded-2xl bg-obsidian-850/90 border border-obsidian-750 space-y-3 hover:border-blue-500/50 transition-colors">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono font-bold text-blue-400">MICROSOFT AZURE</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/60 text-blue-300 border border-blue-800">Archive Tier / HSM</span>
                </div>
                <div class="text-sm font-semibold text-slate-100">
                  {{ ts.isRomanian ? 'Key Vault HSM & Recuperare în Caz de Dezastru' : 'Key Vault HSM & Disaster Recovery' }}
                </div>
                <ul class="text-xs text-slate-300 space-y-1.5 font-sans">
                  <li>• <strong>Azure Key Vault</strong>: {{ ts.isRomanian ? 'Cloud HSM backup pentru Step-CA Root CA & chei LUKS Tang/Clevis.' : 'Cloud HSM backup for Step-CA Root CA & LUKS Tang/Clevis escrow keys.' }}</li>
                  <li>• <strong>Blob Storage Archive Tier</strong>: {{ ts.isRomanian ? 'Snapshot-uri ZFS criptate cu cost aproape de zero.' : 'Encrypted ZFS snapshots at near-zero cold storage cost.' }}</li>
                  <li>• <strong>Entra ID Application</strong>: {{ ts.isRomanian ? 'SAML/OIDC federat cu Authentik pentru SSO Enterprise.' : 'SAML/OIDC federated with Authentik for enterprise SSO.' }}</li>
                  <li>• <strong>Azure Arc</strong>: {{ ts.isRomanian ? 'Onboarding nod fizic în Microsoft Defender for Cloud.' : 'Onboarding physical compute into Microsoft Defender for Cloud.' }}</li>
                </ul>
              </div>

              <!-- GCP -->
              <div class="p-5 rounded-2xl bg-obsidian-850/90 border border-obsidian-750 space-y-3 hover:border-obsidian-600 transition-colors">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono font-bold text-slate-300">GOOGLE CLOUD (GCP)</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-obsidian-850 text-slate-300 border border-obsidian-700">WORM / OIDC Keyless</span>
                </div>
                <div class="text-sm font-semibold text-slate-100">
                  {{ ts.isRomanian ? 'Stocare WORM & Workload Identity' : 'WORM Storage & Workload Identity' }}
                </div>
                <ul class="text-xs text-slate-300 space-y-1.5 font-sans">
                  <li>• <strong>GCS Object Locking (WORM)</strong>: {{ ts.isRomanian ? 'Backup imutabil anti-ransomware pentru PBS și Restic.' : 'Immutable ransomware-proof storage lock for PBS & Restic.' }}</li>
                  <li>• <strong>Workload Identity Federation</strong>: {{ ts.isRomanian ? 'CI/CD keyless fără fișiere credentials.json statice.' : 'Keyless CI/CD without static credentials.json keys.' }}</li>
                  <li>• <strong>Cloud DNS Managed Zone</strong>: {{ ts.isRomanian ? 'Fallback extern split-horizon cu suport DNSSEC.' : 'External split-horizon fallback with DNSSEC validation.' }}</li>
                  <li>• <strong>BigQuery Security Sink</strong>: {{ ts.isRomanian ? 'Export telemetrie honeypots T-Pot & Wazuh SIEM.' : 'Security telemetry export from T-Pot honeypots & Wazuh SIEM.' }}</li>
                </ul>
              </div>

              <!-- AWS -->
              <div class="p-5 rounded-2xl bg-obsidian-850/90 border border-obsidian-750 space-y-3 hover:border-amber-500/50 transition-colors">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono font-bold text-amber-400">AMAZON WEB SERVICES</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 text-amber-300 border border-amber-800">Glacier Deep Archive</span>
                </div>
                <div class="text-sm font-semibold text-slate-100">
                  {{ ts.isRomanian ? 'Stocare la Rece & IAM AssumeRole' : 'Cold Storage & IAM AssumeRole' }}
                </div>
                <ul class="text-xs text-slate-300 space-y-1.5 font-sans">
                  <li>• <strong>S3 Glacier Deep Archive</strong>: {{ ts.isRomanian ? 'Retenție 365 zile pentru arhive reci criptate.' : '365-day cold compliance retention for encrypted archives.' }}</li>
                  <li>• <strong>Object Lock Compliance</strong>: {{ ts.isRomanian ? 'Blocare strictă la ștergere pe perioada de retenție.' : 'Strict non-deletable retention lock during disaster recovery cycle.' }}</li>
                  <li>• <strong>IAM OIDC Provider</strong>: {{ ts.isRomanian ? 'Autentificare GitHub Actions cu roluri least-privilege.' : 'GitHub Actions least-privilege assume-role authentication.' }}</li>
                  <li>• <strong>Site-to-Site VPN Gateway</strong>: {{ ts.isRomanian ? 'Conexiune IPsec dedicată cu firewall-ul OPNsense.' : 'Dedicated IPsec encrypted tunnel connected to OPNsense.' }}</li>
                </ul>
              </div>

            </div>
          </div>

          <!-- CI/CD Workflows Table -->
          <div class="space-y-3">
            <h3 class="text-base font-sans font-bold text-slate-100 flex items-center justify-between">
              <span class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                {{ ts.isRomanian ? 'Matrice CI/CD Enterprise (9 Fluxuri Automate · 36+ Verificări Paralele)' : 'Enterprise CI/CD Matrix (9 Automated Workflows · 36+ Parallel Checks)' }}
              </span>
              <span class="text-xs font-mono text-slate-300">GitHub Actions CI/CD</span>
            </h3>
            
            <div class="rounded-2xl bg-obsidian-850/90 border border-obsidian-750 shadow-xl overflow-hidden font-mono text-xs">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-obsidian-750 bg-obsidian-900 text-slate-300 text-[11px] uppercase tracking-wider">
                      <th class="p-4">{{ ts.isRomanian ? 'Flux GitHub Actions' : 'GitHub Actions Workflow' }}</th>
                      <th class="p-4">{{ ts.isRomanian ? 'Tip Pipeline' : 'Pipeline Type' }}</th>
                      <th class="p-4">{{ ts.isRomanian ? 'Garanții de Calitate & Verificări' : 'Quality Guarantees & Verification' }}</th>
                      <th class="p-4">{{ ts.isRomanian ? 'Frecvență / Declanșator' : 'Frequency / Trigger' }}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-obsidian-750/70">
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-slate-300 whitespace-nowrap">homelab-ci-cd-matrix.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Matrice Calitate' : 'Quality Matrix' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Terraform Fmt & Validate, Checkov IaC, Trivy, Docker Compose, ShellCheck, Secret Leakage, ELO Matrix (3.9-3.13)' : 'Terraform Fmt & Validate, Checkov IaC, Trivy, Docker Compose, ShellCheck, Secret Leakage, ELO Matrix (3.9-3.13)' }}</td>
                      <td class="p-4 text-slate-400">Push / PR / Dispatch</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-slate-300 whitespace-nowrap">ci.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Pipeline CI Central' : 'Core CI Pipeline' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Gitleaks & TruffleHog Secrets, Ruff Lint, MyPy Types, Bandit SAST, Semgrep, Sintaxă Ansible, Kubeconform' : 'Gitleaks & TruffleHog Secrets, Ruff Lint, MyPy Types, Bandit SAST, Semgrep, Ansible Syntax, Kubeconform' }}</td>
                      <td class="p-4 text-slate-400">Push / PR</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-slate-300 whitespace-nowrap">cd.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Livrare Continuă' : 'Continuous Deploy' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Sincronizare GitOps, Împachetare Imagini Container (GHCR), Verificare Rollback' : 'GitOps Synchronization, Container Image Packaging (GHCR), Rollback Verification' }}</td>
                      <td class="p-4 text-slate-400">Push to main</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-slate-300 whitespace-nowrap">container-scan.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Securitate / CVE' : 'Security / CVE' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Scanare Vulnerabilități Imagini Containere Trivy & Conformitate CIS Dockle' : 'Trivy & Dockle Container Image Vulnerability & CIS Benchmark Scanning' }}</td>
                      <td class="p-4 text-slate-400">Push / Scheduled</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-slate-300 whitespace-nowrap">security-scan.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Securitate SAST' : 'SAST Security' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Motor GitHub CodeQL, Analiză Statică Avansată a Vulnerabilităților (Python & TypeScript)' : 'GitHub CodeQL Engine, Advanced Security Static Analysis (Python & TypeScript)' }}</td>
                      <td class="p-4 text-slate-400">Weekly / Push</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-slate-300 whitespace-nowrap">security-scheduled.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Audit Nocturn' : 'Nightly Audit' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Audit Programat Nocturn pentru Dependențe (Pip-Audit, NPM Audit, Trivy FS)' : 'Nightly Dependency Vulnerability Audits (Pip-Audit, NPM Audit, Trivy FS)' }}</td>
                      <td class="p-4 text-slate-400">Cron (02:00 UTC)</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-slate-300 whitespace-nowrap">deploy-pages.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'CD Pagini Statice' : 'Static Pages CD' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Build Producție Angular 19 & Publicare Zero-Downtime pe GitHub Pages' : 'Angular 19 Production Build & GitHub Pages Zero-Downtime Deployment' }}</td>
                      <td class="p-4 text-slate-400">Push to main</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-slate-300 whitespace-nowrap">desktop-macos-release.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Lansare Binare' : 'Binary Release' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Compilare Universală C# .NET 10 macOS, Semnare Binară & Împachetare DMG' : 'C# .NET 10 Native macOS Universal App Compilation, Signing & DMG Packaging' }}</td>
                      <td class="p-4 text-slate-400">Tag / Release</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-slate-300 whitespace-nowrap">readme-sync.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Automatizare Documentație' : 'Docs Automation' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Sincronizare Automată a Documentației și Verificare Badge-uri în 5 Limbi' : 'Multilingual Documentation Sync & Badge Verification across 5 Languages' }}</td>
                      <td class="p-4 text-slate-400">Push to main</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      }

      <!-- TAB 1: VLAN MATRIX -->
      @if (activeTab === 'vlan') {
        <div class="space-y-6">
          <div class="rounded-2xl bg-obsidian-850/90 border border-obsidian-750 shadow-xl overflow-hidden font-mono text-xs">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-obsidian-750 bg-obsidian-900 text-slate-300 text-[11px] uppercase tracking-wider">
                    <th class="p-4">VLAN ID</th>
                    <th class="p-4">{{ ts.isRomanian ? 'Segment Rețea' : 'Network Segment' }}</th>
                    <th class="p-4">Subnet CIDR</th>
                    <th class="p-4">Gateway</th>
                    <th class="p-4">{{ ts.isRomanian ? 'Sarcini de Lucru Ataşate' : 'Attached Workloads' }}</th>
                    <th class="p-4">{{ ts.isRomanian ? 'Politica de Securitate' : 'Security Policy' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-obsidian-750/70">
                  @for (vlan of (ts.isRomanian ? vlanMatrixRo : vlanMatrixEn); track vlan.id) {
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-slate-300 whitespace-nowrap">{{ vlan.id }}</td>
                      <td class="p-4 font-medium text-slate-100">{{ vlan.name }}</td>
                      <td class="p-4 text-slate-300 whitespace-nowrap">{{ vlan.subnet }}</td>
                      <td class="p-4 text-slate-300 whitespace-nowrap">{{ vlan.gateway }}</td>
                      <td class="p-4 text-slate-200">{{ vlan.nodes }}</td>
                      <td class="p-4 text-slate-400">{{ vlan.firewallPolicy }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- TAB 2: POWER & UPS TELEMETRY -->
      @if (activeTab === 'power') {
        <div class="space-y-6">
          <!-- Live Telemetry KPI Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-lg space-y-2">
              <div class="text-[10px] text-slate-400 uppercase">{{ ts.isRomanian ? 'Tensiune de Intrare' : 'Input Voltage' }}</div>
              <div class="text-2xl font-bold text-slate-300">231.4 V AC</div>
              <div class="text-[11px] text-slate-300">{{ ts.isRomanian ? 'Undă Sinusoidală Pură 50.0 Hz' : 'Pure Sine Wave 50.0 Hz' }}</div>
            </div>
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-lg space-y-2">
              <div class="text-[10px] text-slate-400 uppercase">{{ ts.isRomanian ? 'Încărcare Baterie' : 'Battery Charge' }}</div>
              <div class="text-2xl font-bold text-slate-300">100% (13.7V)</div>
              <div class="text-[11px] text-slate-300">{{ ts.isRomanian ? 'Baterie 100Ah Deep-Cycle AGM' : '100Ah Deep-Cycle AGM' }}</div>
            </div>
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-lg space-y-2">
              <div class="text-[10px] text-slate-400 uppercase">{{ ts.isRomanian ? 'Autonomie Estimată' : 'Estimated Autonomy' }}</div>
              <div class="text-2xl font-bold text-slate-300">~245 Mins</div>
              <div class="text-[11px] text-slate-300">{{ ts.isRomanian ? 'Consum Activ: 84 Watts' : 'Active Load: 84 Watts' }}</div>
            </div>
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-lg space-y-2">
              <div class="text-[10px] text-slate-400 uppercase">{{ ts.isRomanian ? 'Eficiență Energetică (PUE)' : 'Efficiency PUE' }}</div>
              <div class="text-2xl font-bold text-slate-300">1.14 PUE</div>
              <div class="text-[11px] text-slate-300">{{ ts.isRomanian ? 'Consum Redus Sub 100W' : 'Sub-100W Baseline Cluster' }}</div>
            </div>
          </div>

          <!-- NUT Graceful Shutdown Sequence -->
          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <h3 class="font-sans font-bold text-slate-50 text-base">
              {{ ts.isRomanian ? 'Oprire Secvențială Controlată prin Network UPS Tools (NUT)' : 'Network UPS Tools (NUT) Graceful Sequential Shutdown' }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
              <div class="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <span class="text-slate-300 font-bold">{{ ts.isRomanian ? 'Pasul 1: Non-Critic' : 'Step 1: Non-Critical' }}</span>
                <p class="text-slate-300 text-[11px] font-sans">{{ ts.isRomanian ? 'Oprire Media (Jellyfin CT 109) & Nextcloud' : 'Stop Media (Jellyfin CT 109) & Nextcloud' }}</p>
              </div>
              <div class="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <span class="text-slate-300 font-bold">{{ ts.isRomanian ? 'Pasul 2: Baze de Date' : 'Step 2: Databases' }}</span>
                <p class="text-slate-300 text-[11px] font-sans">{{ ts.isRomanian ? 'Flush & Oprire PostgreSQL & Pool OMV NFS' : 'Flush & Stop PostgreSQL & OMV NFS Pool' }}</p>
              </div>
              <div class="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <span class="text-slate-300 font-bold">{{ ts.isRomanian ? 'Pasul 3: VM-uri Core' : 'Step 3: Core VMs' }}</span>
                <p class="text-slate-300 text-[11px] font-sans">{{ ts.isRomanian ? 'Oprire Controlată Windows Server 2025 Datacenter & OPNsense' : 'Gracefully stop Windows Server 2025 Datacenter & OPNsense' }}</p>
              </div>
              <div class="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <span class="text-slate-300 font-bold">{{ ts.isRomanian ? 'Pasul 4: Oprire Gazdă' : 'Step 4: Host Poweroff' }}</span>
                <p class="text-slate-300 text-[11px] font-sans">{{ ts.isRomanian ? 'Proxmox VE execută poweroff curat' : 'Proxmox VE executes poweroff cleanly' }}</p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 3: ZFS STORAGE -->
      @if (activeTab === 'storage') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <div class="flex items-center justify-between border-b border-obsidian-750 pb-3">
              <h3 class="font-bold text-sm text-slate-50">{{ ts.isRomanian ? 'rpool (SSD NVMe Local)' : 'rpool (Local NVMe SSD)' }}</h3>
              <span class="px-2 py-0.5 rounded bg-slate-400/15 text-slate-300 text-[10px] font-bold">ONLINE · 512GB</span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-slate-300">
                <span>{{ ts.isRomanian ? 'Rată Compresie ZSTD:' : 'ZSTD Compression Ratio:' }}</span>
                <span class="font-bold text-slate-300">1.84x</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>{{ ts.isRomanian ? 'Rată Succes Cache ARC:' : 'ARC Cache Hit Rate:' }}</span>
                <span class="font-bold text-slate-300">98.6%</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>{{ ts.isRomanian ? 'Aliniere Bloc Baze de Date:' : 'Database Block Alignment:' }}</span>
                <span class="font-bold text-slate-100">recordsize=16k</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>{{ ts.isRomanian ? 'Sănătate SSD (Speranță Viață TBW):' : 'SSD Health (TBW Life Expectancy):' }}</span>
                <span class="font-bold text-slate-300">{{ ts.isRomanian ? '99.1% Rămas (Test S.M.A.R.T. Trecut)' : '99.1% Remaining (S.M.A.R.T. Passed)' }}</span>
              </div>
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <div class="flex items-center justify-between border-b border-obsidian-750 pb-3">
              <h3 class="font-bold text-sm text-slate-50">{{ ts.isRomanian ? 'datapool (Mirror ZFS OMV)' : 'datapool (OMV ZFS Mirror)' }}</h3>
              <span class="px-2 py-0.5 rounded bg-slate-400/15 text-slate-300 text-[10px] font-bold">ONLINE · 500GB</span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-slate-300">
                <span>{{ ts.isRomanian ? 'Rol Stocare:' : 'Storage Role:' }}</span>
                <span class="font-bold text-slate-100">{{ ts.isRomanian ? 'Partajare NFS/SMB + Backup-uri vzdump' : 'NFS/SMB Share + vzdump Backups' }}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>{{ ts.isRomanian ? 'Dimensiune Bloc Media:' : 'Media Block Size:' }}</span>
                <span class="font-bold text-slate-100">recordsize=1M (Jellyfin & Kiwix)</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>{{ ts.isRomanian ? 'Arhivă Offline:' : 'Offline Archive:' }}</span>
                <span class="font-bold text-slate-300">Kiwix Wikipedia ZIM (100% Offline)</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>{{ ts.isRomanian ? 'Programare Verificare ZFS Scrub:' : 'ZFS Scrub Scheduler:' }}</span>
                <span class="font-bold text-slate-200">{{ ts.isRomanian ? 'Prima duminică din lună (0 Erori)' : '1st Sunday of Month (0 Errors)' }}</span>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 4: CYBERLAB & FORENSICS -->
      @if (activeTab === 'cyber') {
        <div class="space-y-10">

          <!-- Section Header & Filter Sub-Bar -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                <span class="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase">
                  TLP:CLEAR · THREAT INTEL & DFIR SUITE
                </span>
              </div>
              <h3 class="text-xl font-bold text-slate-50">
                {{ ts.isRomanian ? 'Investigații Criminalistice Reale & Apărare Perimetrală' : 'Real-World Cyber Forensics & Dual-Tier Perimeter Defense' }}
              </h3>
              <p class="text-xs text-slate-300 max-w-2xl font-sans leading-relaxed">
                {{ ts.isRomanian ? '4 dosare complete de investigație criminalistică (reverse engineering C2, deconstrucție API fraudulos, SIP spoofing și atacuri BitM), corelate cu stiva de detecție din Datacenter.' : '4 exhaustive digital forensics investigations (C2 reverse engineering, fraudulent API deconstruction, SIP spoofing, and BitM attacks) correlated directly with the Datacenter detection stack.' }}
              </p>
            </div>

            <!-- Sub-Section Navigation -->
            <div class="flex items-center gap-1.5 p-1 bg-obsidian-900 rounded-xl border border-obsidian-750 font-mono text-[11px] self-start md:self-auto flex-wrap">
              <button
                (click)="cyberSubSection = 'all'"
                [class.bg-obsidian-750]="cyberSubSection === 'all'"
                [class.text-slate-950]="cyberSubSection === 'all'"
                [class.font-bold]="cyberSubSection === 'all'"
                [class.text-slate-300]="cyberSubSection !== 'all'"
                class="px-3 py-1.5 rounded-lg transition-all"
              >
                {{ ts.isRomanian ? 'Toate (Complet)' : 'All (Complete)' }}
              </button>
              <button
                (click)="cyberSubSection = 'cases'"
                [class.bg-obsidian-750]="cyberSubSection === 'cases'"
                [class.text-slate-950]="cyberSubSection === 'cases'"
                [class.font-bold]="cyberSubSection === 'cases'"
                [class.text-slate-300]="cyberSubSection !== 'cases'"
                class="px-3 py-1.5 rounded-lg transition-all"
              >
                {{ ts.isRomanian ? 'Dosare DFIR (4)' : 'DFIR Cases (4)' }}
              </button>
              <button
                (click)="cyberSubSection = 'perimeter'"
                [class.bg-obsidian-750]="cyberSubSection === 'perimeter'"
                [class.text-slate-950]="cyberSubSection === 'perimeter'"
                [class.font-bold]="cyberSubSection === 'perimeter'"
                [class.text-slate-300]="cyberSubSection !== 'perimeter'"
                class="px-3 py-1.5 rounded-lg transition-all"
              >
                {{ ts.isRomanian ? 'Dual-Tier Firewall' : 'Dual-Tier Firewall' }}
              </button>
              <button
                (click)="cyberSubSection = 'pillars'"
                [class.bg-obsidian-750]="cyberSubSection === 'pillars'"
                [class.text-slate-950]="cyberSubSection === 'pillars'"
                [class.font-bold]="cyberSubSection === 'pillars'"
                [class.text-slate-300]="cyberSubSection !== 'pillars'"
                class="px-3 py-1.5 rounded-lg transition-all"
              >
                {{ ts.isRomanian ? 'Piloni SOC (8)' : 'SOC Pillars (8)' }}
              </button>
            </div>
          </div>

          <!-- SUB-SECTION 1: THE 4 DIGITAL FORENSICS INVESTIGATIONS -->
          @if (cyberSubSection === 'all' || cyberSubSection === 'cases') {
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-base font-bold text-slate-100">
                    {{ ts.isRomanian ? '1. Cazuri de Criminalistică Digitală & Deconstrucție Amenințări' : '1. Digital Forensics & Threat Deconstruction Case Studies' }}
                  </h4>
                  <p class="text-xs text-slate-400">
                    {{ ts.isRomanian ? 'Selectează un dosar pentru a citi analiza tehnică completă, decompilarea API și regulile de detecție.' : 'Select any investigation to inspect full technical analysis, API decompilation, and detection signatures.' }}
                  </p>
                </div>
                <span class="text-[11px] font-mono text-slate-400">4 {{ ts.isRomanian ? 'Cazuri Finalizate' : 'Completed Cases' }}</span>
              </div>

              <!-- 4 Cases Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
                @for (c of (ts.isRomanian ? forensicCasesRo : forensicCasesEn); track c.id) {
                  <div
                    (click)="openCase(c)"
                    class="p-6 rounded-2xl bg-obsidian-850/95 border border-obsidian-750 hover:border-slate-500/50 shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:bg-obsidian-800"
                  >
                    <div class="space-y-4">
                      <!-- Top Metadata Badges -->
                      <div class="flex items-center justify-between gap-2 border-b border-obsidian-750 pb-3">
                        <div class="flex items-center gap-2">
                          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/60 uppercase">
                            {{ c.caseId }}
                          </span>
                          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-obsidian-800 text-slate-300 border border-obsidian-700 uppercase">
                            {{ c.classification }}
                          </span>
                        </div>
                        <span class="text-[10px] font-mono text-slate-400">{{ c.date }}</span>
                      </div>

                      <!-- Case Title & Badge -->
                      <div>
                        <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                          {{ c.badge }}
                        </div>
                        <h4 class="text-base font-bold text-slate-50 group-hover:text-slate-200 transition-colors leading-snug">
                          {{ c.title }}
                        </h4>
                      </div>

                      <!-- Summary Paragraph -->
                      <p class="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {{ c.summary }}
                      </p>

                      <!-- Key Technical Discovery Highlight -->
                      <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750/80 space-y-1">
                        <div class="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                          {{ ts.isRomanian ? 'Descoperire Tehnică Cheie' : 'Key Technical Discovery' }}
                        </div>
                        <div class="text-[11px] font-mono text-slate-300 truncate">
                          {{ c.reverseFindings[1] || c.reverseFindings[0] }}
                        </div>
                      </div>

                      <!-- MITRE ATT&CK Badges -->
                      <div class="flex flex-wrap gap-1 font-mono text-[10px]">
                        @for (m of c.mitreAttack; track m) {
                          <span class="px-2 py-0.5 rounded bg-obsidian-900/90 border border-obsidian-750 text-slate-400">
                            {{ m }}
                          </span>
                        }
                      </div>
                    </div>

                    <!-- Footer Action -->
                    <div class="mt-5 pt-3 border-t border-obsidian-750 flex items-center justify-between text-xs">
                      <span class="text-slate-400 text-[11px] font-mono">{{ c.status }}</span>
                      <span class="font-mono font-bold text-slate-300 group-hover:text-slate-100 flex items-center gap-1">
                        {{ ts.isRomanian ? 'Deschide Dosarul Criminalistic →' : 'Open Forensic Dossier →' }}
                      </span>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- SUB-SECTION 2: DUAL-TIER PERIMETER & SOC THREAT CORRELATION -->
          @if (cyberSubSection === 'all' || cyberSubSection === 'perimeter') {
            <div class="space-y-4">
              <div>
                <h4 class="text-base font-bold text-slate-100">
                  {{ ts.isRomanian ? '2. Arhitectură Perimetrală Dual-Tier & Corelare cu SOC-ul Datacenter' : '2. Dual-Tier Perimeter Architecture & Datacenter SOC Correlation' }}
                </h4>
                <p class="text-xs text-slate-400">
                  {{ ts.isRomanian ? 'Flux de filtrare defensivă în profunzime (Defense-in-Depth): de la perimetrul extern la rutare de tranzit BGP și detecție EDR/SIEM.' : 'Defense-in-depth traffic flow: from external frontline perimeter to BGP transit routing and EDR/SIEM detection.' }}
                </p>
              </div>

              <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-6">
                <!-- Visual Pipeline Flow Grid -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
                  
                  <!-- Tier 1: OPNsense -->
                  <div class="p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-2 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold text-slate-400 uppercase">TIER 1 · PERIMETRU EDGE</span>
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                      </div>
                      <h5 class="font-bold text-sm text-slate-100 mt-1">OPNsense Gateway</h5>
                      <div class="text-[10px] text-slate-400 font-sans mt-0.5">VM 200 · FreeBSD pf</div>
                      <p class="text-[11px] text-slate-300 font-sans mt-2 leading-relaxed">
                        {{ ts.isRomanian ? 'Filtrare stateful L3/L4, Suricata IDS/IPS activ, CrowdSec bouncer L7 și terminare tunel hibrid WireGuard (wg-cloud0).' : 'Stateful L3/L4 filtering, Suricata IDS/IPS, CrowdSec L7 bouncer, and hybrid WireGuard tunnel termination (wg-cloud0).' }}
                      </p>
                    </div>
                    <div class="mt-3 pt-2 border-t border-obsidian-750 text-[10px] text-slate-400">
                      IP: 192.168.1.134 / WAN 1.0/24
                    </div>
                  </div>

                  <!-- Transit Link: Bus L3 -->
                  <div class="p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-2 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold text-slate-400 uppercase">BUS DE TRANZIT L3</span>
                        <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                      </div>
                      <h5 class="font-bold text-sm text-slate-100 mt-1">vmbr2 Transit Subnet</h5>
                      <div class="text-[10px] text-slate-400 font-sans mt-0.5">10.10.20.0/30 · BGP / OSPF</div>
                      <p class="text-[11px] text-slate-300 font-sans mt-2 leading-relaxed">
                        {{ ts.isRomanian ? 'Interconectare dedicată punct-la-punct fără interferențe L2. Sesiune BGP între AS 64512 (OPNsense) și AS 64513 (FortiGate).' : 'Dedicated point-to-point interconnect without L2 broadcast noise. BGP peering between AS 64512 (OPNsense) and AS 64513 (FortiGate).' }}
                      </p>
                    </div>
                    <div class="mt-3 pt-2 border-t border-obsidian-750 text-[10px] text-slate-400">
                      Transit IP: 10.10.20.1 &lt;-&gt; 10.10.20.2
                    </div>
                  </div>

                  <!-- Tier 2: FortiGate-VM -->
                  <div class="p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-2 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold text-slate-400 uppercase">TIER 2 · ENTERPRISE NGFW</span>
                        <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                      </div>
                      <h5 class="font-bold text-sm text-slate-100 mt-1">Fortinet FortiGate-VM</h5>
                      <div class="text-[10px] text-slate-400 font-sans mt-0.5">VM 221 · FortiOS / Cisco ASAv</div>
                      <p class="text-[11px] text-slate-300 font-sans mt-2 leading-relaxed">
                        {{ ts.isRomanian ? 'Inspecție profundă SSL/TLS DPI, Application Control L7, scanare Antivirus de rețea și protecție specifică pentru fluxurile interne.' : 'SSL/TLS Deep Packet Inspection, L7 Application Control, inline Antivirus scanning, and internal east-west traffic policing.' }}
                      </p>
                    </div>
                    <div class="mt-3 pt-2 border-t border-obsidian-750 text-[10px] text-slate-400">
                      Politică Zero-Trust Inter-VLAN
                    </div>
                  </div>

                  <!-- SOC & Deception -->
                  <div class="p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-2 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold text-slate-400 uppercase">SOC & DECEPȚIE DMZ</span>
                        <span class="w-2 h-2 rounded-full bg-purple-400"></span>
                      </div>
                      <h5 class="font-bold text-sm text-slate-100 mt-1">Wazuh SIEM & T-Pot</h5>
                      <div class="text-[10px] text-slate-400 font-sans mt-0.5">CT 100 & VM 213 (VLAN 40)</div>
                      <p class="text-[11px] text-slate-300 font-sans mt-2 leading-relaxed">
                        {{ ts.isRomanian ? 'Cluster de capcane Cowrie SSH & Dionaea în DMZ izolat; corelare evenimente în Wazuh XDR și analiză dinamică pe REMnux (VM 218).' : 'Cowrie SSH & Dionaea deception cluster in isolated DMZ; event correlation via Wazuh XDR and dynamic triage on REMnux (VM 218).' }}
                      </p>
                    </div>
                    <div class="mt-3 pt-2 border-t border-obsidian-750 text-[10px] text-slate-400">
                      Wazuh Manager: 192.168.1.132:1514
                    </div>
                  </div>

                </div>

                <!-- Live Correlation Matrix with the 4 Forensics Investigations -->
                <div class="p-4 rounded-xl bg-obsidian-900/80 border border-obsidian-750 space-y-3">
                  <div class="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                    {{ ts.isRomanian ? 'Cum Alimentează Cele 4 Investigații Apărarea Datacenter-ului' : 'How the 4 Forensic Investigations Directly Feed Datacenter Defense' }}
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                    <div class="flex gap-2">
                      <span class="font-mono text-red-400 font-bold">1.</span>
                      <span class="text-slate-300">
                        <strong class="text-slate-100">Task Scam (USDT TRC-20):</strong>
                        {{ ts.isRomanian ? 'Regulile Suricata inspectează JSON-urile ce conțin chei de kill-switch; IP-urile de C2 sunt blocate automat pe OPNsense prin CrowdSec.' : 'Suricata rules inspect JSON bodies for kill-switch attributes; C2 IPs are blacklisted via CrowdSec on OPNsense.' }}
                      </span>
                    </div>
                    <div class="flex gap-2">
                      <span class="font-mono text-blue-400 font-bold">2.</span>
                      <span class="text-slate-300">
                        <strong class="text-slate-100">Revolut Vishing:</strong>
                        {{ ts.isRomanian ? 'Filtrare antete SIP nesecurizate pe Asterisk PBX și blocare directă la nivel DNS a domeniilor nou apărute (NRD &lt; 30 zile).' : 'Unauthenticated SIP header filtering on Asterisk PBX and automated DNS sinkholing of newly registered domains (NRD &lt; 30 days).' }}
                      </span>
                    </div>
                    <div class="flex gap-2">
                      <span class="font-mono text-amber-400 font-bold">3.</span>
                      <span class="text-slate-300">
                        <strong class="text-slate-100">TikTok MRR Pyramids:</strong>
                        {{ ts.isRomanian ? 'Crawler OSINT pe Proxmox pentru identificarea rutelor scurtate de phishing și scoring de reputație al portilor de plată.' : 'Proxmox-hosted OSINT crawler resolving short URL redirects and monitoring high-risk merchant gateway domains.' }}
                      </span>
                    </div>
                    <div class="flex gap-2">
                      <span class="font-mono text-purple-400 font-bold">4.</span>
                      <span class="text-slate-300">
                        <strong class="text-slate-100">Steam OpenID BitM:</strong>
                        {{ ts.isRomanian ? 'Detecție a structurilor sintetice de ferestre BitM în traficul HTTP și reguli de alertare Wazuh pentru crearea suspectă de chei Web API.' : 'Identification of synthetic BitM in-DOM frames via Suricata and Wazuh alerting on unusual Web API token provisions.' }}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          }

          <!-- SUB-SECTION 3: THE 8 SECURITY PILLARS -->
          @if (cyberSubSection === 'all' || cyberSubSection === 'pillars') {
            <div class="space-y-4">
              <div>
                <h4 class="text-base font-bold text-slate-100">
                  {{ ts.isRomanian ? '3. Cei 8 Piloni Tehnici ai Securității Datacenter (SOC & Defensivă)' : '3. The 8 Technical Cybersecurity & Defense Pillars (SOC & SecOps)' }}
                </h4>
                <p class="text-xs text-slate-400">
                  {{ ts.isRomanian ? 'Stive tehnologice de la virtualizare bare-metal și Active Directory până la analiză de pachete, SIEM și inginerie de detecție.' : 'Full technology stacks spanning bare-metal virtualization, Active Directory, packet inspection, SIEM, and detection engineering.' }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-xs">
                @for (pillar of (ts.isRomanian ? cyberPillarsRo : cyberPillarsEn); track pillar.title) {
                  <div class="p-6 rounded-2xl bg-obsidian-850/90 border border-obsidian-750 shadow-xl space-y-3.5 flex flex-col justify-between">
                    <div class="space-y-3">
                      <div class="flex items-center justify-between border-b border-obsidian-750 pb-3">
                        <h3 class="font-sans font-bold text-slate-50 text-base tracking-wide">
                          {{ pillar.title }}
                        </h3>
                        <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-obsidian-800 text-slate-300 border border-obsidian-700 uppercase">
                          {{ pillar.badge }}
                        </span>
                      </div>

                      <p class="text-xs text-slate-300 leading-relaxed font-sans font-normal">
                        {{ pillar.description }}
                      </p>

                      <div class="space-y-1.5 pt-1">
                        <div class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{{ ts.isRomanian ? 'Tehnologii & Unelte' : 'Technologies & Tooling' }}</div>
                        <div class="flex flex-wrap gap-1.5 font-mono text-[11px]">
                          @for (tool of pillar.tools; track tool) {
                            <span class="px-2 py-0.5 rounded bg-obsidian-900 border border-obsidian-750 text-slate-200">
                              {{ tool }}
                            </span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

        </div>
      }

      <!-- TAB: ZERO-TRUST & GITOPS PROVING GROUND -->
      @if (activeTab === 'zerotrust') {
        <div class="space-y-6 font-mono text-xs">
          
          <!-- Grid 1: Vault / OpenBao & WireGuard Key Rotation -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Vault / OpenBao Secret Automation -->
            <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
              <div class="flex items-center justify-between border-b border-obsidian-750 pb-3">
                <div>
                  <div class="text-[10px] text-slate-300 font-bold uppercase">{{ ts.isRomanian ? 'Pipeline Injectare Secrete' : 'Secret Injection Pipeline' }}</div>
                  <h3 class="font-bold text-sm text-slate-50 mt-0.5">HashiCorp Vault / OpenBao</h3>
                </div>
                <span class="px-2 py-0.5 rounded bg-slate-400/15 text-slate-300 text-[10px] font-bold">{{ ts.isRomanian ? 'FĂRĂ .ENV PE DISC' : 'ZERO .ENV ON DISK' }}</span>
              </div>
              <p class="text-slate-300 font-sans text-xs leading-relaxed">
                {{ ts.isRomanian 
                  ? 'Motor centralizat de secrete ce furnizează generare dinamică de token-uri și credențiale efemere pentru Terraform, Ansible și Woodpecker CI.' 
                  : 'Centralized secrets engine providing automated dynamic token generation and ephemeral credentials for Terraform, Ansible, and Woodpecker CI runners.' }}
              </p>
              <div class="space-y-2 text-[11px]">
                <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between text-slate-200">
                  <span>{{ ts.isRomanian ? 'Backend Secrete KV v2:' : 'KV v2 Secret Backend:' }}</span>
                  <span class="text-slate-300 font-bold">secret/data/homelab/*</span>
                </div>
                <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between text-slate-200">
                  <span>{{ ts.isRomanian ? 'Timp Viață Token DB (TTL):' : 'Dynamic DB Credential TTL:' }}</span>
                  <span class="text-slate-100 font-bold">{{ ts.isRomanian ? 'Lease 1 Oră (Auto-Revocare)' : '1 Hour Lease (Auto-Revoke)' }}</span>
                </div>
                <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between text-slate-200">
                  <span>{{ ts.isRomanian ? 'Criptare în Tranzit:' : 'Transit Encryption:' }}</span>
                  <span class="text-slate-300 font-bold">AES-256-GCM / Ed25519</span>
                </div>
              </div>
            </div>

            <!-- WireGuard Kernel Key Rotation -->
            <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
              <div class="flex items-center justify-between border-b border-obsidian-750 pb-3">
                <div>
                  <div class="text-[10px] text-slate-300 font-bold uppercase">{{ ts.isRomanian ? 'Rotație Criptografică Automată' : 'Automated Cryptographic Rotation' }}</div>
                  <h3 class="font-bold text-sm text-slate-50 mt-0.5">WireGuard Kernel Key Rotator</h3>
                </div>
                <span class="px-2 py-0.5 rounded bg-slate-400/15 text-slate-300 text-[10px] font-bold">{{ ts.isRomanian ? 'FĂRĂ ÎNTRERUPERE' : 'ZERO DOWNTIME' }}</span>
              </div>
              <p class="text-slate-300 font-sans text-xs leading-relaxed">
                {{ ts.isRomanian 
                  ? 'Rotație periodică automată a perechilor de chei Curve25519 și cheilor pre-partajate (PSK) direct în modulul kernel WireGuard din OPNsense.' 
                  : 'Automated periodic rotation of Curve25519 keypairs and pre-shared keys (PSK) directly on the OPNsense WireGuard kernel module.' }}
              </p>
              <div class="space-y-2 text-[11px]">
                <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between text-slate-200">
                  <span>{{ ts.isRomanian ? 'Program Rotație:' : 'Rotation Schedule:' }}</span>
                  <span class="text-slate-300 font-bold">{{ ts.isRomanian ? 'Cron Automat Săptămânal' : 'Weekly Automated Cron' }}</span>
                </div>
                <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between text-slate-200">
                  <span>{{ ts.isRomanian ? 'Algoritm Chei:' : 'Key Algorithm:' }}</span>
                  <span class="text-slate-100 font-bold">Curve25519 + ChaCha20-Poly1305</span>
                </div>
                <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between text-slate-200">
                  <span>{{ ts.isRomanian ? 'Status Handshake Peer:' : 'Peer Handshake Status:' }}</span>
                  <span class="text-slate-300 font-bold">{{ ts.isRomanian ? 'Sincronizat via API Vault' : 'Synchronized via Vault API' }}</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Grid 2: mTLS & Canary Honeytokens & RenovateBot -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <!-- mTLS Inter-Service -->
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-3">
              <div class="flex items-center justify-between border-b border-obsidian-750 pb-2">
                <h4 class="font-bold text-sm text-slate-50">{{ ts.isRomanian ? 'Gateway Inter-Servicii mTLS' : 'mTLS Inter-Service Gateway' }}</h4>
                <span class="text-[10px] text-slate-300 font-bold">VLAN 20</span>
              </div>
              <p class="text-slate-300 font-sans text-xs">
                {{ ts.isRomanian 
                  ? 'Verificare obligatorie mutuală a certificatelor client între proxy-urile ingress și bazele de date sau stocarea de secrete.' 
                  : 'Mandatory mutual client certificate verification between ingress proxies and backend databases or secret stores.' }}
              </p>
              <div class="text-[11px] p-2 rounded bg-obsidian-900 border border-obsidian-750 text-slate-200 space-y-1">
                <div>• Mode: <span class="text-slate-300 font-bold">require_and_verify</span></div>
                <div>• Root CA: <span class="text-slate-100">Step-CA Automated PKI</span></div>
                <div>• Cipher: <span class="text-slate-100">TLS_AES_256_GCM_SHA384</span></div>
              </div>
            </div>

            <!-- Canary Honeytokens -->
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-3">
              <div class="flex items-center justify-between border-b border-obsidian-750 pb-2">
                <h4 class="font-bold text-sm text-slate-50">Canary Honeytokens</h4>
                <span class="text-[10px] text-rose-400 font-bold">{{ ts.isRomanian ? 'DECEPȚIE' : 'DECEPTION' }}</span>
              </div>
              <p class="text-slate-300 font-sans text-xs">
                {{ ts.isRomanian 
                  ? 'Fișiere-capcană deceptive (passwords.csv, aws_keys.env) în DMZ și partajări SMB ce declanșează alerte instantanee la accesare.' 
                  : 'Deceptive honeypot files in DMZ and SMB shares that trigger instant alerts when accessed.' }}
              </p>
              <div class="text-[11px] p-2 rounded bg-obsidian-900 border border-obsidian-750 text-slate-200 space-y-1">
                <div>• Trigger: <span class="text-rose-400 font-bold">Linux Inotify + Webhook</span></div>
                <div>• Alert: <span class="text-slate-100">Telegram & ntfy Push</span></div>
                <div>• Response: <span class="text-slate-300 font-bold">{{ ts.isRomanian ? 'Banare IP Automată via CrowdSec' : 'Automatic IP Ban via CrowdSec' }}</span></div>
              </div>
            </div>

            <!-- RenovateBot GitOps -->
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-3">
              <div class="flex items-center justify-between border-b border-obsidian-750 pb-2">
                <h4 class="font-bold text-sm text-slate-50">RenovateBot GitOps</h4>
                <span class="text-[10px] text-sky-400 font-bold">{{ ts.isRomanian ? 'AUTOMATIZARE' : 'AUTOMATION' }}</span>
              </div>
              <p class="text-slate-300 font-sans text-xs">
                {{ ts.isRomanian 
                  ? 'Motor de scanare a dependențelor on-premise ce inspectează repo-urile interne Gitea și deschide Pull Requests automate.' 
                  : 'On-premise dependency scanning engine inspecting internal Gitea repositories and filing automated Pull Requests.' }}
              </p>
              <div class="text-[11px] p-2 rounded bg-obsidian-900 border border-obsidian-750 text-slate-200 space-y-1">
                <div>• Target: <span class="text-sky-400 font-bold">Docker, Terraform & Go</span></div>
                <div>• Forge: <span class="text-slate-100">Gitea Internal API v1</span></div>
                <div>• CI: <span class="text-slate-300 font-bold">Woodpecker CI Automated Test</span></div>
              </div>
            </div>

          </div>

          <!-- Grid 3: ZRAM & VirtIO Dynamic Memory Ballooning Engine -->
          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <div class="flex items-center justify-between border-b border-obsidian-750 pb-3">
              <div>
                <div class="text-[10px] text-slate-300 font-bold uppercase">{{ ts.isRomanian ? 'Accelerare Memorie & Protecție SSD' : 'Memory Acceleration & Lifespan Protection' }}</div>
                <h3 class="font-bold text-sm text-slate-50 mt-0.5">{{ ts.isRomanian ? 'Compresie Hardware ZRAM & Balonare Dinamică VirtIO' : 'ZRAM Hardware Compression & Dynamic Ballooning Engine' }}</h3>
              </div>
              <span class="px-2 py-0.5 rounded bg-slate-400/15 text-slate-300 text-[10px] font-bold">{{ ts.isRomanian ? 'COMPRESIE LZ4 ACTIVĂ' : 'LZ4 COMPRESSION ACTIVE' }}</span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
              <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <div class="text-[9px] text-slate-400 uppercase">Node 1 (x86_64) ZRAM</div>
                <div class="font-bold text-slate-300 text-sm">6.0 GB /dev/zram0</div>
                <div class="text-[10px] text-slate-400">ALGO=lz4 · Swappiness 60</div>
              </div>
              <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <div class="text-[9px] text-slate-400 uppercase">Node 3 (ARM64) ZRAM</div>
                <div class="font-bold text-slate-300 text-sm">1.9 GB /dev/zram0</div>
                <div class="text-[10px] text-slate-400">ALGO=lz4 · Swappiness 20</div>
              </div>
              <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <div class="text-[9px] text-slate-400 uppercase">{{ ts.isRomanian ? 'Protecție Durată Viață NVMe' : 'NVMe Lifespan Protection' }}</div>
                <div class="font-bold text-slate-100 text-sm">99.1% {{ ts.isRomanian ? 'Rămas' : 'Remaining' }}</div>
                <div class="text-[10px] text-slate-300">{{ ts.isRomanian ? 'Zero Uzură Swap pe SSD' : 'Zero SSD Swap Wear' }}</div>
              </div>
              <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <div class="text-[9px] text-slate-400 uppercase">{{ ts.isRomanian ? 'VM-uri Balonare VirtIO' : 'VirtIO Ballooning VMs' }}</div>
                <div class="font-bold text-slate-100 text-sm">6 QEMU VMs</div>
                <div class="text-[10px] text-slate-300">Dynamic 512MB → 8192MB</div>
              </div>
            </div>
          </div>

        </div>
      }

      <!-- TAB 5: IAC GENERATOR & RUNBOOKS -->
      @if (activeTab === 'generator') {
        <div class="space-y-6 font-mono text-xs">
          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <h3 class="font-bold text-sm text-slate-50 font-sans">
              {{ ts.isRomanian ? 'Generator Declarativ Module Terraform & Proxmox LXC' : 'Declarative Terraform & Proxmox LXC Module Generator' }}
            </h3>
            <p class="text-slate-300 font-sans text-xs">
              {{ ts.isRomanian ? 'Selectează parametrii de alocare compute pentru generarea instantanee a codului HCL Terraform:' : 'Select compute allocation parameters to generate instant HCL Terraform module code:' }}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="text-[10px] text-slate-400 uppercase block mb-1">{{ ts.isRomanian ? 'Nume Gazdă (Hostname)' : 'Hostname' }}</label>
                <input type="text" [(ngModel)]="genHostname" class="w-full p-2.5 rounded-xl bg-obsidian-900 border border-obsidian-700 text-slate-100 outline-none focus:border-slate-500" />
              </div>
              <div>
                <label class="text-[10px] text-slate-400 uppercase block mb-1">{{ ts.isRomanian ? 'ID Container (VMID)' : 'Container VMID' }}</label>
                <input type="number" [(ngModel)]="genVmid" class="w-full p-2.5 rounded-xl bg-obsidian-900 border border-obsidian-700 text-slate-100 outline-none focus:border-slate-500" />
              </div>
              <div>
                <label class="text-[10px] text-slate-400 uppercase block mb-1">{{ ts.isRomanian ? 'Memorie RAM (MB)' : 'RAM Ceiling (MB)' }}</label>
                <input type="number" [(ngModel)]="genRam" class="w-full p-2.5 rounded-xl bg-obsidian-900 border border-obsidian-700 text-slate-100 outline-none focus:border-slate-500" />
              </div>
            </div>

            <div class="relative mt-4">
              <pre class="p-4 rounded-xl bg-obsidian-950 border border-obsidian-750 text-slate-300 overflow-x-auto text-[11px] leading-relaxed"><code>{{ generatedTerraformCode }}</code></pre>
              <button
                (click)="copyGen()"
                class="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-400 text-slate-950 font-bold text-xs hover:bg-slate-400 transition-colors shadow"
              >
                {{ isGenCopied ? (ts.isRomanian ? 'COPIAT!' : 'COPIED!') : (ts.isRomanian ? 'COPIAZĂ HCL' : 'COPY HCL') }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- TAB 6: CHAOS ENGINEERING & RESILIENCY -->
      @if (activeTab === 'chaos') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-3">
            <span class="text-rose-400 font-bold uppercase text-[10px]">{{ ts.isRomanian ? '1. Stress CPU 100% (Simulare Încărcare Maximă)' : '1. CPU 100% Stress (Max Load Sim)' }}</span>
            <h4 class="font-bold text-slate-100">{{ ts.isRomanian ? 'Validare Limite Cgroup & Izolare Resurse' : 'Cgroup Limits & Resource Throttling' }}</h4>
            <p class="text-slate-300 font-sans text-xs">
              {{ ts.isRomanian ? 'Injectare încărcare pe 8 fire de execuție timp de 60 secunde pentru validarea mecanismului de limitare cgroup.' : 'Injecting full 8-thread load for 60 seconds to ensure container throttling prevents hypervisor starvation.' }}
            </p>
            <div class="p-2 rounded bg-obsidian-900 border border-obsidian-750 text-[11px] text-slate-300">
              <code>./scripts/chaos/chaos_runner.sh cpu-stress 60</code>
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-3">
            <span class="text-amber-400 font-bold uppercase text-[10px]">{{ ts.isRomanian ? '2. Cădere Gateway Ingress' : '2. Ingress Gateway Blackhole' }}</span>
            <h4 class="font-bold text-slate-100">{{ ts.isRomanian ? 'Re-Rutare BGP & Failover DNS Split-Horizon' : 'BGP Re-Routing & Split-Horizon Failover' }}</h4>
            <p class="text-slate-300 font-sans text-xs">
              {{ ts.isRomanian ? 'Deconectare forțată a interfeței de rețea pentru testarea re-rutării automate prin BGP și fallback DNS.' : 'Forced network drop on primary router interface to verify automated BGP path redirection.' }}
            </p>
            <div class="p-2 rounded bg-obsidian-900 border border-obsidian-750 text-[11px] text-slate-300">
              <code>./scripts/chaos/chaos_runner.sh network-blackhole 30</code>
            </div>
          </div>
        </div>
      }

      <!-- TAB 7: OBSERVABILITY & SLO METRICS -->
      @if (activeTab === 'observability') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <h3 class="font-bold text-sm text-slate-50">{{ ts.isRomanian ? 'Obiective la Nivel de Serviciu (SLO Cluster)' : 'Cluster Service Level Objectives (SLO)' }}</h3>
            <div class="space-y-2 text-slate-300">
              <div class="flex justify-between p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750">
                <span>{{ ts.isRomanian ? 'Disponibilitate Servicii Core:' : 'Core Service Uptime:' }}</span>
                <span class="text-slate-300 font-bold">99.9% (SLO)</span>
              </div>
              <div class="flex justify-between p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750">
                <span>{{ ts.isRomanian ? 'Latență Ingress P95:' : 'P95 Ingress Latency:' }}</span>
                <span class="text-slate-300 font-bold">&lt; 45 ms</span>
              </div>
              <div class="flex justify-between p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750">
                <span>{{ ts.isRomanian ? 'Rată Erori HTTP 5xx:' : 'HTTP 5xx Error Budget:' }}</span>
                <span class="text-slate-300 font-bold">&lt; 0.05%</span>
              </div>
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <h3 class="font-bold text-sm text-slate-50">{{ ts.isRomanian ? 'Pipeline Telemetrie LGTM OpenTelemetry' : 'LGTM OpenTelemetry Telemetry Pipeline' }}</h3>
            <div class="space-y-2 text-slate-300">
              <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between">
                <span>Prometheus TSDB</span>
                <span class="text-slate-300 font-bold">:9090</span>
              </div>
              <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between">
                <span>Grafana Loki Log Streams</span>
                <span class="text-slate-300 font-bold">:3100</span>
              </div>
              <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between">
                <span>Grafana Tempo Distributed Tracing</span>
                <span class="text-slate-300 font-bold">:3200 (OTLP :4317/:4318)</span>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 8: TECHNICAL GLOSSARY -->
      @if (activeTab === 'glossary') {
        <div class="space-y-4 font-sans text-xs">
          <input
            type="text"
            [(ngModel)]="glossarySearch"
            [placeholder]="ts.isRomanian ? 'Filtrează termenii din glosar (ex: ZFS, eBPF, Passkeys, NUT)...' : 'Filter glossary terms (e.g. ZFS, eBPF, Passkeys, NUT)...'"
            class="w-full p-3 rounded-xl bg-obsidian-900 border border-obsidian-700 text-slate-100 text-xs font-sans outline-none focus:border-slate-500"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (g of (ts.isRomanian ? filteredGlossaryRo : filteredGlossaryEn); track g.term) {
              <div class="p-4 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-1.5 shadow-md">
                <div class="font-bold text-slate-50 font-mono text-sm text-slate-300">{{ g.term }}</div>
                <p class="text-slate-300 font-sans leading-relaxed">{{ g.def }}</p>
              </div>
            }
          </div>
        </div>
      }

      <!-- MODAL: FORENSIC INVESTIGATION DOSSIER -->
      @if (selectedCase) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto" (click)="closeCase()">
          <div
            class="relative w-full max-w-4xl max-h-[90vh] bg-obsidian-900 border border-obsidian-700 rounded-2xl shadow-2xl overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-200 font-sans my-auto"
            (click)="$event.stopPropagation()"
          >
            <!-- Modal Header -->
            <div class="flex items-start justify-between border-b border-obsidian-750 pb-4 gap-4">
              <div class="space-y-1.5">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-red-950/70 text-red-300 border border-red-800/80">
                    {{ selectedCase.caseId }}
                  </span>
                  <span class="text-xs font-mono px-2 py-0.5 rounded bg-obsidian-800 text-slate-300 border border-obsidian-700">
                    {{ selectedCase.classification }}
                  </span>
                  <span class="text-xs font-mono px-2 py-0.5 rounded bg-obsidian-850 text-slate-400">
                    {{ selectedCase.date }} · {{ selectedCase.author }}
                  </span>
                  <span class="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/80">
                    {{ selectedCase.status }}
                  </span>
                </div>
                <h3 class="text-xl sm:text-2xl font-bold text-slate-50 leading-tight">
                  {{ selectedCase.title }}
                </h3>
                <div class="text-xs font-mono text-slate-400">
                  {{ ts.isRomanian ? 'Director Proiect:' : 'Project Directory:' }} <span class="text-slate-300">{{ selectedCase.repoPath }}</span>
                </div>
              </div>

              <!-- Close Button -->
              <button
                (click)="closeCase()"
                class="p-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-slate-100 transition-colors border border-obsidian-700 shrink-0"
                aria-label="Close modal"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Modal Body Sections -->
            <div class="space-y-6 text-xs sm:text-sm">

              <!-- 1. Executive Summary -->
              <div class="space-y-2">
                <h5 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  {{ ts.isRomanian ? '1. Rezumat Executiv & Context Incident' : '1. Executive Summary & Incident Context' }}
                </h5>
                <p class="text-slate-300 leading-relaxed bg-obsidian-850 p-4 rounded-xl border border-obsidian-750">
                  {{ selectedCase.summary }}
                </p>
              </div>

              <!-- 2. Attack Vector & Pretext -->
              <div class="space-y-2">
                <h5 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  {{ ts.isRomanian ? '2. Vector de Atac & Psihologie / Pretext' : '2. Attack Vector & Pretext Engineering' }}
                </h5>
                <div class="bg-obsidian-850 p-4 rounded-xl border border-obsidian-750 text-slate-300 leading-relaxed font-mono text-xs">
                  {{ selectedCase.attackVector }}
                </div>
              </div>

              <!-- 3. Reverse Engineering Findings -->
              <div class="space-y-2">
                <h5 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  {{ ts.isRomanian ? '3. Descoperiri Criminalistice & Decompilare Backend' : '3. Forensic Discoveries & Backend Decompilation' }}
                </h5>
                <div class="space-y-2 bg-obsidian-850 p-4 rounded-xl border border-obsidian-750">
                  @for (finding of selectedCase.reverseFindings; track finding) {
                    <div class="flex items-start gap-2.5">
                      <span class="text-slate-400 font-mono mt-0.5 font-bold">›</span>
                      <span class="text-slate-300 text-xs sm:text-sm leading-relaxed">{{ finding }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- 4. Financial Trapping & Post-Exploitation -->
              <div class="space-y-2">
                <h5 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  {{ ts.isRomanian ? '4. Drenaj Financiar & Post-Exploatare' : '4. Financial Drain & Post-Exploitation Mechanics' }}
                </h5>
                <p class="text-slate-300 leading-relaxed bg-obsidian-850 p-4 rounded-xl border border-obsidian-750 text-xs sm:text-sm">
                  {{ selectedCase.financialFlow }}
                </p>
              </div>

              <!-- 5. Indicators of Compromise (IoCs) -->
              <div class="space-y-2">
                <h5 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  {{ ts.isRomanian ? '5. Indicatori Tehnici de Compromitere (IoCs)' : '5. Technical Indicators of Compromise (IoCs)' }}
                </h5>
                <div class="overflow-x-auto rounded-xl border border-obsidian-750">
                  <table class="w-full font-mono text-xs text-left bg-obsidian-850">
                    <thead class="bg-obsidian-900 text-slate-400 border-b border-obsidian-750 text-[11px] uppercase">
                      <tr>
                        <th class="py-2.5 px-4">{{ ts.isRomanian ? 'Tip Indicator' : 'Indicator Type' }}</th>
                        <th class="py-2.5 px-4">{{ ts.isRomanian ? 'Valoare / Artefact Identificat' : 'Identified Value / Artifact' }}</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-obsidian-750 text-slate-300">
                      @for (ioc of selectedCase.iocs; track ioc.value) {
                        <tr>
                          <td class="py-2.5 px-4 font-bold text-slate-400">{{ ioc.type }}</td>
                          <td class="py-2.5 px-4 text-slate-200">{{ ioc.value }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 6. Datacenter Defense & Detection -->
              <div class="space-y-2">
                <h5 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  {{ ts.isRomanian ? '6. Implementare în Datacenter & Detecție Runtime' : '6. Datacenter Implementation & Runtime Detection' }}
                </h5>
                <div class="p-4 rounded-xl bg-obsidian-850 border border-obsidian-750 text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {{ selectedCase.datacenterDefense }}
                </div>
              </div>

              <!-- 7. MITRE ATT&CK Mapping -->
              <div class="space-y-2">
                <h5 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  {{ ts.isRomanian ? '7. Mapare MITRE ATT&CK' : '7. MITRE ATT&CK Framework Mapping' }}
                </h5>
                <div class="flex flex-wrap gap-2 font-mono text-xs">
                  @for (m of selectedCase.mitreAttack; track m) {
                    <span class="px-3 py-1 rounded-lg bg-obsidian-800 border border-obsidian-700 text-slate-300">
                      {{ m }}
                    </span>
                  }
                </div>
              </div>

            </div>

            <!-- Modal Footer -->
            <div class="border-t border-obsidian-750 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="text-xs font-mono text-slate-400">
                {{ ts.isRomanian ? 'Dosar arhivat în repozitoriu: ' : 'Case archived in repo: ' }}
                <code class="text-slate-300 bg-obsidian-800 px-2 py-0.5 rounded">{{ selectedCase.repoPath }}/case_study.md</code>
              </div>
              <div class="flex items-center gap-3 w-full sm:w-auto">
                <a
                  [href]="selectedCase.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs font-mono text-center transition-all shadow-lg"
                >
                  {{ ts.isRomanian ? 'Vezi Studiul de Caz pe GitHub ↗' : 'View Full Case Study on GitHub ↗' }}
                </a>
                <button
                  (click)="closeCase()"
                  class="px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 text-xs font-mono transition-all border border-obsidian-700"
                >
                  {{ ts.isRomanian ? 'Închide' : 'Close' }}
                </button>
              </div>
            </div>

          </div>
        </div>
      }

    </section>
  `
})
export class ArchitectureBlueprintComponent {
  ts = inject(TranslationService);
  activeTab: 'cloud' | 'vlan' | 'power' | 'storage' | 'cyber' | 'zerotrust' | 'generator' | 'chaos' | 'observability' | 'glossary' = 'cloud';
  cyberSubSection: 'all' | 'cases' | 'perimeter' | 'pillars' = 'all';
  selectedCase: ForensicCase | null = null;

  openCase(c: ForensicCase) {
    this.selectedCase = c;
  }

  closeCase() {
    this.selectedCase = null;
  }

  forensicCasesEn: ForensicCase[] = [
    {
      id: 'task-scam',
      caseId: 'SEC-2026-TASK-001',
      title: 'Forensic Deconstruction: Fraudulent Task Scam & USDT TRC-20 Drainage Platform',
      badge: 'Pig Butchering & Crypto Drainage',
      classification: 'TLP:CLEAR',
      date: '17 April 2026',
      author: '@stefanutc1',
      status: 'Completed & Documented',
      summary: 'Forensic teardown of a global Task Scam (hybrid Pig Butchering) infrastructure recruiting victims via WhatsApp/Telegram under the pretext of rating products on major e-commerce platforms. Traffic interception via Burp Suite and backend route discovery revealed technical proof of premeditated financial theft.',
      attackVector: 'Telegram/WhatsApp recruitment -> Access to Vue.js web app via exclusive invite code -> Fictitious balance generation in UI -> Mandatory USDT TRC-20 deposits for VIP levels -> Indefinite withdrawal blocking citing fabricated compliance taxes.',
      reverseFindings: [
        'Unauthenticated /api/v1/site/config endpoint disclosing operational campaign parameters in plain JSON.',
        'Hardcoded withdrawal kill-switch: withdrawMethodBank: false, withdrawMethodRevolut: false proving fiat withdrawal buttons were non-functional decoys.',
        'Geographic targeting lock: defaultCountryCode: "+40" restricting campaign intake exclusively to Romanian phone numbers.',
        'Severe SQL Injection surface across /api/v1/user/auth/* via invite_code and username parameters.'
      ],
      financialFlow: 'USDT TRC-20 deposits to attacker addresses. Funds are routed instantly through crypto mixers and consolidation clusters. Withdrawals are perpetually blocked demanding continuous "security audit unlock" fees.',
      iocs: [
        { type: 'API Route', value: '/api/v1/site/config' },
        { type: 'Auth Route', value: '/api/v1/user/auth/login & /register' },
        { type: 'Target Scope', value: 'Country Code +40 (Romania Lock)' },
        { type: 'TRC-20 Wallet', value: 'TLyG...x89W (Consolidation Node)' }
      ],
      datacenterDefense: 'Suricata IDS signature on OPNsense inspecting and blocking payloads containing withdrawMethodBank:false. Attacker IPs banned via CrowdSec and correlated in Wazuh SIEM on Proxmox.',
      repoPath: 'cyber/task-scam-infrastructure-analysis',
      githubUrl: 'https://github.com/stefanutc1/datacenter/blob/main/cyber/task-scam-infrastructure-analysis/case_study.md',
      mitreAttack: ['T1566 (Phishing)', 'T1589 (Gather Victim Info)', 'T1190 (Exploit Public App)', 'T1539 (Steal Web Session)']
    },
    {
      id: 'revolut-vishing',
      caseId: 'SEC-2026-VISH-002',
      title: 'Advanced Voice Phishing (Vishing) & Real-Time Credential Relay Targeting FinTech (Revolut)',
      badge: 'Telephony Fraud & Reverse Proxy Relay',
      classification: 'TLP:CLEAR',
      date: '10 August 2026',
      author: '@stefanutc1',
      status: 'Completed & Documented',
      summary: 'Forensic teardown of an aggressive Voice Phishing (Vishing) campaign weaponizing SIP VoIP Caller ID Spoofing to impersonate Revolut anti-fraud personnel. Victims were lured into cloned portals that harvested card details, 3D Secure SMS codes, and in-app biometric approvals in real time.',
      attackVector: 'Phone call with spoofed Caller ID (0749-XXX-XXX) -> Urgency manufacture ("unauthorized 1,850 RON charge") -> SMS shortener link to cloned portal -> Real-time PAN, CVV, expiry capture -> Synchronous bank API injection -> Biometric push approval coercion.',
      reverseFindings: [
        'Manipulation of SIP "From" and "P-Asserted-Identity" headers on insecure VoIP trunks to spoof legitimate corporate CLI.',
        'Cloned bank landing portal deployed on disposable TLDs (.xyz, .online) using free Let\'s Encrypt TLS certs.',
        'Real-time C2 reverse proxy piping victim-submitted credentials synchronously into the legitimate banking API.',
        'Synchronous coercion technique: operator maintains active voice call while compelling victim to tap in-app biometric approvals.'
      ],
      financialFlow: 'Instant exfiltration via SEPA Instant Transfers to mule accounts opened with synthetic identities or immediate crypto liquidation on P2P exchanges.',
      iocs: [
        { type: 'VoIP Spoofed CLI', value: '0749-XXX-XXX (Telekom/Orange Spoof)' },
        { type: 'Phishing Domain', value: 'revolut-security-auth[.]xyz' },
        { type: 'Relay Protocol', value: 'WSS / HTTPS reverse proxy relay' },
        { type: 'Exfiltration', value: 'SEPA Instant Mule IBANs' }
      ],
      datacenterDefense: 'OPNsense & FortiGate domain categorizer blocking Newly Registered Domains (NRD < 30 days), SIP header inspection on Asterisk PBX, and automated takedown reporting playbooks.',
      repoPath: 'cyber/revolut-vishing-forensics',
      githubUrl: 'https://github.com/stefanutc1/datacenter/blob/main/cyber/revolut-vishing-forensics/case_study.md',
      mitreAttack: ['T1566.002 (Spearphishing Link)', 'T1056.003 (Web Portal Harvesting)', 'T1539 (Steal Web Session)', 'T1656 (Impersonation)']
    },
    {
      id: 'tiktok-mrr',
      caseId: 'SEC-2025-MRR-001',
      title: 'Forensic Investigation: TikTok Marketing Funnels & Recursive Master Resell Rights (MRR) Schemes',
      badge: 'Algorithmic Funnel & Payment Abuse',
      classification: 'TLP:CLEAR',
      date: '14 June 2025 - 18 April 2026',
      author: '@stefanutc1',
      status: 'Reported & Documented',
      summary: 'Forensic examination of automated "faceless" marketing funnels on TikTok targeting Eastern European users. Documented a $497 "Digital Wealth Accelerator" transaction on stan.store. The delivered package contained purely ChatGPT-generated e-books coupled with a Master Resell Rights license mandating the buyer to replicate the funnel and resell the same course, constituting a recursive pyramid scheme.',
      attackVector: 'Viral TikTok clips -> Synthetic AI voiceovers (ElevenLabs / CapCut) -> Link-in-Bio redirect to stan.store / Beacons -> $497 course payment via Stripe/PayPal -> Delivery of AI-synthesized PDF + mandatory MRR resale license.',
      reverseFindings: [
        'Stylometric textual analysis: 99.4% match with raw GPT-3.5/GPT-4 prompts, confirming absence of original research.',
        'MRR license prohibits altering core content while mandating fixed $497 resale price, meeting FTC definition of recursive pyramid schemes.',
        'Abuse of Stripe Connect merchant infrastructure on Stan.store to circumvent underwriting scrutiny.',
        'Formal abuse notices submitted to abuse@stan.store, compliance@stan.store, Stripe Legal, and FTC.'
      ],
      financialFlow: 'Settlement via Stripe Connect directly to merchant bank accounts. Funds are rapidly withdrawn to avert chargeback clawbacks. Victim\'s sole financial recovery route is recruiting secondary buyers.',
      iocs: [
        { type: 'Target Platform', value: 'TikTok In-App Browser & Feed' },
        { type: 'Landing Host', value: '*.stan.store merchant subdomains' },
        { type: 'Payment Gateways', value: 'Stripe Connect API, PayPal Checkout' },
        { type: 'Evidence Hash', value: '4b91f0c2a83e... (SHA-256)' }
      ],
      datacenterDefense: 'Proxmox-hosted OSINT scraping worker mapping URL shortener redirect hops, risk scoring domains, and enforcing DNS sinkholing via OPNsense Unbound.',
      repoPath: 'cyber/tiktok-mrr-scam-infrastructure',
      githubUrl: 'https://github.com/stefanutc1/datacenter/blob/main/cyber/tiktok-mrr-scam-infrastructure/case_study.md',
      mitreAttack: ['T1584 (Compromise Infrastructure)', 'T1566.002 (Spearphishing Link)', 'T1598 (Phishing for Information)']
    },
    {
      id: 'openid-mitm',
      caseId: 'SEC-2025-BITM-003',
      title: 'Forensic Analysis: Adversary-in-the-Middle (AiTM) on Steam OpenID 2.0 Authentication',
      badge: 'AiTM & Session Token Hijacking',
      classification: 'TLP:CLEAR',
      date: '22 November 2025',
      author: '@stefanutc1',
      status: 'Completed & Documented',
      summary: 'Forensic investigation into an advanced Browser-in-the-Middle (BitM) campaign targeting esports players (CS2, Dota 2). Threat actors used an in-DOM synthetic window with fake SSL address bar to harvest OpenID 2.0 credentials, immediately locking accounts via Family View PIN and hijacking trade offers via Web API.',
      attackVector: 'Tournament voting portal -> Click "Sign in through Steam" -> Synthetic in-DOM BitM window with simulated SSL address bar -> Input credentials and Steam Guard TOTP -> Real-time C2 relay to Valve -> Immediate 4-digit Family View PIN lock -> Steam Web API key generation for trade hijacking.',
      reverseFindings: [
        'Simulated browser popup drawn via styled DOM container with draggable titlebar and simulated SSL padlock to bypass native browser security sandbox boundaries.',
        'Harvest script main.bundle.js intercepts form submission and transmits credentials via fetch() to /api/v2/auth/steam_callback.',
        'C2 reverse proxy initiates live authentication handshake with Valve servers, capturing steamLoginSecure and sessionid cookies.',
        'Automated post-exploitation bot: immediately sets a 4-digit Family View PIN (freezing victim out of account recovery) and provisions a Steam Web API Key to hijack trade offers in real time.',
      ],
      financialFlow: 'Adversary bot cancels legitimate trade offers and substitutes identical offers directed to clone accounts, draining high-value weapon skins and virtual inventory assets.',
      iocs: [
        { type: 'AiTM Callback', value: '/api/v2/auth/steam_callback' },
        { type: 'Phishing Bundle', value: 'main.bundle.js (obfuscated BitM engine)' },
        { type: 'Extracted Cookies', value: 'steamLoginSecure, sessionid' },
        { type: 'Post-Exploit Action', value: 'Family View PIN Lock + Web API Provisioning' }
      ],
      datacenterDefense: 'Suricata IDS rule on VM 200 flagging simulated BitM window canvas structures, T-Pot HTTP event correlation, and Wazuh alerts on suspicious API token activity.',
      repoPath: 'cyber/openid-mitm-phishing-forensics',
      githubUrl: 'https://github.com/stefanutc1/datacenter/blob/main/cyber/openid-mitm-phishing-forensics/case_study.md',
      mitreAttack: ['T1566.002 (Spearphishing Link)', 'T1539 (Steal Web Session Cookie)', 'T1078 (Valid Accounts)', 'T1056.003 (Web Portal Harvesting)']
    }
  ];

  forensicCasesRo: ForensicCase[] = [
    {
      id: 'task-scam',
      caseId: 'SEC-2026-TASK-001',
      title: 'Deconstrucție Forensic: Platformă Frauduloasă de Task Scam & Drenaj USDT TRC-20',
      badge: 'Pig Butchering & Drenaj Cripto',
      classification: 'TLP:CLEAR',
      date: '17 Aprilie 2026',
      author: '@stefanutc1',
      status: 'Finalizat & Documentat',
      summary: 'Dezasamblarea criminalistică a unei infrastructuri globale de Task Scam (hibrid Pig Butchering) ce recruta utilizatori pe WhatsApp/Telegram promițând comisioane pentru evaluarea produselor pe platforme e-commerce. Interceptarea traficului prin Burp Suite a expus un kill-switch hardcodat pentru retrageri și filtrare geografică strictă pe numere românești.',
      attackVector: 'Recrutare Telegram/WhatsApp -> Aplicație web Vue.js cu link de invitație -> Generare balanțe fictive în UI -> Cerință de depunere USDT TRC-20 pentru niveluri VIP -> Blocare permanentă a retragerilor sub pretextul plății unor taxe suplimentare.',
      reverseFindings: [
        'Endpoint /api/v1/site/config neautentificat ce dezvăluie parametrii interni ai campaniei în format JSON curat.',
        'Kill-Switch hardcodat pentru retrageri: withdrawMethodBank: false, withdrawMethodRevolut: false — butoanele de retragere erau pure elemente decorative.',
        'Blocare geografică: defaultCountryCode: "+40" restricționează înregistrarea victimelor exclusiv la numere din România.',
        'Suprafață SQLi critică pe rutele /api/v1/user/auth/* prin parametrii invite_code și username.'
      ],
      financialFlow: 'Depozite în USDT TRC-20 către adresa atacatorului. Fondurile sunt redirecționate instantaneu către mixere și portofele de consolidare. Retragerile sunt blocate sub cererea unor plăți continue de "deblocare audit".',
      iocs: [
        { type: 'Rută API', value: '/api/v1/site/config' },
        { type: 'Rută Autentificare', value: '/api/v1/user/auth/login & /register' },
        { type: 'Target Geografic', value: 'Prefix +40 (România Lock)' },
        { type: 'Portofel TRC-20', value: 'TLyG...x89W (Nod Consolidare)' }
      ],
      datacenterDefense: 'Semnătură Suricata IDS pe OPNsense ce blochează payload-urile cu parametrul withdrawMethodBank:false. IP-uri blocate automat prin CrowdSec și corelate în Wazuh SIEM pe Proxmox.',
      repoPath: 'cyber/task-scam-infrastructure-analysis',
      githubUrl: 'https://github.com/stefanutc1/datacenter/blob/main/cyber/task-scam-infrastructure-analysis/case_study.md',
      mitreAttack: ['T1566 (Phishing)', 'T1589 (Colectare Date Victime)', 'T1190 (Exploatare Aplicație Web)', 'T1539 (Furt Sesiune Web)']
    },
    {
      id: 'revolut-vishing',
      caseId: 'SEC-2026-VISH-002',
      title: 'Vishing Avansat & Relay de Credențiale în Timp Real Vizând Utilizatorii FinTech (Revolut)',
      badge: 'Fraudă Telefonică & Proxy Relay',
      classification: 'TLP:CLEAR',
      date: '10 August 2026',
      author: '@stefanutc1',
      status: 'Finalizat & Documentat',
      summary: 'Deconstrucția criminalistică a unei campanii de Voice Phishing (Vishing) ce a utilizat spoofing al Caller ID-ului prin trunchiuri SIP VoIP pentru a impersona echipa antifraudă Revolut. Victimele erau direcționate către clone web ce interceptau datele de card, codurile SMS 3DS și aprobările biometrice în timp real.',
      attackVector: 'Apel telefonic cu Caller ID falsificat (0749-XXX-XXX) -> Creare stare de urgență ("plată neautorizată de 1.850 RON") -> SMS cu link scurtat către portal clonă -> Recoltare PAN, CVV, Dată expirare -> Injectare imediată prin API bancar -> Forțare aprobare push biometrică la telefon.',
      reverseFindings: [
        'Manipularea antetelor SIP "From" și "P-Asserted-Identity" pe gateway-uri VoIP neautentificate pentru falsificarea numărului de apelant.',
        'Portal clonă găzduit pe TLD-uri efemere (.xyz / .online) securizat prin certificate Let\'s Encrypt gratuite.',
        'C2 reverse proxy în timp real ce conectează sesiunea victimei direct cu API-ul bancar legitim pentru tranzacții imediate.',
        'Tehnică de "coerciție sincronă" prin menținerea victimei în apel vocal până la finalizarea autorizării 3D Secure.'
      ],
      financialFlow: 'Transferuri instantanee prin SEPA Instant către conturi cărăuș (mule IBAN) deschise cu identități furate sau achiziții rapide de monedă virtuală pe burse peer-to-peer.',
      iocs: [
        { type: 'CLI VoIP Spoofat', value: '0749-XXX-XXX (Telekom/Orange Spoof)' },
        { type: 'Domeniu Phishing', value: 'revolut-security-auth[.]xyz' },
        { type: 'Protocol Releu', value: 'WSS / HTTPS reverse proxy relay' },
        { type: 'Exfiltrare', value: 'IBAN-uri Cărăuș SEPA Instant' }
      ],
      datacenterDefense: 'Filtrare OPNsense & FortiGate a domeniilor nou create (NRD < 30 zile), reguli de inspecție antet SIP pe Asterisk PBX și automatizare transmitere notificări de takedown.',
      repoPath: 'cyber/revolut-vishing-forensics',
      githubUrl: 'https://github.com/stefanutc1/datacenter/blob/main/cyber/revolut-vishing-forensics/case_study.md',
      mitreAttack: ['T1566.002 (Link Spearphishing)', 'T1056.003 (Recoltare Credențiale Web)', 'T1539 (Furt Sesiune Web)', 'T1656 (Impersonare)']
    },
    {
      id: 'tiktok-mrr',
      caseId: 'SEC-2025-MRR-001',
      title: 'Investigație Forensică: Pâlnii Algoritmice TikTok & Scheme Recursive Master Resell Rights (MRR)',
      badge: 'Pâlnie Algoritmică & Abuz Plăți',
      classification: 'TLP:CLEAR',
      date: '14 Iunie 2025 - 18 Aprilie 2026',
      author: '@stefanutc1',
      status: 'Raportat & Documentat',
      summary: 'Analiză tehnică a pâlniilor automate de "faceless marketing" pe TikTok vizând utilizatori din România și Europa de Est. Cazul a investigat achiziția unui curs de $497 denumit "Digital Wealth Accelerator" pe stan.store. Conținutul livrat s-a dovedit a fi 100% text generat de ChatGPT cu licență MRR ce obliga victima să cloneze pâlnia și să revândă cursul altor cumpărători (schemă piramidală recursivă).',
      attackVector: 'Clipuri scurte virale pe TikTok -> Voci sintetice AI (ElevenLabs / CapCut) -> Link în Bio către stan.store / Beacons -> Plată curs $497 prin Stripe/PayPal -> Descărcare PDF sintetic + Licență MRR de revânzare forțată.',
      reverseFindings: [
        'Analiză stilometrică: similaritate de 99.4% cu prompt-uri brute GPT-3.5/GPT-4, demonstrând absența oricărei expertize proprii.',
        'Contractul MRR interzice modificarea conținutului dar impune revânzarea la preț identic ($497), încadrându-se strict în definiția FTC a schemelor piramidale.',
        'Abuzul conturilor comerciale Stripe Connect pe Stan.store pentru eludarea evaluării de risc merchant.',
        'Transmiterea de rapoarte formale de abuz către abuse@stan.store, conformitate Stripe și FTC.'
      ],
      financialFlow: 'Tranzacțiile se decontează prin Stripe Connect către contul bancar al comerciantului. Fondurile sunt retrase rapid pentru prevenirea refuzurilor de plată (chargebacks). Singura cale de amortizare a victimei este recrutarea altor cumpărători.',
      iocs: [
        { type: 'Platformă Țintă', value: 'TikTok In-App Browser & Feed' },
        { type: 'Găzduire Pagină', value: 'Subdomenii comerciale *.stan.store' },
        { type: 'Procesatori Plăți', value: 'Stripe Connect API, PayPal Checkout' },
        { type: 'Hash Probatoriu', value: '4b91f0c2a83e... (SHA-256)' }
      ],
      datacenterDefense: 'Crawler OSINT găzduit pe Proxmox pentru trasarea lanțurilor de redirectare scurtate (URL hops), scoring de reputație pe domenii și blocare DNS prin OPNsense Unbound.',
      repoPath: 'cyber/tiktok-mrr-scam-infrastructure',
      githubUrl: 'https://github.com/stefanutc1/datacenter/blob/main/cyber/tiktok-mrr-scam-infrastructure/case_study.md',
      mitreAttack: ['T1584 (Compromitere Infrastructură)', 'T1566.002 (Link Spearphishing)', 'T1598 (Phishing pentru Informații)']
    },
    {
      id: 'openid-mitm',
      caseId: 'SEC-2025-BITM-003',
      title: 'Analiză Forensică: Atac Adversary-in-the-Middle (AiTM) pe Autentificarea Steam OpenID 2.0',
      badge: 'AiTM & Deturnare Sesiune',
      classification: 'TLP:CLEAR',
      date: '22 Noiembrie 2025',
      author: '@stefanutc1',
      status: 'Finalizat & Documentat',
      summary: 'Investigația unei campanii avansate de Browser-in-the-Middle (BitM) vizând ecosistemul de esports (CS2, Dota 2). Atacatorii au utilizat un popup sintetic simulat în DOM cu bară SSL falsă pentru a intercepta autentificarea OpenID 2.0, urmată de blocarea contului prin Family View PIN și furtul schimburilor de inventar prin Web API.',
      attackVector: 'Portal de votare pentru turnee CS2 -> Clic pe "Sign in through Steam" -> Afișare fereastră BitM simulată în DOM cu adresă SSL steamcommunity.com -> Introducere credențiale și cod TOTP Steam Guard -> Releu C2 către Valve -> Blocare Family View PIN (4 cifre) -> Creare cheie Steam Web API pentru deturnare trade-uri.',
      reverseFindings: [
        'Fereastră de popup falsă randată printr-un div absolut în DOM cu bară de titlu mobilă, lacăt SSL verde și titlu identic ferestrei Valve pentru a ocoli izolarea sandbox a browserului.',
        'Fișierul JavaScript main.bundle.js interceptează formularul de login și transmite credențialele prin fetch() către /api/v2/auth/steam_callback.',
        'Releul C2 execută handshake-ul de autentificare cu Valve și extrage cookie-urile de sesiune critică steamLoginSecure și sessionid.',
        'Post-exploatare automată: botul setează instantaneu un cod PIN pe Steam Family View (blocând accesul victimei la setările de securitate) și generează o cheie Steam Web API pentru a intercepta și deturna automat schimburile de iteme.'
      ],
      financialFlow: 'Botul atacatorului anulează instantaneu ofertele legitime de schimb din inventar și generează oferte identice către un profil clonă, deturnând skin-uri și iteme de mare valoare către rețele clandestine de vânzare.',
      iocs: [
        { type: 'Callback AiTM', value: '/api/v2/auth/steam_callback' },
        { type: 'Fișier Phishing', value: 'main.bundle.js (motor BitM ofuscat)' },
        { type: 'Cookie-uri Extrase', value: 'steamLoginSecure, sessionid' },
        { type: 'Acțiune Post-Exploatare', value: 'Blocare PIN Family View + Generare Web API' }
      ],
      datacenterDefense: 'Regulă Suricata IDS pe VM 200 ce identifică șabloanele DOM specifice ferestrelor BitM simulate, monitorizare evenimente HTTP pe T-Pot și alertare Wazuh la generare neobișnuită de chei API.',
      repoPath: 'cyber/openid-mitm-phishing-forensics',
      githubUrl: 'https://github.com/stefanutc1/datacenter/blob/main/cyber/openid-mitm-phishing-forensics/case_study.md',
      mitreAttack: ['T1566.002 (Link Spearphishing)', 'T1539 (Furt Cookie Sesiune)', 'T1078 (Conturi Valide)', 'T1056.003 (Recoltare Credențiale Web)']
    }
  ];

  genHostname = 'custom-app';
  genVmid = 120;
  genRam = 512;
  isGenCopied = false;
  glossarySearch = '';

  get generatedTerraformCode(): string {
    return `module "lxc_${this.genHostname}" {
  source       = "../modules/proxmox_lxc"
  target_node  = "proxmox"
  vmid         = ${this.genVmid}
  hostname     = "${this.genHostname}"
  cores        = 2
  memory       = ${this.genRam}
  disk_size    = "8G"
  ip_address   = "192.168.1.${this.genVmid}/24"
  gateway      = "192.168.1.1"
  vlan_tag     = 20
  unprivileged = true
  tags         = ["terraform", "custom", "homelab"]
}`;
  }

  copyGen() {
    navigator.clipboard.writeText(this.generatedTerraformCode);
    this.isGenCopied = true;
    setTimeout(() => this.isGenCopied = false, 2000);
  }

  vlanMatrixEn = [
    {
      id: 'VLAN 10',
      name: 'Management & Storage Subnet',
      subnet: '192.168.1.0/24',
      gateway: '192.168.1.1',
      nodes: 'Proxmox Core (x86_64), OMV NAS, Managed Switches',
      firewallPolicy: 'Isolated from IoT & Guest subnets'
    },
    {
      id: 'VLAN 20',
      name: 'Core Microservices & Applications',
      subnet: '192.168.1.0/24 & 192.168.64.0/24',
      gateway: '192.168.1.134 (OPNsense)',
      nodes: 'NPM Ingress, Vaultwarden, Immich, Nextcloud, Home Assistant, Gitea, Ollama (CT 110)',
      firewallPolicy: 'Strict forward authentication via Authentik (CT 108)'
    },
    {
      id: 'VLAN 30',
      name: 'Cyber Security & Sandboxes (CyberLab)',
      subnet: '192.168.30.0/24',
      gateway: '192.168.1.134:8443',
      nodes: 'Wazuh XDR SIEM (1514), Suricata IDS, Atomic Red Team, CAPEv2 / Cuckoo Sandbox (Win10 + INetSim)',
      firewallPolicy: 'Promiscuous SPAN mirror port, no outbound WAN access for sandboxes'
    },
    {
      id: 'VLAN 40',
      name: 'DMZ Deception & Honeypots',
      subnet: '192.168.40.0/24',
      gateway: '192.168.1.134 (OPNsense)',
      nodes: 'T-Pot Cluster (Cowrie SSH, Dionaea, RDP honeypot, Honeytrap)',
      firewallPolicy: 'Completely isolated DMZ; automated AbuseIPDB firewall blocking'
    },
    {
      id: 'VLAN 50',
      name: 'IoT & Physical Edge Devices',
      subnet: '192.168.50.0/24',
      gateway: '192.168.1.134',
      nodes: 'ESP32 mmWave Radar, ESP32 Irrigation Relays, Zigbee Gateway',
      firewallPolicy: 'MQTT communication strictly restricted to Home Assistant (CT 106)'
    }
  ];

  vlanMatrixRo = [
    {
      id: 'VLAN 10',
      name: 'Management & Storage Subnet',
      subnet: '192.168.1.0/24',
      gateway: '192.168.1.1',
      nodes: 'Proxmox Core (x86_64), OMV NAS, Switch-uri Administrabile',
      firewallPolicy: 'Izolat strict de subrețelele IoT și Guest'
    },
    {
      id: 'VLAN 20',
      name: 'Microservicii Core & Aplicații',
      subnet: '192.168.1.0/24 & 192.168.64.0/24',
      gateway: '192.168.1.134 (OPNsense)',
      nodes: 'NPM Ingress, Vaultwarden, Immich, Nextcloud, Home Assistant, Gitea, Ollama (CT 110)',
      firewallPolicy: 'Autentificare strictă înainte de acces via Authentik (CT 108)'
    },
    {
      id: 'VLAN 30',
      name: 'Securitate Cibernetică & Sandboxes (CyberLab)',
      subnet: '192.168.30.0/24',
      gateway: '192.168.1.134:8443',
      nodes: 'Wazuh XDR SIEM (1514), Suricata IDS, Atomic Red Team, CAPEv2 / Cuckoo Sandbox (Win10 + INetSim)',
      firewallPolicy: 'Port mirror SPAN promiscuu, fără acces WAN outbound pentru sandbox-uri'
    },
    {
      id: 'VLAN 40',
      name: 'DMZ Decepție & Honeypots',
      subnet: '192.168.40.0/24',
      gateway: '192.168.1.134 (OPNsense)',
      nodes: 'Cluster T-Pot (Cowrie SSH, Dionaea, RDP honeypot, Honeytrap)',
      firewallPolicy: 'DMZ complet izolat; blocare automată a atacatorilor prin AbuseIPDB'
    },
    {
      id: 'VLAN 50',
      name: 'IoT & Dispozitive Fizice Edge',
      subnet: '192.168.50.0/24',
      gateway: '192.168.1.134',
      nodes: 'Radar mmWave ESP32, Relee Irigații ESP32, Gateway Zigbee',
      firewallPolicy: 'Comunicație MQTT restricționată strict la Home Assistant (CT 106)'
    }
  ];

  cyberPillarsEn = [
    {
      title: 'Operating Systems & Virtualization',
      badge: 'Compute & AD',
      description: 'Bare-metal virtualization and isolated testbeds hosting enterprise domain infrastructure and offensive/defensive virtual machines.',
      tools: ['Windows Server 2025 Datacenter', 'Active Directory (AD DS)', 'Group Policy (GPO)', 'Linux (Debian / Ubuntu / Alpine / Talos)', 'Virtual Machines (KVM / Proxmox / UTM)']
    },
    {
      title: 'Networking & Packet Analysis',
      badge: 'Network & DPI',
      description: 'L2/L3 segmentation, stateful traffic filtering, promiscuous port mirroring, packet inspection, and protocol analysis.',
      tools: ['Networking TCP/IP', 'Wireshark', 'tcpdump', 'VLAN 802.1Q', 'WireGuard VPN', 'OPNsense Firewall']
    },
    {
      title: 'SIEM, Deception & Honeypots',
      badge: 'SOC & Honeynet',
      description: 'Centralized security event ingestion, real-time alert correlation, compliance monitoring, and T-Pot multi-honeypot deployment.',
      tools: ['Wazuh Manager (SIEM/XDR)', 'T-Pot (Cowrie / Dionaea / RDP)', 'Splunk', 'Elastic (ELK Stack)', 'Microsoft Sentinel', 'Grafana Loki']
    },
    {
      title: 'Endpoint & Perimeter Defense',
      badge: 'EDR / IDS / IPS',
      description: 'Host-based monitoring, process creation tracking, deep packet inspection, and real-time network anomaly blocking.',
      tools: ['EDR Telemetry', 'Suricata IDS/IPS', 'Snort', 'Sysmon (Windows)', 'CrowdSec Agent', 'Auditd FIM', 'Falco / Tetragon eBPF']
    },
    {
      title: 'Vulnerability & Adversary Emulation',
      badge: 'Offensive Testing',
      description: 'Port scanning, network vulnerability identification, web application penetration testing, and automated adversary simulation.',
      tools: ['Atomic Red Team (MITRE ATT&CK)', 'Nmap', 'Nessus', 'OpenVAS', 'Burp Suite', 'BloodHound']
    },
    {
      title: 'Threat Intel & Detection Rules',
      badge: 'Detection Eng.',
      description: 'Structured threat sharing, automated indicator of compromise (IoC) extraction, and vendor-agnostic detection signatures.',
      tools: ['Sigma Rules', 'YARA Rules', 'MISP Threat Sharing', 'Snort Rulesets', 'CyberChef', 'OPNsense IoC Exporter']
    },
    {
      title: 'Digital Forensics & Malware Analysis',
      badge: 'DFIR & Reverse Eng.',
      description: 'Air-gapped triage environment for memory acquisition, disk artifact analysis, binary disassembly, and dynamic sandbox debugging.',
      tools: ['CAPEv2 / Cuckoo (Win10 + INetSim)', 'Volatility (Memory Triage)', 'Autopsy (Disk Forensics)', 'Ghidra (NSA Decompiler)', 'IDA Pro', 'x64dbg']
    },
    {
      title: 'Automation, Scripting & SCM',
      badge: 'SecOps & DevSecOps',
      description: 'Automated threat hunting agents, incident response playbooks, triage collectors, and version-controlled configuration.',
      tools: ['PowerShell Core', 'Python 3.12 (FastAPI / Scapy)', 'Git', 'Ansible Hardening Playbooks', 'Woodpecker CI', 'Shuffle / n8n SOAR']
    }
  ];

  cyberPillarsRo = [
    {
      title: 'Sisteme de Operare & Virtualizare',
      badge: 'Compute & AD',
      description: 'Virtualizare bare-metal și medii izolate de test ce găzduiesc infrastructură Active Directory și mașini virtuale ofensive/defensive.',
      tools: ['Windows Server 2025 Datacenter', 'Active Directory (AD DS)', 'Politici de Grup (GPO)', 'Linux (Debian / Ubuntu / Alpine / Talos)', 'Mașini Virtuale (KVM / Proxmox / UTM)']
    },
    {
      title: 'Rețelistică & Analiză de Pachete',
      badge: 'Rețea & DPI',
      description: 'Segmentare L2/L3, filtrare stateful de trafic, port mirroring promiscuu SPAN, inspecție de pachete și analiză de protocoale.',
      tools: ['Rețelistică TCP/IP', 'Wireshark', 'tcpdump', 'VLAN 802.1Q', 'WireGuard VPN', 'Firewall OPNsense']
    },
    {
      title: 'SIEM, Decepție & Honeypots',
      badge: 'SOC & Honeynet',
      description: 'Ingestie centralizată de evenimente de securitate, corelare alerte în timp real, monitorizare conformitate și cluster multi-honeypot T-Pot.',
      tools: ['Wazuh Manager (SIEM/XDR)', 'T-Pot (Cowrie / Dionaea / RDP)', 'Splunk', 'Elastic (ELK Stack)', 'Microsoft Sentinel', 'Grafana Loki']
    },
    {
      title: 'Securitate Endpoint & Apărare Perimetrală',
      badge: 'EDR / IDS / IPS',
      description: 'Monitorizare la nivel de gazdă, trasare creare procese, inspecție profundă de pachete (DPI) și blocare anomalii în timp real.',
      tools: ['Telemetrie EDR', 'Suricata IDS/IPS', 'Snort', 'Sysmon (Windows)', 'Agent CrowdSec', 'Auditd FIM', 'Falco / Tetragon eBPF']
    },
    {
      title: 'Vulnerabilități & Emulare Adversari',
      badge: 'Testare Ofensivă',
      description: 'Scanare de porturi, identificare vulnerabilități în rețea, teste de penetrare pentru aplicații web și simulare automată de atacuri.',
      tools: ['Atomic Red Team (MITRE ATT&CK)', 'Nmap', 'Nessus', 'OpenVAS', 'Burp Suite', 'BloodHound']
    },
    {
      title: 'Threat Intel & Reguli de Detecție',
      badge: 'Inginerie Detecție',
      description: 'Schimb structurat de informații despre amenințări, extragere automată a indicatorilor de compromitere (IoC) și semnături agnostice de detecție.',
      tools: ['Reguli Sigma', 'Reguli YARA', 'Partajare MISP', 'Seturi de Reguli Snort', 'CyberChef', 'Exportator IoC OPNsense']
    },
    {
      title: 'Digital Forensics & Analiză Malware',
      badge: 'DFIR & Reverse Eng.',
      description: 'Mediu izolat de triaj pentru achiziție memorie RAM, analiză artefacte disc, dezasamblare binare și depanare dinamică în sandbox.',
      tools: ['CAPEv2 / Cuckoo (Win10 + INetSim)', 'Volatility (Triaj Memorie)', 'Autopsy (Criminalistică Disc)', 'Ghidra (Decompilator NSA)', 'IDA Pro', 'x64dbg']
    },
    {
      title: 'Automatizare, Scripting & SCM',
      badge: 'SecOps & DevSecOps',
      description: 'Agenți automați de threat hunting, playbook-uri de răspuns la incidente, colectoare de triaj și configurație versionată prin Git.',
      tools: ['PowerShell Core', 'Python 3.12 (FastAPI / Scapy)', 'Git', 'Playbook-uri Ansible Hardening', 'Woodpecker CI', 'Shuffle / n8n SOAR']
    }
  ];

  glossaryEn = [
    { term: 'ZFS', def: 'Advanced 128-bit file system and logical volume manager with native checksums, copy-on-write, and ZSTD compression.' },
    { term: 'eBPF', def: 'Extended Berkeley Packet Filter allowing safe kernel-level observability (Tetragon & Falco) without modifying kernel source.' },
    { term: 'Passkeys', def: 'FIDO2 / WebAuthn cryptographic credentials providing passwordless and phishing-resistant zero-trust authentication.' },
    { term: 'NUT', def: 'Network UPS Tools providing continuous monitoring and graceful sequential shutdown for Coldex UPS batteries.' },
    { term: 'Ollama', def: 'Lightweight GPU LLM execution engine serving models like Qwen2.5-Coder and Llama-3.2 locally on GTX 1050 Ti.' },
    { term: 'Talos Linux', def: 'Immutable, zero-SSH, API-managed minimal Linux operating system designed strictly for running Kubernetes.' },
    { term: 'T-Pot', def: 'Multi-honeypot platform deploying honeypots (Cowrie, Dionaea, RDP) in an isolated DMZ with automated threat feeds.' },
    { term: 'CrowdSec', def: 'Collaborative open-source security engine analyzing logs to automatically ban malicious IPs across all ingress routes.' }
  ];

  glossaryRo = [
    { term: 'ZFS', def: 'Sistem de fișiere avansat pe 128 de biți și manager de volume logice cu sume de control native, copy-on-write și compresie ZSTD.' },
    { term: 'eBPF', def: 'Extended Berkeley Packet Filter ce permite observabilitate sigură la nivel de kernel (Tetragon & Falco) fără modificarea nucleului Linux.' },
    { term: 'Passkeys', def: 'Credențiale criptografice FIDO2 / WebAuthn ce oferă autentificare fără parolă, rezistentă la phishing și zero-trust.' },
    { term: 'NUT', def: 'Network UPS Tools ce oferă monitorizare continuă și oprire secvențială controlată a alimentării pentru UPS-ul Coldex.' },
    { term: 'Ollama', def: 'Motor compact de execuție LLM pe GPU ce rulează modele precum Qwen2.5-Coder și Llama-3.2 local pe placa video GTX 1050 Ti.' },
    { term: 'Talos Linux', def: 'Sistem de operare Linux minimal, imutabil, fără acces SSH, gestionat exclusiv prin API, proiectat dedicat pentru Kubernetes.' },
    { term: 'T-Pot', def: 'Platformă modulară de decepție ce rulează honeypot-uri (Cowrie, Dionaea, RDP) într-un DMZ complet izolat cu fluxuri automate de threat intel.' },
    { term: 'CrowdSec', def: 'Motor colaborativ open-source de securitate ce analizează logurile pentru blocarea automată a IP-urilor malițioase pe toate rutele de ingress.' }
  ];

  get filteredGlossaryEn() {
    const q = this.glossarySearch.toLowerCase().trim();
    if (!q) return this.glossaryEn;
    return this.glossaryEn.filter(g => g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q));
  }

  get filteredGlossaryRo() {
    const q = this.glossarySearch.toLowerCase().trim();
    if (!q) return this.glossaryRo;
    return this.glossaryRo.filter(g => g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q));
  }
}
