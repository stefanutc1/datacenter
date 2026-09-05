"""Investigation graph builder mapping entity relationships."""

from typing import List, Dict, Any
from cyber.core.models import Artifact, Indicator, GraphNode, GraphEdge

class InvestigationGraph:
    """Builds a directed entity graph linking IPs, domains, users, files, and findings."""

    def __init__(self):
        self.nodes: Dict[str, GraphNode] = {}
        self.edges: List[GraphEdge] = []

    def add_node(self, node_id: str, label: str, node_type: str, properties: Dict[str, Any] = None) -> GraphNode:
        if node_id not in self.nodes:
            self.nodes[node_id] = GraphNode(id=node_id, label=label, node_type=node_type, properties=properties or {})
        return self.nodes[node_id]

    def add_edge(self, source_id: str, target_id: str, relationship: str, properties: Dict[str, Any] = None) -> GraphEdge:
        edge = GraphEdge(source_id=source_id, target_id=target_id, relationship=relationship, properties=properties or {})
        self.edges.append(edge)
        return edge

    def build_from_indicators(self, indicators: List[Indicator]):
        for ind in indicators:
            node_id = f"ioc_{ind.value}"
            self.add_node(node_id, ind.value, ind.type.value, {"description": ind.description})
            
            # Link to provenance source
            src_node_id = f"src_{ind.provenance}"
            self.add_node(src_node_id, ind.provenance, "evidence_source")
            self.add_edge(src_node_id, node_id, "extracted_indicator")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "nodes": [n.to_dict() for n in self.nodes.values()],
            "edges": [e.to_dict() for e in self.edges]
        }
