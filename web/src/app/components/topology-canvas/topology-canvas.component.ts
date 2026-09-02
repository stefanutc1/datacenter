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
    <div class="space-y-4 font-sans">
      
      <!-- Section Title Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div class="space-y-1">
          <h2 class="text-2xl sm:text-3xl font-sans font-bold text-slate-50 tracking-tight">
            {{ ts.t.topologyTitle }}
          </h2>
        </div>
        <div class="text-xs text-slate-400 font-sans hidden sm:block">
          {{ ts.t.topologyDesc }}
        </div>
      </div>

      <!-- 3D Viewer Container (Optimized Proportions) -->
      <div class="relative w-full h-[620px] bg-[#0c0e11] rounded-2xl overflow-hidden border border-obsidian-750 shadow-2xl flex flex-col select-none">
        
        <!-- Top HUD Layer Controls -->
        <div class="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          
          <!-- Subsystem Layer Badges -->
          <div class="flex items-center gap-1.5 p-1.5 rounded-xl bg-obsidian-900/90 backdrop-blur-md border border-obsidian-700 pointer-events-auto shadow-lg overflow-x-auto max-w-full">
            @for (cat of getCategories(); track cat.id) {
              <button
                (click)="selectCategory(cat.id)"
                [class.bg-emerald-500]="activeCategory === cat.id"
                [class.text-slate-950]="activeCategory === cat.id"
                [class.font-bold]="activeCategory === cat.id"
                [class.text-slate-300]="activeCategory !== cat.id"
                [class.hover:text-slate-50]="activeCategory !== cat.id"
                class="px-3 py-1.5 rounded-lg text-xs font-sans transition-all whitespace-nowrap"
              >
                {{ cat.label }}
              </button>
            }
          </div>

          <!-- Controls (Auto-Rotate, Perspective, Reset) -->
          <div class="flex items-center gap-2 pointer-events-auto font-sans text-xs">
            <!-- Logical / Physical Toggle -->
            <div class="flex items-center p-1 rounded-xl bg-obsidian-900/90 backdrop-blur-md border border-obsidian-700 shadow-md font-medium">
              <button
                (click)="setPerspective('logical')"
                [class.bg-emerald-500]="perspective === 'logical'"
                [class.text-slate-950]="perspective === 'logical'"
                [class.font-bold]="perspective === 'logical'"
                [class.text-slate-300]="perspective !== 'logical'"
                class="px-2.5 py-1 rounded-lg transition-colors font-mono text-[11px]"
              >
                {{ ts.t.btnLogical }}
              </button>
              <button
                (click)="setPerspective('physical')"
                [class.bg-emerald-500]="perspective === 'physical'"
                [class.text-slate-950]="perspective === 'physical'"
                [class.font-bold]="perspective === 'physical'"
                [class.text-slate-300]="perspective !== 'physical'"
                class="px-2.5 py-1 rounded-lg transition-colors font-mono text-[11px]"
              >
                {{ ts.t.btnPhysical }}
              </button>
            </div>

            <!-- Auto-Rotate -->
            <button
              (click)="toggleAutoRotate()"
              [class.border-emerald-500]="isAutoRotating"
              [class.text-emerald-400]="isAutoRotating"
              class="px-3 py-2 rounded-xl bg-obsidian-900/90 backdrop-blur-md border border-obsidian-700 hover:border-emerald-400/50 text-slate-200 font-medium transition-all flex items-center gap-2 shadow-md font-mono text-xs"
              title="Toggle 3D auto-rotation"
            >
              <span class="w-2 h-2 rounded-full" [class.bg-emerald-500]="isAutoRotating" [class.bg-slate-600]="!isAutoRotating"></span>
              <span>{{ ts.t.btnRotate }}</span>
            </button>

            <!-- Reset Camera -->
            <button
              (click)="resetCamera()"
              class="px-3 py-2 rounded-xl bg-obsidian-900/90 backdrop-blur-md border border-obsidian-700 hover:border-slate-500 text-slate-200 hover:text-slate-50 font-medium transition-all shadow-md font-mono text-xs"
            >
              {{ ts.t.btnReset }}
            </button>
          </div>
        </div>

        <!-- 3D Canvas Viewport -->
        <canvas
          #canvasRef
          class="w-full h-full flex-1 cursor-grab active:cursor-grabbing block"
          (mousedown)="onMouseDown($event)"
          (mousemove)="onMouseMove($event)"
          (mouseup)="onMouseUp($event)"
          (mouseleave)="onMouseUp($event)"
          (wheel)="onWheel($event)"
        ></canvas>

        <!-- Bottom HUD Coordinates & Quick Stats -->
        <div class="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-3 font-mono text-xs text-slate-300">
          <div class="px-3.5 py-2 rounded-xl bg-obsidian-900/90 backdrop-blur-md border border-obsidian-700 shadow-md flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="font-bold text-slate-100 text-[11px]">{{ ts.t.meshActive }}</span>
            <span class="text-obsidian-600">|</span>
            <span class="text-slate-200">{{ nodes.length }} {{ ts.t.nodesLabel }}</span>
            <span class="text-obsidian-600">|</span>
            <span class="text-emerald-400">{{ links.length }} {{ ts.t.flowsLabel }}</span>
          </div>
        </div>

        <!-- Instructions Hint -->
        <div class="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:block font-mono text-[11px] text-slate-500">
          <span>{{ ts.t.interactionHint }}</span>
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
      { id: 'all', label: this.ts.t.catAll },
      { id: 'compute', label: this.ts.t.catCompute },
      { id: 'network', label: this.ts.t.catNetwork },
      { id: 'security', label: this.ts.t.catSecurity },
      { id: 'services', label: this.ts.t.catServices },
      { id: 'elo', label: this.ts.t.catElo },
      { id: 'storage', label: this.ts.t.catStorage },
      { id: 'edge', label: this.ts.t.catEdge }
    ];
  }

  isAutoRotating = true;
  private animationFrameId: number | null = null;

  // 3D Camera & Transform State (Natural, Well-Balanced Perspective)
  private angleX = 0.35;
  private angleY = -0.20;
  private zoom = 1.08;
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
    this.angleX = 0.35;
    this.angleY = -0.20;
    this.zoom = 1.08;
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

  private project3D(x: number, y: number, z: number, cx: number, cy: number, width: number, height: number) {
    // Responsive scaling factor to fill 70-80% of width/height naturally
    const responsiveScale = Math.min(Math.max(0.85, width / 950), 1.35);
    x *= this.zoom * responsiveScale;
    y *= this.zoom * responsiveScale * 0.82; // Harmonious vertical ratio
    z *= this.zoom * responsiveScale;

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
      scale: Math.max(0.35, scale),
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
    const cy = height / 2 - 10;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Native High-DPI Retina coordinate mapping
    ctx.clearRect(0, 0, width, height);

    // Draw Subtle Obsidian Coordinate Floor
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const floorY = 320;
    for (let gx = -420; gx <= 420; gx += 70) {
      const pStart = this.project3D(gx, floorY, -420, cx, cy, width, height);
      const pEnd = this.project3D(gx, floorY, 420, cx, cy, width, height);
      ctx.beginPath();
      ctx.moveTo(pStart.px, pStart.py);
      ctx.lineTo(pEnd.px, pEnd.py);
      ctx.stroke();
    }
    for (let gz = -420; gz <= 420; gz += 70) {
      const pStart = this.project3D(-420, floorY, gz, cx, cy, width, height);
      const pEnd = this.project3D(420, floorY, gz, cx, cy, width, height);
      ctx.beginPath();
      ctx.moveTo(pStart.px, pStart.py);
      ctx.lineTo(pEnd.px, pEnd.py);
      ctx.stroke();
    }

    const now = Date.now() * 0.002;

    // Draw Vector Edges and Data Streams
    this.links.forEach((link, idx) => {
      const fromNode = this.nodes.find(n => n.id === link.from);
      const toNode = this.nodes.find(n => n.id === link.to);
      if (!fromNode || !toNode) return;

      const isFiltered = this.isLinkActive(fromNode, toNode);
      const alpha = isFiltered ? 0.65 : 0.08;

      const p1 = this.project3D(fromNode.x, fromNode.y, fromNode.z, cx, cy, width, height);
      const p2 = this.project3D(toNode.x, toNode.y, toNode.z, cx, cy, width, height);

      ctx.beginPath();
      ctx.strokeStyle = link.color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = Math.max(1, (isFiltered ? 2.0 : 1) * p1.scale);
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Animate Packet Pulse
      if (isFiltered) {
        const progress = (now + idx * 0.25) % 1;
        const packetX = p1.px + (p2.px - p1.px) * progress;
        const packetY = p1.py + (p2.py - p1.py) * progress;

        ctx.beginPath();
        ctx.arc(packetX, packetY, Math.max(2.5, 4.0 * p1.scale), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
    });

    // Project and Depth-Sort Nodes
    const projectedNodes = this.nodes.map(n => {
      const p = this.project3D(n.x, n.y, n.z, cx, cy, width, height);
      const isSelected = this.selectedNode?.id === n.id;
      const isHovered = this.hoveredNode?.id === n.id;
      const isActive = this.isNodeActive(n);
      return { ...n, ...p, isSelected, isHovered, isActive };
    }).sort((a, b) => b.zOrder - a.zOrder);

    // Draw Nodes
    projectedNodes.forEach(node => {
      const baseRadius = node.tier <= 2 ? 14 : 9;
      const radius = Math.max(5.5, baseRadius * node.scale);
      const alpha = node.isActive ? 1.0 : 0.2;

      ctx.globalAlpha = alpha;

      // Selection Ring
      if (node.isSelected || node.isHovered) {
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Outer Ring
      ctx.beginPath();
      ctx.arc(node.px, node.py, radius + 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = node.color;
      ctx.lineWidth = Math.max(1.2, 1.6 * node.scale);
      ctx.stroke();

      // Core Circle
      ctx.beginPath();
      ctx.arc(node.px, node.py, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Draw Clean Typography Badges with Geist
      const shouldDrawLabel = node.tier <= 2 || node.isSelected || node.isHovered || (this.activeCategory !== 'all' && node.isActive);

      if (shouldDrawLabel) {
        const fontSize = Math.max(10, Math.round(11.5 * node.scale));
        ctx.font = `600 ${fontSize}px "Geist", "Inter", sans-serif`;
        ctx.textAlign = 'center';

        const label = node.name;
        const textWidth = ctx.measureText(label).width;
        const padX = 6;
        const padY = 3;
        const badgeY = node.py + radius + 13;

        // Clean Obsidian pill background
        ctx.fillStyle = 'rgba(12, 14, 17, 0.92)';
        ctx.beginPath();
        ctx.roundRect(
          node.px - textWidth / 2 - padX,
          badgeY - fontSize / 2 - padY,
          textWidth + padX * 2,
          fontSize + padY * 2,
          4
        );
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label Text
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(label, node.px, badgeY + fontSize / 3.2);

        // Sublabel if selected or hovered
        if (node.isSelected || node.isHovered) {
          const subFontSize = Math.max(9, Math.round(9.5 * node.scale));
          ctx.font = `400 ${subFontSize}px "IBM Plex Mono", monospace`;
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(node.sublabel || node.ip, node.px, badgeY + fontSize + 12);
        }
      }

      ctx.globalAlpha = 1.0;
    });

    ctx.restore();

    if (this.isAutoRotating && !this.isDragging) {
      this.angleY += 0.0015;
    }

    this.animationFrameId = requestAnimationFrame(this.render);
  };

  private isNodeActive(node: TopologyNode): boolean {
    if (this.selectedNode && this.selectedNode.id === node.id) return true;
    if (this.selectedNode && this.selectedNode.connections.includes(node.id)) return true;

    if (this.perspective === 'physical') {
      return node.tier <= 2 || node.tier === 7;
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
    const cy = rect.height / 2 - 10;

    let hovered: TopologyNode | null = null;
    for (const node of this.nodes) {
      const p = this.project3D(node.x, node.y, node.z, cx, cy, rect.width, rect.height);
      const dist = Math.hypot(p.px - mouseX, p.py - mouseY);
      if (dist < 22) {
        hovered = node;
        break;
      }
    }
    this.hoveredNode = hovered;

    if (this.isDragging) {
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;
      this.angleY += deltaX * 0.005;
      this.angleX = Math.max(-1.1, Math.min(1.1, this.angleX + deltaY * 0.005));
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
    const cy = rect.height / 2 - 10;

    let clicked: TopologyNode | null = null;
    for (const node of this.nodes) {
      const p = this.project3D(node.x, node.y, node.z, cx, cy, rect.width, rect.height);
      const dist = Math.hypot(p.px - mouseX, p.py - mouseY);
      if (dist < 24) {
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
