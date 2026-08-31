import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopologyNode, TopologyLink, TOPOLOGY_NODES, TOPOLOGY_LINKS } from '../../data/topology.data';

@Component({
  selector: 'app-topology-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-full min-h-[580px] bg-gradient-to-b from-[#18130e] via-[#140f0a] to-[#0f0c08] rounded-2xl overflow-hidden border border-clay-700/40 shadow-2xl flex flex-col select-none font-sans">
      
      <!-- Top HUD Layer Controls -->
      <div class="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        <!-- Subsystem Layer Badges -->
        <div class="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#1e1711]/90 backdrop-blur-md border border-clay-700/50 pointer-events-auto shadow-lg overflow-x-auto max-w-full">
          @for (cat of categories; track cat.id) {
            <button
              (click)="selectCategory(cat.id)"
              [class.bg-terracotta-500]="activeCategory === cat.id"
              [class.text-sand-50]="activeCategory === cat.id"
              [class.font-bold]="activeCategory === cat.id"
              [class.text-sand-300]="activeCategory !== cat.id"
              [class.hover:text-sand-50]="activeCategory !== cat.id"
              class="px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium tracking-normal transition-all whitespace-nowrap"
            >
              {{ cat.label }}
            </button>
          }
        </div>

        <!-- Controls (Auto-Rotate, Perspective, Reset) -->
        <div class="flex items-center gap-2 pointer-events-auto font-sans text-xs">
          <!-- Logical / Physical Toggle -->
          <div class="flex items-center p-1 rounded-xl bg-[#1e1711]/90 backdrop-blur-md border border-clay-700/50 shadow-lg font-medium">
            <button
              (click)="setPerspective('logical')"
              [class.bg-terracotta-500]="perspective === 'logical'"
              [class.text-sand-50]="perspective === 'logical'"
              [class.font-bold]="perspective === 'logical'"
              [class.text-sand-300]="perspective !== 'logical'"
              class="px-3 py-1 rounded-lg transition-colors"
            >
              Logical
            </button>
            <button
              (click)="setPerspective('physical')"
              [class.bg-terracotta-500]="perspective === 'physical'"
              [class.text-sand-50]="perspective === 'physical'"
              [class.font-bold]="perspective === 'physical'"
              [class.text-sand-300]="perspective !== 'physical'"
              class="px-3 py-1 rounded-lg transition-colors"
            >
              Physical
            </button>
          </div>

          <!-- Auto-Rotate -->
          <button
            (click)="toggleAutoRotate()"
            [class.border-terracotta-500]="isAutoRotating"
            [class.text-terracotta-400]="isAutoRotating"
            class="px-3.5 py-2 rounded-xl bg-[#1e1711]/90 backdrop-blur-md border border-clay-700/50 hover:border-terracotta-400/50 text-sand-200 font-medium transition-all flex items-center gap-2 shadow-lg"
            title="Toggle 3D auto-rotation"
          >
            <span class="w-2 h-2 rounded-full" [class.bg-terracotta-500]="isAutoRotating" [class.bg-clay-500]="!isAutoRotating"></span>
            <span>Rotate</span>
          </button>

          <!-- Reset Camera -->
          <button
            (click)="resetCamera()"
            class="px-3.5 py-2 rounded-xl bg-[#1e1711]/90 backdrop-blur-md border border-clay-700/50 hover:border-clay-400 text-sand-200 hover:text-sand-50 font-medium transition-all shadow-lg"
          >
            Reset
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
      <div class="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-3 font-sans text-xs text-sand-300">
        <div class="px-3.5 py-2 rounded-xl bg-[#1e1711]/90 backdrop-blur-md border border-clay-700/50 shadow-md flex items-center gap-2.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-bold text-sand-100">Cluster Mesh Active</span>
          <span class="text-clay-500">|</span>
          <span class="text-sand-100 font-medium">{{ nodes.length }} Nodes</span>
          <span class="text-clay-500">|</span>
          <span class="text-terracotta-400 font-medium">{{ links.length }} Live Packet Streams</span>
        </div>
      </div>

      <!-- Instructions Hint -->
      <div class="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:block font-sans text-xs text-sand-400">
        <span>Drag to orbit · Scroll to zoom · Click node to inspect</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
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

  nodes: TopologyNode[] = TOPOLOGY_NODES;
  links: TopologyLink[] = TOPOLOGY_LINKS;

  categories = [
    { id: 'all', label: 'All Infrastructure' },
    { id: 'compute', label: 'Compute & Hypervisors' },
    { id: 'network', label: 'Network & WAN' },
    { id: 'security', label: 'Security & Firewall' },
    { id: 'services', label: 'Services & Workloads' },
    { id: 'elo', label: 'AI Control Plane' },
    { id: 'storage', label: 'Storage & ZFS' },
    { id: 'edge', label: 'Edge Sensors' }
  ];

  isAutoRotating = true;
  private animationFrameId: number | null = null;

  // 3D Camera & Transform State (Spacious 3D View)
  private angleX = 0.42;
  private angleY = -0.15;
  private zoom = 0.95;
  private fov = 700;
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
    this.angleY = -0.15;
    this.zoom = 0.95;
    this.activeCategory = 'all';
    this.categoryChanged.emit('all');
    this.nodeSelected.emit(null);
  }

  private handleResize() {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
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

    const distance = this.fov + z2 + 450;
    const scale = distance > 10 ? this.fov / distance : 0.01;

    return {
      px: cx + x1 * scale,
      py: cy + y2 * scale,
      scale: Math.max(0.18, scale),
      zOrder: z2
    };
  }

  private render = () => {
    const canvas = this.canvasRef.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw Warm Perspective Coordinate Floor
    ctx.strokeStyle = 'rgba(208, 99, 50, 0.06)';
    ctx.lineWidth = 1;
    for (let gx = -450; gx <= 450; gx += 75) {
      const pStart = this.project3D(gx, 340, -450, cx, cy);
      const pEnd = this.project3D(gx, 340, 450, cx, cy);
      ctx.beginPath();
      ctx.moveTo(pStart.px, pStart.py);
      ctx.lineTo(pEnd.px, pEnd.py);
      ctx.stroke();
    }
    for (let gz = -450; gz <= 450; gz += 75) {
      const pStart = this.project3D(-450, 340, gz, cx, cy);
      const pEnd = this.project3D(450, 340, gz, cx, cy);
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
      const alpha = isFiltered ? 0.7 : 0.1;

      const p1 = this.project3D(fromNode.x, fromNode.y, fromNode.z, cx, cy);
      const p2 = this.project3D(toNode.x, toNode.y, toNode.z, cx, cy);

      ctx.beginPath();
      ctx.strokeStyle = link.color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = Math.max(1, (isFiltered ? 2.2 : 1) * p1.scale);
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
        ctx.arc(packetX, packetY, Math.max(2.5, 4.5 * p1.scale), 0, Math.PI * 2);
        ctx.fillStyle = '#faf8f5';
        ctx.shadowColor = link.color;
        ctx.shadowBlur = 8;
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

    // Draw Nodes
    projectedNodes.forEach(node => {
      const baseRadius = node.tier <= 2 ? 16 : 11;
      const radius = Math.max(6, baseRadius * node.scale);
      const alpha = node.isActive ? 1.0 : 0.25;

      ctx.globalAlpha = alpha;

      // Selection Aura
      if (node.isSelected || node.isHovered) {
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = '#d06332';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Outer Ring
      ctx.beginPath();
      ctx.arc(node.px, node.py, radius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = node.color;
      ctx.lineWidth = Math.max(1.2, 2 * node.scale);
      ctx.stroke();

      // Core Circle
      ctx.beginPath();
      ctx.arc(node.px, node.py, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = node.isSelected ? 18 : (node.isActive ? 10 : 0);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Clean Typography Badges with Geist / Inter
      const shouldDrawLabel = node.tier <= 2 || node.isSelected || node.isHovered || (this.activeCategory !== 'all' && node.isActive);

      if (shouldDrawLabel) {
        const fontSize = Math.max(11, Math.round(13 * node.scale));
        ctx.font = `600 ${fontSize}px "Geist", "Inter", -apple-system, sans-serif`;
        ctx.textAlign = 'center';

        const label = node.name;
        const textWidth = ctx.measureText(label).width;
        const padX = 8;
        const padY = 4;
        const badgeY = node.py + radius + 15;

        // Semi-transparent pill background to prevent visual overlap
        ctx.fillStyle = 'rgba(20, 16, 12, 0.9)';
        ctx.beginPath();
        ctx.roundRect(
          node.px - textWidth / 2 - padX,
          badgeY - fontSize / 2 - padY,
          textWidth + padX * 2,
          fontSize + padY * 2,
          6
        );
        ctx.fill();
        ctx.strokeStyle = 'rgba(222, 203, 180, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label Text
        ctx.fillStyle = '#faf8f5';
        ctx.fillText(label, node.px, badgeY + fontSize / 3.2);

        // Sublabel if selected or hovered
        if (node.isSelected || node.isHovered) {
          const subFontSize = Math.max(10, Math.round(11 * node.scale));
          ctx.font = `400 ${subFontSize}px "Geist Mono", "JetBrains Mono", monospace`;
          ctx.fillStyle = '#c4b5a2';
          ctx.fillText(node.sublabel || node.ip, node.px, badgeY + fontSize + 14);
        }
      }

      ctx.globalAlpha = 1.0;
    });

    if (this.isAutoRotating && !this.isDragging) {
      this.angleY += 0.0016;
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
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const mouseX = (e.clientX - rect.left) * dpr;
    const mouseY = (e.clientY - rect.top) * dpr;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    let hovered: TopologyNode | null = null;
    for (const node of this.nodes) {
      const p = this.project3D(node.x, node.y, node.z, cx, cy);
      const dist = Math.hypot(p.px - mouseX, p.py - mouseY);
      if (dist < 26) {
        hovered = node;
        break;
      }
    }
    this.hoveredNode = hovered;

    if (this.isDragging) {
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;
      this.angleY += deltaX * 0.006;
      this.angleX = Math.max(-1.2, Math.min(1.2, this.angleX + deltaY * 0.006));
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  }

  onMouseUp(e: MouseEvent) {
    if (this.isDragging) {
      this.isDragging = false;
    }

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const mouseX = (e.clientX - rect.left) * dpr;
    const mouseY = (e.clientY - rect.top) * dpr;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    let clicked: TopologyNode | null = null;
    for (const node of this.nodes) {
      const p = this.project3D(node.x, node.y, node.z, cx, cy);
      const dist = Math.hypot(p.px - mouseX, p.py - mouseY);
      if (dist < 28) {
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
    this.zoom = Math.max(0.4, Math.min(2.5, this.zoom + delta));
  }
}
