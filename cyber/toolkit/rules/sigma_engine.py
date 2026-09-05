"""Sigma detection rule evaluator and translator."""

from typing import Dict, Any, List

class SigmaEngine:
    """Evaluates events against Sigma rule conditions."""

    @staticmethod
    def evaluate_event(rule: Dict[str, Any], event_data: Dict[str, Any]) -> bool:
        detection = rule.get("detection", {})
        selection = detection.get("selection", {})
        
        for key, expected in selection.items():
            actual = event_data.get(key)
            if actual is None:
                return False
            if isinstance(expected, list):
                if str(actual) not in [str(e) for e in expected]:
                    return False
            else:
                if str(actual) != str(expected):
                    return False
        return True
