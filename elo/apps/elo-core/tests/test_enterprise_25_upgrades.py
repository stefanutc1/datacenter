import pytest
import asyncio
from elo_ai_client.rate_limiter import HierarchicalRateLimiter, RateLimitConfig
from elo_ai_client.grammar import GBNFGenerator, validate_tool_arguments
from elo_security.webauthn import WebAuthnVerifier
from elo_security.vaultwarden import VaultwardenClient
from elo_security.ssh_ca import EphemeralSSHCA
from elo_core.audit_ledger import AuditLedger
from elo_core.memory.hybrid_store import HybridVectorStore
from elo_core.guardrails.verifier import SecurityGuardrail, CommandVerifier
from elo_core.memory.trace_store import TraceStore, ExecutionTrace, ReActStep
from elo_core.swarm.orchestrator import SwarmOrchestrator
from elo_core.agents.storage_agent import StorageAgent
from elo_core.agents.infra_agent import InfraAgent
from elo_core.lxc_lifecycle import LXCLifecycleManager
from elo_core.dr_drill import DRDrillRunner
from elo_core.self_healing.docker_healer import DockerHealer
from elo_core.telemetry_analyzer import TelemetryAnalyzer
from elo_core.tracing import EloTracer
from elo_core.briefing import DailyBriefingGenerator
from elo_core.voice.pipeline import LocalVoicePipeline
from elo_core.hardware.esp32_mesh import ESP32MeshProtocol
from elo_core.gitops.evaluator import GitOpsPREvaluator
from pydantic import BaseModel


class SampleToolArgs(BaseModel):
    vm_id: int
    force: bool = False


@pytest.mark.asyncio
async def test_hierarchical_rate_limiter():
    limiter = HierarchicalRateLimiter({
        "gemini": RateLimitConfig(requests_per_minute=2, tokens_per_minute=1000, daily_request_cap=5)
    })
    assert await limiter.can_dispatch("gemini", 100) is True
    await limiter.record_usage("gemini", 100)
    assert await limiter.can_dispatch("gemini", 100) is True
    await limiter.record_usage("gemini", 100)
    # Exceeded 2 requests per minute
    assert await limiter.can_dispatch("gemini", 100) is False


def test_grammar_constrained_decoding():
    gen = GBNFGenerator()
    grammar = gen.generate_from_model(SampleToolArgs)
    assert "root ::=" in grammar
    assert "vm_id" in grammar

    validated = validate_tool_arguments("test_tool", {"vm_id": 101, "force": True}, SampleToolArgs)
    assert validated["vm_id"] == 101
    assert validated["force"] is True


@pytest.mark.asyncio
async def test_security_webauthn_and_vaultwarden():
    verifier = WebAuthnVerifier()
    challenge = verifier.create_step_up_challenge("admin", "pve_destroy_pool", {"pool": "tank"})
    assert challenge.challenge_id is not None
    assert challenge.user_id == "admin"

    vw = VaultwardenClient(base_url="https://vw.local", api_key="dummy_token")
    secret = await vw.lease_secret("proxmox_api_token")
    assert secret is not None


def test_ssh_ca_and_audit_ledger(tmp_path):
    ca = EphemeralSSHCA()
    cert = ca.create_jit_session("admin", ["192.168.1.132"], ttl_minutes=10)
    assert cert.username == "admin"
    assert "ssh-ed25519-cert-v01@openssh.com" in cert.certificate_openssh

    ledger_path = str(tmp_path / "test_ledger.jsonl")
    from elo_contracts.security import SecurityLevel
    from elo_contracts.events import DomainEnum
    ledger = AuditLedger(secret_key="test_hmac_key_at_least_16_chars", storage_path=ledger_path)
    entry = ledger.record_event(DomainEnum.HOMELAB, "sysadmin", "restart_container", SecurityLevel.L1_LOW_WRITE, parameters={"ct_id": 105})
    assert entry.signature is not None
    is_valid, errors = ledger.verify_integrity()
    assert is_valid is True
    assert len(errors) == 0


@pytest.mark.asyncio
async def test_hybrid_store_and_guardrails():
    hybrid = HybridVectorStore()
    entry = await hybrid.save_memory("Proxmox VE hypervisor on 192.168.1.132", domain="homelab", metadata={"node": "pve"})
    assert entry.id is not None
    results = hybrid.search_sync("Proxmox hypervisor", top_k=1)
    assert len(results) > 0
    assert results[0].entry.domain == "homelab"

    verifier = CommandVerifier()
    res_dangerous = verifier.verify_command("rm -rf /")
    assert res_dangerous.is_safe is False

    res_safe = verifier.verify_command("ls -la /opt/homelab")
    assert res_safe.is_safe is True


def test_trace_store_few_shot():
    ts = TraceStore()
    trace = ExecutionTrace(
        trace_id="tr_01",
        task_description="Restart container 105 safely",
        domain="infra",
        steps=[
            ReActStep(step_type="reasoning", content="Need to check CT status first"),
            ReActStep(step_type="action", content="pve_status", tool_name="pve_status", tool_args={"id": 105}),
            ReActStep(step_type="completed", content="Container restarted successfully"),
        ],
        success=True,
        feedback_score=1.0,
    )
    ts.record_trace(trace)
    exemplars = ts.find_similar_exemplars("Restart container 105")
    assert len(exemplars) == 1
    prompt_text = ts.format_few_shot_context(exemplars)
    assert "Restart container 105 safely" in prompt_text


@pytest.mark.asyncio
async def test_swarm_and_sre_agents():
    swarm = SwarmOrchestrator()
    agents = swarm.get_registered_agents()
    assert "NetSecAgent" in agents
    assert "StorageAgent" in agents
    assert "InfraAgent" in agents
    assert "HomeAgent" in agents

    storage = StorageAgent()
    drives = await storage.check_smart_health()
    assert len(drives) > 0

    infra = InfraAgent()
    health = await infra.score_node_health("pve-node-1")
    assert health.health_score > 0

    lxc = LXCLifecycleManager()
    assert lxc is not None

    dr = DRDrillRunner()
    from elo_core.dr_drill import DrillTargetType
    drill_res = await dr.run_disaster_recovery_drill(DrillTargetType.VAULTWARDEN_SQLITE)
    assert drill_res.status.value == "PASSED"

    healer = DockerHealer()
    heal_res = await healer.heal_container("vaultwarden")
    assert heal_res.healed_successfully is True

    analyzer = TelemetryAnalyzer()
    zscore = analyzer.calculate_zscore([10.0, 10.2, 10.1, 10.0], 95.0)
    assert zscore > 2.0

    tracer = EloTracer()
    async with tracer.cognitive_span("elo_reasoning_loop") as span:
        assert span.name == "elo_reasoning_loop"
        assert span.trace_id is not None

    briefing_gen = DailyBriefingGenerator()
    briefing = await briefing_gen.assemble_daily_briefing()
    assert "ELO DAILY OPERATIONAL BRIEFING" in briefing.markdown_content.upper()

    voice = LocalVoicePipeline()
    assert voice is not None

    mesh = ESP32MeshProtocol()
    packet = mesh.deserialize_packet(b'{"packet_type": "TELEMETRY", "source_node": "esp32-node-office-01", "sequence_id": 1, "payload": {"sensors": {"temperature_c": 22.5}}}')
    assert packet.source_node == "esp32-node-office-01"

    evaluator = GitOpsPREvaluator()
    checks = evaluator.validate_yaml_syntax("services:\n  immich:\n    image: immich:v1.0\n", "services/immich/docker-compose.yml")
    assert len(checks) > 0
    assert checks[0].status.value == "PASSED"
