"""Super-timeline generator aggregating chronological events across artifacts."""

from typing import List
from cyber.core.models import Artifact, TimelineEvent, Severity, ConfidenceLevel

class TimelineGenerator:
    """Aggregates and sorts chronological events from normalized artifacts."""

    @staticmethod
    def from_artifacts(artifacts: List[Artifact]) -> List[TimelineEvent]:
        events = []
        for art in artifacts:
            data = art.normalized_data
            ts = data.get("timestamp") or art.timestamp

            # Determine event description & type based on artifact
            if art.artifact_type == "auth_relay_session":
                events.append(TimelineEvent(
                    timestamp=ts,
                    source="OpenID Relay Sensor",
                    event_type="AUTH_TOKEN_RELAY",
                    description=f"BitM session relay captured for user {data.get('username', 'victim')} (TOTP: {data.get('totp_code')})",
                    host="phishing-c2.net",
                    user=data.get("username"),
                    severity=Severity.CRITICAL,
                    artifact_id=art.artifact_id
                ))
            elif art.artifact_type == "sip_telephony_trace":
                events.append(TimelineEvent(
                    timestamp=ts,
                    source="SIP Gateway Telemetry",
                    event_type="SPOOFED_SIP_INVITE",
                    description=f"Spoofed SIP INVITE received from carrier {data.get('carrier_ip')} for identity {data.get('p_asserted_identity')}",
                    host=data.get("carrier_ip"),
                    severity=Severity.CRITICAL,
                    artifact_id=art.artifact_id
                ))
            elif art.artifact_type == "api_config_exposure":
                events.append(TimelineEvent(
                    timestamp=ts,
                    source="API Configuration Audit",
                    event_type="KILLSWITCH_ACTIVATION",
                    description=f"Withdrawal kill-switch verified active on {data.get('endpoint')} with TRC-20 deposit address {data.get('deposit_wallet')}",
                    severity=Severity.HIGH,
                    artifact_id=art.artifact_id
                ))
            else:
                events.append(TimelineEvent(
                    timestamp=ts,
                    source=art.source,
                    event_type=art.artifact_type.upper(),
                    description=f"Artifact extracted from {art.source}",
                    severity=Severity.INFORMATIONAL,
                    artifact_id=art.artifact_id
                ))

        # Sort chronologically by timestamp
        events.sort(key=lambda e: e.timestamp)
        return events
