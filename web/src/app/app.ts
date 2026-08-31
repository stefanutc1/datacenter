import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { OverviewComponent } from './components/overview/overview.component';
import { TopologyCanvasComponent } from './components/topology-canvas/topology-canvas.component';
import { NodeInspectorComponent } from './components/node-inspector/node-inspector.component';
import { ServiceMatrixComponent } from './components/service-matrix/service-matrix.component';
import { HardwareFleetComponent } from './components/hardware-fleet/hardware-fleet.component';
import { ArchitectureBlueprintComponent } from './components/architecture-blueprint/architecture-blueprint.component';
import { TopologyNode } from './data/topology.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    OverviewComponent,
    TopologyCanvasComponent,
    NodeInspectorComponent,
    ServiceMatrixComponent,
    HardwareFleetComponent,
    ArchitectureBlueprintComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  selectedNode: TopologyNode | null = null;
  activeCategory: string = 'all';
  perspective: 'logical' | 'physical' = 'logical';

  onNodeSelected(node: TopologyNode | null) {
    this.selectedNode = node;
  }

  onCategoryChanged(category: string) {
    this.activeCategory = category;
  }

  onPerspectiveChanged(perspective: 'logical' | 'physical') {
    this.perspective = perspective;
  }
}
