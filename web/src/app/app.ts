import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { OverviewComponent } from './components/overview/overview.component';
import { TopologyCanvasComponent } from './components/topology-canvas/topology-canvas.component';
import { NodeInspectorComponent } from './components/node-inspector/node-inspector.component';
import { ServiceMatrixComponent } from './components/service-matrix/service-matrix.component';
import { HardwareFleetComponent } from './components/hardware-fleet/hardware-fleet.component';
import { ArchitectureBlueprintComponent } from './components/architecture-blueprint/architecture-blueprint.component';
import { TopologyNode } from './data/topology.data';
import { TranslationService } from './services/translation.service';

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
  styleUrls: ['./app.css']
})
export class App {
  ts = inject(TranslationService);
  selectedNode: TopologyNode | null = null;
  activeCategory: string = 'all';
  perspective: 'logical' | 'physical' = 'logical';

  onNodeSelected(node: TopologyNode | null) {
    this.selectedNode = node;
  }

  onCategoryChanged(cat: string) {
    this.activeCategory = cat;
  }

  onPerspectiveChanged(mode: 'logical' | 'physical') {
    this.perspective = mode;
  }
}
