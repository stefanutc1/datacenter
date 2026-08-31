import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopologyNode, TopologyLink, TOPOLOGY_NODES, TOPOLOGY_LINKS } from '../../data/topology.data';

@Component({
  selector: 'app-topology-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-full min-h-[580px] bg-gradient-to-b from-[#06090f] via-[#090e17] to-[#06090f] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col select-none">
      
      <!-- Top HUD Layer Controls -->
      <div class="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        <!-- Subsystem Layer Badges -->
        <div class="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#0d131f]/90 backdrop-blur-md border border-white/10 pointer-events-auto shadow-lg overflow-x-auto max-w-full">
          @for (cat of categories; track cat.id) {
            <button
              (click)="selectCategory(cat.id)"
              [class.bg-cyan-500]="activeCategory === cat.id"
              [class.text-black]="activeCategory === cat.id"
              [class.font-bold]="activeCategory === cat.id"
              [class.text-slate-400]="activeCategory !== cat.id"
              [class.hover:text-white]="activeCategory !== cat.id"
              class="px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all whitespace-nowrap"
            >
              {{ cat.label }}
            </button>
          }
        </div>

        <!-- Controls (Auto-Rotate, Perspective, Reset) -->
        <div class="flex items-center gap-2 pointer-events-auto font-mono text-xs">
          <!-- Logical / Physical Toggle -->
          <div class="flex items-center p-1 rounded-xl bg-[#0d131f]/90 backdrop-blur-md border border-white/10 shadow-lg">
            <button
              (click)="setPerspective('logical')"
              [class.bg-cyan-500]="perspective === 'logical'"
              [class.text-black]="perspective === 'logical'"
              [class.font-bold]="perspective === 'logical'"
              [class.text-slate-400]="perspective !== 'logical'"
              class="px-2.5 py-1 rounded-lg transition-colors"
            >
              LOGICAL
            </button>
            <button
              (click)="setPerspective('physical')"
              [class.bg-cyan-500]="perspective === 'physical'"
              [class.text-black]="perspective === 'physical'"
              [class.font-bold]="perspective === 'physical'"
              [class.text-slate-400]="perspective !== 'physical'"
              class="px-2.5 py-1 rounded-lg transition-colors"
            >
              PHYSICAL
            </button>
          </div>

          <!-- Auto-Rotate -->
          <button
            (click)="toggleAutoRotate()"
            [class.border-cyan-400]="isAutoRotating"
            [class.text-cyan-400]="isAutoRotating"
            class="px-3 py-2 rounded-xl bg-[#0d131f]/90 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 text-slate-300 transition-all flex items-center gap-1.5 shadow-lg"
            title="Toggle 3D auto-rotation"
          >
            <span class="w-2 h-2 rounded-full" [class.bg-cyan-400]="isAutoRotating" [class.bg-slate-600]="!isAutoRotating"></span>
            <span>ROTATE</span>
          </button>

          <!-- Reset Camera -->
          <button
            (click)="resetCamera()"
            class="px-3 py-2 rounded-xl bg-[#0d131f]/90 backdrop-blur-md border border-white/10 hover:border-white/30 text-slate-300 hover:text-white transition-all shadow-lg"
          >
            RESET
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
      <div class="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-3 font-mono text-[11px] text-slate-400">
        <div class="px-3 py-1.5 rounded-lg bg-[#0d131f]/85 backdrop-blur-md border border-white/10 shadow-md flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>CLUSTER MESH ACTIVE</span>
          <span class="text-white/30">|</span>
          <span class="text-white font-bold">{{ nodes.length }} NODES</span>
          <span class="text-white/30">|</span>
          <span class="text-cyan-400 font-bold">{{ links.length }} REALTIME PACKET FLOWS</span>
        </div>
      </div>

      <!-- Instructions Hint -->
      <div class="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:block font-mono text-[11px] text-slate-500">
        <span>DRAG TO ORBIT · SCROLL TO ZOOM · CLICK NODE TO INSPECT</span>
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
export class TopologyCanvasComponent implements OnInit, OnDestroy, OnChanges {
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
    { id: 'all', label: 'ALL INFRASTRUCTURE' },
    { id: 'compute', label: 'COMPUTE & HYPERVISORS' },
    { id: 'network', label: 'NETWORK & WAN' },
    { id: 'security', label: 'SECURITY & FIREWALL' },
    { id: 'services', label: 'SERVICES & LXC' },
    { id: 'elo', label: 'AI CONTROL PLANE' },
    { id: 'storage', label: 'STORAGE & ZFS' },
    { id: 'edge', label: 'EDGE SENSORS' }
  ];

  isAutoRotating = true;
  private animationFrameId: number | null = null;

  // 3D Camera & Transform State
  private angleX = 0.38;
  private angleY = -0.55;
  private zoom = 1.05;
  private fov = 650;
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private hoveredNode: TopologyNode | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.handleResize();
    window.addEventListener('resize', this.onWindowResize);

    // Run high-performance render loop outside Angular zone
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

  ngOnChanges(changes: SimpleChanges) {
    // If selectedNode changed from outside, we can smooth target it
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
    this.angleX = 0.38;
    this.angleY = -0.55;
    this.zoom = 1.05;
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
    // Apply Zoom
    x *= this.zoom;
    y *= this.zoom;
    z *= this.zoom;

    // Rotate around Y axis
    const cosY = Math.cos(this.angleY);
    const sinY = Math.sin(this.angleY);
    const x1 = x * cosY - z * sinY;
    const z1 = z * cosY + x * sinY;

    // Rotate around X axis
    const cosX = Math.cos(this.angleX);
    const sinX = Math.sin(this.angleX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = z1 * cosX + y * sinX;

    // Perspective projection
    const distance = this.fov + z2 + 400;
    const scale = distance > 10 ? this.fov / distance : 0.01;

    return {
      px: cx + x1 * scale,
      py: cy + y2 * scale,
      scale: Math.max(0.15, scale),
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

    // Draw Perspective 3D Grid Floor
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let gx = -350; gx <= 350; gx += 70) {
      const pStart = this.project3D(gx, 320, -350, cx, cy);
      const pEnd = this.project3D(gx, 320, 350, cx, cy);
      ctx.beginPath();
      ctx.moveTo(pStart.px, pStart.py);
      ctx.lineTo(pEnd.px, pEnd.py);
      ctx.stroke();
    }
    for (let gz = -350; gz <= 350; gz += 70) {
      const pStart = this.project3D(-350, 320, gz, cx, cy);
      const pEnd = this.project3D(350, 320, gz, cx, cy);
      ctx.beginPath();
      ctx.moveTo(pStart.px, pStart.py);
      ctx.lineTo(pEnd.px, pEnd.py);
      ctx.stroke();
    }

    const now = Date.now() * 0.0025;

    // Draw Vector Edges and Animated Packet Streams
    this.links.forEach((link, idx) => {
      const fromNode = this.nodes.find(n => n.id === link.from);
      const toNode = this.nodes.find(n => n.id === link.to);
      if (!fromNode || !toNode) return;

      const isFiltered = this.isLinkActive(fromNode, toNode);
      const alpha = isFiltered ? 0.75 : 0.12;

      const p1 = this.project3D(fromNode.x, fromNode.y, fromNode.z, cx, cy);
      const p2 = this.project3D(toNode.x, toNode.y, toNode.z, cx, cy);

      ctx.beginPath();
      ctx.strokeStyle = link.color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = Math.max(1, (isFiltered ? 2.5 : 1) * p1.scale);
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Animate packet stream if link is active
      if (isFiltered) {
        const progress = (now + idx * 0.22) % 1;
        const packetX = p1.px + (p2.px - p1.px) * progress;
        const packetY = p1.py + (p2.py - p1.py) * progress;
        
        ctx.beginPath();
        ctx.arc(packetX, packetY, Math.max(2, 4 * p1.scale), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
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
      const baseRadius = node.tier <= 2 ? 16 : 12;
      const radius = Math.max(6, baseRadius * node.scale);
      const alpha = node.isActive ? 1.0 : 0.2;

      ctx.globalAlpha = alpha;

      // Outer Pulse Ring when Selected or Hovered
      if (node.isSelected || node.isHovered) {
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Outer Aura Ring
      ctx.beginPath();
      ctx.arc(node.px, node.py, radius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = node.color;
      ctx.lineWidth = Math.max(1, 2 * node.scale);
      ctx.stroke();

      // Core Sphere
      ctx.beginPath();
      ctx.arc(node.px, node.py, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = node.isSelected ? 20 : (node.isActive ? 12 : 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Primary Node Name Label
      if (node.isActive || node.isSelected) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(10, Math.round(13 * node.scale))}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.px, node.py + radius + 15);

        // Sublabel / IP
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = `${Math.max(8, Math.round(10 * node.scale))}px monospace`;
        ctx.fillText(node.sublabel || node.ip, node.px, node.py + radius + 27);
      }

      ctx.globalAlpha = 1.0;
    });

    if (this.isAutoRotating && !this.isDragging) {
      this.angleY += 0.002;
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

  // Mouse Interactivity
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

    // Detect node hover
    let hovered: TopologyNode | null = null;
    for (const node of this.nodes) {
      const p = this.project3D(node.x, node.y, node.z, cx, cy);
      const dist = Math.hypot(p.px - mouseX, p.py - mouseY);
      if (dist < 25) {
        hovered = node;
        break;
      }
    }
    this.hoveredNode = hovered;

    if (this.isDragging) {
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;
      this.angleY += deltaX * 0.007;
      this.angleX = Math.max(-1.3, Math.min(1.3, this.angleX + deltaY * 0.007));
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  }

  onMouseUp(e: MouseEvent) {
    if (this.isDragging) {
      this.isDragging = false;
    }

    // Check click hit
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
    const delta = e.deltaY > 0 ? -0.06 : 0.06;
    this.zoom = Math.max(0.45, Math.min(2.4, this.zoom + delta));
  }
}
