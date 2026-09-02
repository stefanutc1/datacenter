import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-architecture-blueprint',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="blueprint" class="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      
      <!-- Section Header -->
      <div class="space-y-2 mb-8">
        <div class="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
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
          [class.bg-emerald-500]="activeTab === 'cloud'"
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
          [class.bg-emerald-500]="activeTab === 'vlan'"
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
          [class.bg-emerald-500]="activeTab === 'power'"
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
          [class.bg-emerald-500]="activeTab === 'storage'"
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
          [class.bg-emerald-500]="activeTab === 'cyber'"
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
          [class.bg-emerald-500]="activeTab === 'zerotrust'"
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
          [class.bg-emerald-500]="activeTab === 'generator'"
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
          [class.bg-emerald-500]="activeTab === 'chaos'"
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
          [class.bg-emerald-500]="activeTab === 'observability'"
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
          [class.bg-emerald-500]="activeTab === 'glossary'"
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
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
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
              <div class="p-5 rounded-2xl bg-obsidian-850/90 border border-obsidian-750 space-y-3 hover:border-emerald-500/50 transition-colors">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono font-bold text-emerald-400">GOOGLE CLOUD (GCP)</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800">WORM / OIDC Keyless</span>
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
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                {{ ts.isRomanian ? 'Matrice CI/CD Enterprise (9 Fluxuri Automate · 36+ Verificări Paralele)' : 'Enterprise CI/CD Matrix (9 Automated Workflows · 36+ Parallel Checks)' }}
              </span>
              <span class="text-xs font-mono text-emerald-400">GitHub Actions CI/CD</span>
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
                      <td class="p-4 font-bold text-emerald-400 whitespace-nowrap">homelab-ci-cd-matrix.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Matrice Calitate' : 'Quality Matrix' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Terraform Fmt & Validate, Checkov IaC, Trivy, Docker Compose, ShellCheck, Secret Leakage, ELO Matrix (3.9-3.13)' : 'Terraform Fmt & Validate, Checkov IaC, Trivy, Docker Compose, ShellCheck, Secret Leakage, ELO Matrix (3.9-3.13)' }}</td>
                      <td class="p-4 text-slate-400">Push / PR / Dispatch</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-emerald-400 whitespace-nowrap">ci.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Pipeline CI Central' : 'Core CI Pipeline' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Gitleaks & TruffleHog Secrets, Ruff Lint, MyPy Types, Bandit SAST, Semgrep, Sintaxă Ansible, Kubeconform' : 'Gitleaks & TruffleHog Secrets, Ruff Lint, MyPy Types, Bandit SAST, Semgrep, Ansible Syntax, Kubeconform' }}</td>
                      <td class="p-4 text-slate-400">Push / PR</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-emerald-400 whitespace-nowrap">cd.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Livrare Continuă' : 'Continuous Deploy' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Sincronizare GitOps, Împachetare Imagini Container (GHCR), Verificare Rollback' : 'GitOps Synchronization, Container Image Packaging (GHCR), Rollback Verification' }}</td>
                      <td class="p-4 text-slate-400">Push to main</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-emerald-400 whitespace-nowrap">container-scan.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Securitate / CVE' : 'Security / CVE' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Scanare Vulnerabilități Imagini Containere Trivy & Conformitate CIS Dockle' : 'Trivy & Dockle Container Image Vulnerability & CIS Benchmark Scanning' }}</td>
                      <td class="p-4 text-slate-400">Push / Scheduled</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-emerald-400 whitespace-nowrap">security-scan.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Securitate SAST' : 'SAST Security' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Motor GitHub CodeQL, Analiză Statică Avansată a Vulnerabilităților (Python & TypeScript)' : 'GitHub CodeQL Engine, Advanced Security Static Analysis (Python & TypeScript)' }}</td>
                      <td class="p-4 text-slate-400">Weekly / Push</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-emerald-400 whitespace-nowrap">security-scheduled.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Audit Nocturn' : 'Nightly Audit' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Audit Programat Nocturn pentru Dependențe (Pip-Audit, NPM Audit, Trivy FS)' : 'Nightly Dependency Vulnerability Audits (Pip-Audit, NPM Audit, Trivy FS)' }}</td>
                      <td class="p-4 text-slate-400">Cron (02:00 UTC)</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-emerald-400 whitespace-nowrap">deploy-pages.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'CD Pagini Statice' : 'Static Pages CD' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Build Producție Angular 19 & Publicare Zero-Downtime pe GitHub Pages' : 'Angular 19 Production Build & GitHub Pages Zero-Downtime Deployment' }}</td>
                      <td class="p-4 text-slate-400">Push to main</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-emerald-400 whitespace-nowrap">desktop-macos-release.yml</td>
                      <td class="p-4 text-slate-200">{{ ts.isRomanian ? 'Lansare Binare' : 'Binary Release' }}</td>
                      <td class="p-4 text-slate-300">{{ ts.isRomanian ? 'Compilare Universală C# .NET 10 macOS, Semnare Binară & Împachetare DMG' : 'C# .NET 10 Native macOS Universal App Compilation, Signing & DMG Packaging' }}</td>
                      <td class="p-4 text-slate-400">Tag / Release</td>
                    </tr>
                    <tr class="hover:bg-obsidian-750/40 transition-colors">
                      <td class="p-4 font-bold text-emerald-400 whitespace-nowrap">readme-sync.yml</td>
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
                      <td class="p-4 font-bold text-emerald-400 whitespace-nowrap">{{ vlan.id }}</td>
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
              <div class="text-2xl font-bold text-emerald-400">231.4 V AC</div>
              <div class="text-[11px] text-slate-300">{{ ts.isRomanian ? 'Undă Sinusoidală Pură 50.0 Hz' : 'Pure Sine Wave 50.0 Hz' }}</div>
            </div>
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-lg space-y-2">
              <div class="text-[10px] text-slate-400 uppercase">{{ ts.isRomanian ? 'Încărcare Baterie' : 'Battery Charge' }}</div>
              <div class="text-2xl font-bold text-emerald-400">100% (13.7V)</div>
              <div class="text-[11px] text-slate-300">{{ ts.isRomanian ? 'Baterie 100Ah Deep-Cycle AGM' : '100Ah Deep-Cycle AGM' }}</div>
            </div>
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-lg space-y-2">
              <div class="text-[10px] text-slate-400 uppercase">{{ ts.isRomanian ? 'Autonomie Estimată' : 'Estimated Autonomy' }}</div>
              <div class="text-2xl font-bold text-emerald-400">~245 Mins</div>
              <div class="text-[11px] text-slate-300">{{ ts.isRomanian ? 'Consum Activ: 84 Watts' : 'Active Load: 84 Watts' }}</div>
            </div>
            <div class="p-5 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-lg space-y-2">
              <div class="text-[10px] text-slate-400 uppercase">{{ ts.isRomanian ? 'Eficiență Energetică (PUE)' : 'Efficiency PUE' }}</div>
              <div class="text-2xl font-bold text-emerald-400">1.14 PUE</div>
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
                <span class="text-emerald-400 font-bold">{{ ts.isRomanian ? 'Pasul 1: Non-Critic' : 'Step 1: Non-Critical' }}</span>
                <p class="text-slate-300 text-[11px] font-sans">{{ ts.isRomanian ? 'Oprire Media (Jellyfin CT 109) & Nextcloud' : 'Stop Media (Jellyfin CT 109) & Nextcloud' }}</p>
              </div>
              <div class="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <span class="text-emerald-400 font-bold">{{ ts.isRomanian ? 'Pasul 2: Baze de Date' : 'Step 2: Databases' }}</span>
                <p class="text-slate-300 text-[11px] font-sans">{{ ts.isRomanian ? 'Flush & Oprire PostgreSQL & Pool OMV NFS' : 'Flush & Stop PostgreSQL & OMV NFS Pool' }}</p>
              </div>
              <div class="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <span class="text-emerald-400 font-bold">{{ ts.isRomanian ? 'Pasul 3: VM-uri Core' : 'Step 3: Core VMs' }}</span>
                <p class="text-slate-300 text-[11px] font-sans">{{ ts.isRomanian ? 'Oprire Controlată Windows Server 2025 & OPNsense' : 'Gracefully stop Windows Server 2025 & OPNsense' }}</p>
              </div>
              <div class="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <span class="text-emerald-400 font-bold">{{ ts.isRomanian ? 'Pasul 4: Oprire Gazdă' : 'Step 4: Host Poweroff' }}</span>
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
              <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">ONLINE · 512GB</span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-slate-300">
                <span>{{ ts.isRomanian ? 'Rată Compresie ZSTD:' : 'ZSTD Compression Ratio:' }}</span>
                <span class="font-bold text-emerald-400">1.84x</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>{{ ts.isRomanian ? 'Rată Succes Cache ARC:' : 'ARC Cache Hit Rate:' }}</span>
                <span class="font-bold text-emerald-400">98.6%</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>{{ ts.isRomanian ? 'Aliniere Bloc Baze de Date:' : 'Database Block Alignment:' }}</span>
                <span class="font-bold text-slate-100">recordsize=16k</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>{{ ts.isRomanian ? 'Sănătate SSD (Speranță Viață TBW):' : 'SSD Health (TBW Life Expectancy):' }}</span>
                <span class="font-bold text-emerald-400">{{ ts.isRomanian ? '99.1% Rămas (Test S.M.A.R.T. Trecut)' : '99.1% Remaining (S.M.A.R.T. Passed)' }}</span>
              </div>
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <div class="flex items-center justify-between border-b border-obsidian-750 pb-3">
              <h3 class="font-bold text-sm text-slate-50">{{ ts.isRomanian ? 'datapool (Mirror ZFS OMV)' : 'datapool (OMV ZFS Mirror)' }}</h3>
              <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">ONLINE · 500GB</span>
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
                <span class="font-bold text-emerald-400">Kiwix Wikipedia ZIM (100% Offline)</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>{{ ts.isRomanian ? 'Programare Verificare ZFS Scrub:' : 'ZFS Scrub Scheduler:' }}</span>
                <span class="font-bold text-slate-200">{{ ts.isRomanian ? 'Prima duminică din lună (0 Erori)' : '1st Sunday of Month (0 Errors)' }}</span>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 4: CYBERLAB -->
      @if (activeTab === 'cyber') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-xs">
          @for (pillar of (ts.isRomanian ? cyberPillarsRo : cyberPillarsEn); track pillar.title) {
            <div class="p-6 rounded-2xl bg-obsidian-850/90 border border-obsidian-750 shadow-xl space-y-3.5 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between border-b border-obsidian-750 pb-3">
                  <h3 class="font-sans font-bold text-slate-50 text-base tracking-wide">
                    {{ pillar.title }}
                  </h3>
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
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
                  <div class="text-[10px] text-emerald-400 font-bold uppercase">{{ ts.isRomanian ? 'Pipeline Injectare Secrete' : 'Secret Injection Pipeline' }}</div>
                  <h3 class="font-bold text-sm text-slate-50 mt-0.5">HashiCorp Vault / OpenBao</h3>
                </div>
                <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">{{ ts.isRomanian ? 'FĂRĂ .ENV PE DISC' : 'ZERO .ENV ON DISK' }}</span>
              </div>
              <p class="text-slate-300 font-sans text-xs leading-relaxed">
                {{ ts.isRomanian 
                  ? 'Motor centralizat de secrete ce furnizează generare dinamică de token-uri și credențiale efemere pentru Terraform, Ansible și Woodpecker CI.' 
                  : 'Centralized secrets engine providing automated dynamic token generation and ephemeral credentials for Terraform, Ansible, and Woodpecker CI runners.' }}
              </p>
              <div class="space-y-2 text-[11px]">
                <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between text-slate-200">
                  <span>{{ ts.isRomanian ? 'Backend Secrete KV v2:' : 'KV v2 Secret Backend:' }}</span>
                  <span class="text-emerald-400 font-bold">secret/data/homelab/*</span>
                </div>
                <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between text-slate-200">
                  <span>{{ ts.isRomanian ? 'Timp Viață Token DB (TTL):' : 'Dynamic DB Credential TTL:' }}</span>
                  <span class="text-slate-100 font-bold">{{ ts.isRomanian ? 'Lease 1 Oră (Auto-Revocare)' : '1 Hour Lease (Auto-Revoke)' }}</span>
                </div>
                <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between text-slate-200">
                  <span>{{ ts.isRomanian ? 'Criptare în Tranzit:' : 'Transit Encryption:' }}</span>
                  <span class="text-emerald-400 font-bold">AES-256-GCM / Ed25519</span>
                </div>
              </div>
            </div>

            <!-- WireGuard Kernel Key Rotation -->
            <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
              <div class="flex items-center justify-between border-b border-obsidian-750 pb-3">
                <div>
                  <div class="text-[10px] text-emerald-400 font-bold uppercase">{{ ts.isRomanian ? 'Rotație Criptografică Automată' : 'Automated Cryptographic Rotation' }}</div>
                  <h3 class="font-bold text-sm text-slate-50 mt-0.5">WireGuard Kernel Key Rotator</h3>
                </div>
                <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">{{ ts.isRomanian ? 'FĂRĂ ÎNTRERUPERE' : 'ZERO DOWNTIME' }}</span>
              </div>
              <p class="text-slate-300 font-sans text-xs leading-relaxed">
                {{ ts.isRomanian 
                  ? 'Rotație periodică automată a perechilor de chei Curve25519 și cheilor pre-partajate (PSK) direct în modulul kernel WireGuard din OPNsense.' 
                  : 'Automated periodic rotation of Curve25519 keypairs and pre-shared keys (PSK) directly on the OPNsense WireGuard kernel module.' }}
              </p>
              <div class="space-y-2 text-[11px]">
                <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between text-slate-200">
                  <span>{{ ts.isRomanian ? 'Program Rotație:' : 'Rotation Schedule:' }}</span>
                  <span class="text-emerald-400 font-bold">{{ ts.isRomanian ? 'Cron Automat Săptămânal' : 'Weekly Automated Cron' }}</span>
                </div>
                <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between text-slate-200">
                  <span>{{ ts.isRomanian ? 'Algoritm Chei:' : 'Key Algorithm:' }}</span>
                  <span class="text-slate-100 font-bold">Curve25519 + ChaCha20-Poly1305</span>
                </div>
                <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between text-slate-200">
                  <span>{{ ts.isRomanian ? 'Status Handshake Peer:' : 'Peer Handshake Status:' }}</span>
                  <span class="text-emerald-400 font-bold">{{ ts.isRomanian ? 'Sincronizat via API Vault' : 'Synchronized via Vault API' }}</span>
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
                <span class="text-[10px] text-emerald-400 font-bold">VLAN 20</span>
              </div>
              <p class="text-slate-300 font-sans text-xs">
                {{ ts.isRomanian 
                  ? 'Verificare obligatorie mutuală a certificatelor client între proxy-urile ingress și bazele de date sau stocarea de secrete.' 
                  : 'Mandatory mutual client certificate verification between ingress proxies and backend databases or secret stores.' }}
              </p>
              <div class="text-[11px] p-2 rounded bg-obsidian-900 border border-obsidian-750 text-slate-200 space-y-1">
                <div>• Mode: <span class="text-emerald-400 font-bold">require_and_verify</span></div>
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
                <div>• Response: <span class="text-emerald-400 font-bold">{{ ts.isRomanian ? 'Banare IP Automată via CrowdSec' : 'Automatic IP Ban via CrowdSec' }}</span></div>
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
                <div>• CI: <span class="text-emerald-400 font-bold">Woodpecker CI Automated Test</span></div>
              </div>
            </div>

          </div>

          <!-- Grid 3: ZRAM & VirtIO Dynamic Memory Ballooning Engine -->
          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <div class="flex items-center justify-between border-b border-obsidian-750 pb-3">
              <div>
                <div class="text-[10px] text-emerald-400 font-bold uppercase">{{ ts.isRomanian ? 'Accelerare Memorie & Protecție SSD' : 'Memory Acceleration & Lifespan Protection' }}</div>
                <h3 class="font-bold text-sm text-slate-50 mt-0.5">{{ ts.isRomanian ? 'Compresie Hardware ZRAM & Balonare Dinamică VirtIO' : 'ZRAM Hardware Compression & Dynamic Ballooning Engine' }}</h3>
              </div>
              <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">{{ ts.isRomanian ? 'COMPRESIE LZ4 ACTIVĂ' : 'LZ4 COMPRESSION ACTIVE' }}</span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
              <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <div class="text-[9px] text-slate-400 uppercase">Node 1 (x86_64) ZRAM</div>
                <div class="font-bold text-emerald-400 text-sm">6.0 GB /dev/zram0</div>
                <div class="text-[10px] text-slate-400">ALGO=lz4 · Swappiness 60</div>
              </div>
              <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <div class="text-[9px] text-slate-400 uppercase">Node 3 (ARM64) ZRAM</div>
                <div class="font-bold text-emerald-400 text-sm">1.9 GB /dev/zram0</div>
                <div class="text-[10px] text-slate-400">ALGO=lz4 · Swappiness 20</div>
              </div>
              <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <div class="text-[9px] text-slate-400 uppercase">{{ ts.isRomanian ? 'Protecție Durată Viață NVMe' : 'NVMe Lifespan Protection' }}</div>
                <div class="font-bold text-slate-100 text-sm">99.1% {{ ts.isRomanian ? 'Rămas' : 'Remaining' }}</div>
                <div class="text-[10px] text-emerald-400">{{ ts.isRomanian ? 'Zero Uzură Swap pe SSD' : 'Zero SSD Swap Wear' }}</div>
              </div>
              <div class="p-3 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1">
                <div class="text-[9px] text-slate-400 uppercase">{{ ts.isRomanian ? 'VM-uri Balonare VirtIO' : 'VirtIO Ballooning VMs' }}</div>
                <div class="font-bold text-slate-100 text-sm">6 QEMU VMs</div>
                <div class="text-[10px] text-emerald-400">Dynamic 512MB → 8192MB</div>
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
                <input type="text" [(ngModel)]="genHostname" class="w-full p-2.5 rounded-xl bg-obsidian-900 border border-obsidian-700 text-slate-100 outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label class="text-[10px] text-slate-400 uppercase block mb-1">{{ ts.isRomanian ? 'ID Container (VMID)' : 'Container VMID' }}</label>
                <input type="number" [(ngModel)]="genVmid" class="w-full p-2.5 rounded-xl bg-obsidian-900 border border-obsidian-700 text-slate-100 outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label class="text-[10px] text-slate-400 uppercase block mb-1">{{ ts.isRomanian ? 'Memorie RAM (MB)' : 'RAM Ceiling (MB)' }}</label>
                <input type="number" [(ngModel)]="genRam" class="w-full p-2.5 rounded-xl bg-obsidian-900 border border-obsidian-700 text-slate-100 outline-none focus:border-emerald-500" />
              </div>
            </div>

            <div class="relative mt-4">
              <pre class="p-4 rounded-xl bg-obsidian-950 border border-obsidian-750 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed"><code>{{ generatedTerraformCode }}</code></pre>
              <button
                (click)="copyGen()"
                class="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow"
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
                <span class="text-emerald-400 font-bold">99.9% (SLO)</span>
              </div>
              <div class="flex justify-between p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750">
                <span>{{ ts.isRomanian ? 'Latență Ingress P95:' : 'P95 Ingress Latency:' }}</span>
                <span class="text-emerald-400 font-bold">&lt; 45 ms</span>
              </div>
              <div class="flex justify-between p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750">
                <span>{{ ts.isRomanian ? 'Rată Erori HTTP 5xx:' : 'HTTP 5xx Error Budget:' }}</span>
                <span class="text-emerald-400 font-bold">&lt; 0.05%</span>
              </div>
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-obsidian-850 border border-obsidian-750 shadow-xl space-y-4">
            <h3 class="font-bold text-sm text-slate-50">{{ ts.isRomanian ? 'Pipeline Telemetrie LGTM OpenTelemetry' : 'LGTM OpenTelemetry Telemetry Pipeline' }}</h3>
            <div class="space-y-2 text-slate-300">
              <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between">
                <span>Prometheus TSDB</span>
                <span class="text-emerald-400 font-bold">:9090</span>
              </div>
              <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between">
                <span>Grafana Loki Log Streams</span>
                <span class="text-emerald-400 font-bold">:3100</span>
              </div>
              <div class="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 flex justify-between">
                <span>Grafana Tempo Distributed Tracing</span>
                <span class="text-emerald-400 font-bold">:3200 (OTLP :4317/:4318)</span>
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
            class="w-full p-3 rounded-xl bg-obsidian-900 border border-obsidian-700 text-slate-100 text-xs font-sans outline-none focus:border-emerald-500"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (g of (ts.isRomanian ? filteredGlossaryRo : filteredGlossaryEn); track g.term) {
              <div class="p-4 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-1.5 shadow-md">
                <div class="font-bold text-slate-50 font-mono text-sm text-emerald-400">{{ g.term }}</div>
                <p class="text-slate-300 font-sans leading-relaxed">{{ g.def }}</p>
              </div>
            }
          </div>
        </div>
      }

    </section>
  `
})
export class ArchitectureBlueprintComponent {
  ts = inject(TranslationService);
  activeTab: 'cloud' | 'vlan' | 'power' | 'storage' | 'cyber' | 'zerotrust' | 'generator' | 'chaos' | 'observability' | 'glossary' = 'cloud';

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
      tools: ['Windows Server 2025', 'Active Directory (AD DS)', 'Group Policy (GPO)', 'Linux (Debian / Ubuntu / Alpine / Talos)', 'Virtual Machines (KVM / Proxmox / UTM)']
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
      tools: ['Windows Server 2025', 'Active Directory (AD DS)', 'Politici de Grup (GPO)', 'Linux (Debian / Ubuntu / Alpine / Talos)', 'Mașini Virtuale (KVM / Proxmox / UTM)']
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
