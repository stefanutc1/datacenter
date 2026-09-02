import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  NgZone,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopologyNode, TopologyLink, TOPOLOGY_NODES, TOPOLOGY_LINKS } from '../../data/topology.data';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-topology-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="topology-section" class="w-full space-y-3 font-sans">
      
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div class="space-y-1">
          <div class="text-xs font-mono font-bold tracking-widest text-[#ef4444] uppercase">
            NETWORK TOPOLOGY
          </div>
          <h2 class="text-3xl sm:text-4xl font-serif text-slate-100 font-normal tracking-tight">
            Spatial 3D Network Visualization
          </h2>
        </div>
        <div class="text-xs text-slate-400 font-sans max-w-sm text-right leading-relaxed hidden sm:block">
          Click on nodes to inspect technical specifications, network relations, and configuration manifests.
        </div>
      </div>

      <!-- Main 3D Container Card -->
      <div class="relative w-full h-[620px] bg-[#08090b] rounded-2xl overflow-hidden border border-obsidian-750 shadow-2xl flex flex-col select-none">
        
        <!-- Top Controls & Subsystem Filters Bar -->
        <div class="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          
          <!-- Filter Categories -->
          <div class="flex items-center gap-1.5 p-1 rounded-xl bg-obsidian-950/90 backdrop-blur-md border border-obsidian-750 pointer-events-auto shadow-xl overflow-x-auto max-w-full">
            @for (cat of getCategories(); track cat.id) {
              <button
                (click)="selectCategory(cat.id)"
                [class.border-red-500]="activeCategory === cat.id"
                [class.bg-red-500/10]="activeCategory === cat.id"
                [class.text-red-400]="activeCategory === cat.id"
                [class.font-semibold]="activeCategory === cat.id"
                [class.border-transparent]="activeCategory !== cat.id"
                [class.text-slate-400]="activeCategory !== cat.id"
                [class.hover:text-slate-200]="activeCategory !== cat.id"
                class="px-3 py-1.5 rounded-lg text-xs font-sans transition-all border whitespace-nowrap"
              >
                {{ cat.label }}
              </button>
            }
          </div>

          <!-- Controls (Logical/Physical, Rotate, Reset) -->
          <div class="flex items-center gap-2 pointer-events-auto font-sans text-xs">
            
            <!-- Logical / Physical Toggle -->
            <div class="flex items-center p-1 rounded-xl bg-obsidian-950/90 backdrop-blur-md border border-obsidian-750 shadow-xl font-medium">
              <button
                (click)="setPerspective('logical')"
                [class.bg-obsidian-800]="perspective === 'logical'"
                [class.text-slate-100]="perspective === 'logical'"
                [class.border-obsidian-600]="perspective === 'logical'"
                [class.text-slate-400]="perspective !== 'logical'"
                class="px-3 py-1 rounded-lg transition-all border border-transparent"
              >
                Logical
              </button>
              <button
                (click)="setPerspective('physical')"
                [class.bg-obsidian-800]="perspective === 'physical'"
                [class.text-slate-100]="perspective === 'physical'"
                [class.border-obsidian-600]="perspective === 'physical'"
                [class.text-slate-400]="perspective !== 'physical'"
                class="px-3 py-1 rounded-lg transition-all border border-transparent"
              >
                Physical
              </button>
            </div>

            <!-- Auto-Rotate -->
            <button
              (click)="toggleAutoRotate()"
              [class.border-red-500/50]="isAutoRotating"
              [class.text-red-400]="isAutoRotating"
              [class.border-obsidian-750]="!isAutoRotating"
              [class.text-slate-300]="!isAutoRotating"
              class="px-3.5 py-1.5 rounded-xl bg-obsidian-950/90 backdrop-blur-md border hover:border-red-500/50 transition-all flex items-center gap-2 shadow-xl"
            >
              <span class="w-2 h-2 rounded-full" [class.bg-red-500]="isAutoRotating" [class.shadow-[0_0_8px_rgba(239,68,68,0.8)]]="isAutoRotating" [class.bg-slate-600]="!isAutoRotating"></span>
              <span>Rotate</span>
            </button>

            <!-- Reset -->
            <button
              (click)="resetCamera()"
              class="px-3.5 py-1.5 rounded-xl bg-obsidian-950/90 backdrop-blur-md border border-obsidian-750 hover:border-slate-500 text-slate-300 hover:text-slate-100 transition-all shadow-xl"
            >
              Reset
            </button>
          </div>
        </div>

        <!-- 3D Interactive Canvas -->
        <canvas
          #canvasRef
          class="w-full h-full flex-1 cursor-grab active:cursor-grabbing block"
          (mousedown)="onMouseDown($event)"
          (mousemove)="onMouseMove($event)"
          (mouseup)="onMouseUp($event)"
          (mouseleave)="onMouseUp($event)"
          (wheel)="onWheel($event)"
        ></canvas>

        <!-- Bottom Status HUD -->
        <div class="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between font-mono text-[11px]">
          <div class="flex items-center gap-2 text-slate-300">
            <span class="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
            <span class="tracking-wide">ACTIVE NETWORK | {{ nodes.length }} NODES | {{ links.length }} LINKS</span>
          </div>

          <div class="text-slate-500 text-[10px] uppercase tracking-wider hidden sm:block font-sans">
            DRAG TO ROTATE · SCROLL TO ZOOM · CLICK FOR DETAILS
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class TopologyCanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() selectedNode: TopologyNode | null = null;
  @Input() activeCategory: string = 'all';
  @Input() perspective: 'logical' | 'physical' = 'logical';

  @Output() nodeSelected = new EventEmitter<TopologyNode | null>();
  @Output() categoryChanged = new EventEmitter<string>();
  @Output() perspectiveChanged = new EventEmitter<'logical' | 'physical'>();

  ts = inject(TranslationService);

  nodes: TopologyNode[] = TOPOLOGY_NODES;
  links: TopologyLink[] = TOPOLOGY_LINKS;

  getCategories() {
    return [
      { id: 'all', label: 'All Layers' },
      { id: 'compute', label: 'Compute & Hypervisors' },
      { id: 'network', label: 'Network & Ingress' },
      { id: 'security', label: 'Security & Cyber' },
      { id: 'services', label: 'Core Services' },
      { id: 'elo', label: 'AI Control Plane' },
      { id: 'storage', label: 'Storage & ZFS' },
      { id: 'edge', label: 'Edge Sensors' }
    ];
  }

  isAutoRotating = true;
  private animationFrameId: number | null = null;

  // 3D Camera Angles matching exact screenshot
  private angleX = 0.42;
  private angleY = -0.32;
  private zoom = 1.0;
  private fov = 680;
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private hoveredNode: TopologyNode | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.handleResize();
    window.addEventListener('resize', this.onWindowResize);

    this.ngZone.runOutsideAngular(() => {
      this.render();
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private onWindowResize = () => {
    this.handleResize();
  };

  selectCategory(catId: string) {
    this.activeCategory = catId;
    this.categoryChanged.emit(catId);
  }

  setPerspective(mode: 'logical' | 'physical') {
    this.perspective = mode;
    this.perspectiveChanged.emit(mode);
  }

  toggleAutoRotate() {
    this.isAutoRotating = !this.isAutoRotating;
  }

  resetCamera() {
    this.angleX = 0.42;
    this.angleY = -0.32;
    this.zoom = 1.0;
    this.activeCategory = 'all';
    this.categoryChanged.emit('all');
    this.nodeSelected.emit(null);
  }

  private handleResize() {
    const canvas = this.canvasRef?.nativeElement;
    const parent = canvas?.parentElement;
    if (canvas && parent) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
    }
  }

  private project3D(x: number, y: number, z: number, cx: number, cy: number) {
    x *= this.zoom;
    y *= this.zoom;
    z *= this.zoom;

    // Rotate Y
    const cosY = Math.cos(this.angleY);
    const sinY = Math.sin(this.angleY);
    const x1 = x * cosY - z * sinY;
    const z1 = z * cosY + x * sinY;

    // Rotate X
    const cosX = Math.cos(this.angleX);
    const sinX = Math.sin(this.angleX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = z1 * cosX + y * sinX;

    const distance = this.fov + z2 + 320;
    const scale = distance > 10 ? this.fov / distance : 0.01;

    return {
      px: cx + x1 * scale,
      py: cy + y2 * scale,
      scale: Math.max(0.2, scale),
      zOrder: z2
    };
  }

  private render = () => {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const cx = width / 2;
    const cy = height / 2 + 15;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Draw Subtle Red Perspective Floor Grid
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.08)';
    ctx.lineWidth = 1;
    const floorY = 220;
    for (let gx = -380; gx <= 380; gx += 65) {
      const pStart = this.project3D(gx, floorY, -380, cx, cy);
      const pEnd = this.project3D(gx, floorY, 380, cx, cy);
      ctx.beginPath();
      ctx.moveTo(pStart.px, pStart.py);
      ctx.lineTo(pEnd.px, pEnd.py);
      ctx.stroke();
    }
    for (let gz = -380; gz <= 380; gz += 65) {
      const pStart = this.project3D(-380, floorY, gz, cx, cy);
      const pEnd = this.project3D(380, floorY, gz, cx, cy);
      ctx.beginPath();
      ctx.moveTo(pStart.px, pStart.py);
      ctx.lineTo(pEnd.px, pEnd.py);
      ctx.stroke();
    }

    const now = Date.now() * 0.002;

    // Draw Vector Edges and Data Stream Packets
    this.links.forEach((link, idx) => {
      const fromNode = this.nodes.find(n => n.id === link.from);
      const toNode = this.nodes.find(n => n.id === link.to);
      if (!fromNode || !toNode) return;

      const isFiltered = this.isLinkActive(fromNode, toNode);
      const alpha = isFiltered ? 0.65 : 0.06;

      const p1 = this.project3D(fromNode.x, fromNode.y, fromNode.z, cx, cy);
      const p2 = this.project3D(toNode.x, toNode.y, toNode.z, cx, cy);

      ctx.beginPath();
      ctx.strokeStyle = link.color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = Math.max(0.8, (isFiltered ? 1.8 : 0.8) * p1.scale);
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Animate Packet Pulses
      if (isFiltered) {
        const progress = (now + idx * 0.22) % 1;
        const packetX = p1.px + (p2.px - p1.px) * progress;
        const packetY = p1.py + (p2.py - p1.py) * progress;

        ctx.beginPath();
        ctx.arc(packetX, packetY, Math.max(1.8, 3.2 * p1.scale), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = link.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Project and Depth-Sort Nodes
    const projectedNodes = this.nodes.map(n => {
      const p = this.project3D(n.x, n.y, n.z, cx, cy);
      const isSelected = this.selectedNode?.id === n.id;
      const isHovered = this.hoveredNode?.id === n.id;
      const isActive = this.isNodeActive(n);
      return { ...n, ...p, isSelected, isHovered, isActive };
    }).sort((a, b) => b.zOrder - a.zOrder);

    // Draw Spheres and Typography
    projectedNodes.forEach(node => {
      const baseRadius = node.tier <= 2 ? 13 : 9.5;
      const radius = Math.max(4.5, baseRadius * node.scale);
      const alpha = node.isActive ? 1.0 : 0.2;

      ctx.globalAlpha = alpha;

      // Outer Selection Ring & Glow
      if (node.isSelected || node.isHovered) {
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(node.px, node.py, radius + 10, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.12;
        ctx.fill();
        ctx.globalAlpha = alpha;
      }

      // Solid Node Sphere with Color Glow
      ctx.beginPath();
      ctx.arc(node.px, node.py, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = node.isActive ? 10 : 2;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Center bright specular core
      ctx.beginPath();
      ctx.arc(node.px, node.py, Math.max(1.5, radius * 0.35), 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Node Typography Label (matching screenshot style)
      const shouldDrawLabel = node.tier <= 2 || node.isSelected || node.isHovered || (this.activeCategory !== 'all' && node.isActive) || node.scale > 0.85;

      if (shouldDrawLabel) {
        const fontSize = Math.max(9, Math.round(11 * node.scale));
        ctx.font = `500 ${fontSize}px "JetBrains Mono", "Geist", monospace, sans-serif`;
        ctx.textAlign = 'center';

        // Drop shadow for crisp readability
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillStyle = node.isSelected ? '#ffffff' : node.isHovered ? '#ffffff' : 'rgba(237, 230, 222, 0.92)';
        ctx.fillText(node.name, node.px, node.py + radius + 13);
        ctx.shadowBlur = 0;

        if (node.isSelected || node.isHovered) {
          const subFontSize = Math.max(8, Math.round(9 * node.scale));
          ctx.font = `400 ${subFontSize}px "JetBrains Mono", monospace`;
          ctx.fillStyle = 'rgba(164, 148, 126, 0.85)';
          ctx.fillText(node.sublabel || node.ip, node.px, node.py + radius + 25);
        }
      }

      ctx.globalAlpha = 1.0;
    });

    ctx.restore();

    if (this.isAutoRotating && !this.isDragging) {
      this.angleY += 0.0014;
    }

    this.animationFrameId = requestAnimationFrame(this.render);
  };

  private isNodeActive(node: TopologyNode): boolean {
    if (this.selectedNode && this.selectedNode.id === node.id) return true;
    if (this.selectedNode && this.selectedNode.connections.includes(node.id)) return true;

    if (this.perspective === 'physical') {
      return node.tier <= 2 || node.tier === 6;
    }

    if (this.activeCategory === 'all') return true;
    return node.category === this.activeCategory;
  }

  private isLinkActive(from: TopologyNode, to: TopologyNode): boolean {
    return this.isNodeActive(from) && this.isNodeActive(to);
  }

  onMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.previousMousePosition = { x: e.clientX, y: e.clientY };
  }

  onMouseMove(e: MouseEvent) {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2 + 15;

    let hovered: TopologyNode | null = null;
    for (const node of this.nodes) {
      const p = this.project3D(node.x, node.y, node.z, cx, cy);
      const dist = Math.hypot(p.px - mouseX, p.py - mouseY);
      if (dist < 20) {
        hovered = node;
        break;
      }
    }
    this.hoveredNode = hovered;

    if (this.isDragging) {
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;
      this.angleY += deltaX * 0.006;
      this.angleX = Math.max(-0.9, Math.min(0.9, this.angleX + deltaY * 0.006));
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  }

  onMouseUp(e: MouseEvent) {
    if (this.isDragging) {
      this.isDragging = false;
    }

    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2 + 15;

    let clicked: TopologyNode | null = null;
    for (const node of this.nodes) {
      const p = this.project3D(node.x, node.y, node.z, cx, cy);
      const dist = Math.hypot(p.px - mouseX, p.py - mouseY);
      if (dist < 22) {
        clicked = node;
        break;
      }
    }

    if (clicked) {
      this.ngZone.run(() => {
        this.selectedNode = clicked;
        this.nodeSelected.emit(clicked);
      });
    }
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    this.zoom = Math.max(0.5, Math.min(2.2, this.zoom + delta));
  }
}
