import pytest
from httpx import AsyncClient, ASGITransport
from elo_contracts.agents import AgentRole
from elo_contracts.presence import ESP32PresenceUpdate, RoomActionRequest
from elo_core.memory.pgvector_store import PgVectorMemoryStore
from elo_core.hardware.esp32_presence import ESP32PresenceManager
from elo_core.agents.secops_agent import SecOpsThreatHunterAgent
from elo_core.agents.sysadmin_agent import SysAdminOptimizerAgent
from elo_core.agents.energy_agent import SmartHomeEnergyAgent
from elo_core.self_healing.predictive import PredictiveHealthAnalyzer
from elo_ai_client.offline_engine import OfflineVoiceEngine
from elo_core.main import app


@pytest.mark.asyncio
async def test_pgvector_semantic_memory():
    store = PgVectorMemoryStore()
    
    # Save custom memory
    entry = await store.save_memory(
        content="Nodul Proxmox VE 192.168.1.132 are instalat modulul ZFS mirror pe discuri NVMe.",
        domain="homelab",
        metadata={"tags": ["proxmox", "nvme", "zfs"]}
    )
    assert entry.id is not None
    assert entry.embedding is not None
    assert len(entry.embedding) == 128

    # Search with cosine similarity
    results = await store.search_memory("Proxmox VE 192.168.1.132 hypervisor", top_k=3)
    assert len(results) > 0
    assert any("192.168.1.132" in r.entry.content for r in results)
    assert results[0].similarity > 0.0

    # User Preferences
    store.set_user_preference("theme", "dark", category="ui")
    assert store.get_user_preference("theme") == "dark"
    assert store.get_user_preference("unknown_pref", "default_val") == "default_val"


@pytest.mark.asyncio
async def test_esp32_room_awareness():
    mgr = ESP32PresenceManager()
    
    # Send presence update for Living Room
    update = ESP32PresenceUpdate(
        device_id="esp32-node-living-02",
        room_id="living_room",
        detected=True,
        rssi=-52,
    )
    status = mgr.process_presence_update(update)
    assert status["current_room"] == "living_room"
    assert status["room_name"] == "Living"

    # Contextual action routing
    req = RoomActionRequest(action="turn_on_lights")
    route_res = mgr.route_contextual_action(req)
    assert route_res["success"] is True
    assert route_res["room_id"] == "living_room"
    assert route_res["target_entity"] == "light.living_room_ceiling"
    assert route_res["service_call"] == "turn_on"


@pytest.mark.asyncio
async def test_secops_threat_hunter():
    agent = SecOpsThreatHunterAgent()
    
    raw_logs = [
        {
            "src_ip": "198.51.100.77",
            "target_port": 22,
            "protocol": "SSH",
            "failures_count": 55,
            "signature": "ET SCAN Automated SSH Login Attack",
            "severity": "CRITICAL",
        }
    ]
    
    result = await agent.analyze_security_events(raw_logs)
    assert result.success is True
    assert result.role == AgentRole.SECOPS_HUNTER
    assert result.incident_report is not None
    assert result.incident_report.attacker_ip == "198.51.100.77"
    assert result.incident_report.action_taken == "QUARANTINED_OPNSENSE"


@pytest.mark.asyncio
async def test_sysadmin_optimizer():
    agent = SysAdminOptimizerAgent()
    result = await agent.optimize_cluster_resources()
    
    assert result.success is True
    assert result.role == AgentRole.SYSADMIN_OPTIMIZER
    assert len(result.actions_executed) >= 2
    assert any(a["action"] == "PRUNE_DANGLING_CACHE" for a in result.actions_executed)


@pytest.mark.asyncio
async def test_smart_home_energy_agent():
    agent = SmartHomeEnergyAgent()
    result = await agent.optimize_energy_consumption()
    
    assert result.success is True
    assert result.role == AgentRole.SMART_HOME_ENERGY
    assert result.metrics["total_current_watts"] > 0
    assert result.metrics["idle_devices_count"] >= 1


@pytest.mark.asyncio
async def test_predictive_health_analyzer():
    analyzer = PredictiveHealthAnalyzer(nas_host="192.168.1.135")
    result = await analyzer.analyze_storage_health()
    
    assert result.success is True
    assert result.role == AgentRole.PREDICTIVE_HEALER
    assert result.metrics["drives_monitored"] == 3
    assert result.metrics["failing_drives_count"] == 0


@pytest.mark.asyncio
async def test_offline_voice_engine():
    engine = OfflineVoiceEngine()
    status = engine.get_engine_status()
    assert status["status"] == "READY"
    assert status["latency_target_ms"] <= 100.0

    tx = await engine.transcribe_audio(b"FAKE_AUDIO")
    assert tx["success"] is True
    assert len(tx["transcript"]) > 0

    tts = await engine.synthesize_speech("Test sinteza vocala")
    assert tts["success"] is True
    assert tts["format"] == "wav"


@pytest.mark.asyncio
async def test_fastapi_new_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Presence
        resp_pres = await ac.get("/v1/presence")
        assert resp_pres.status_code == 200
        assert "zones_monitored" in resp_pres.json()

        # 2. Presence Update
        resp_update = await ac.post("/v1/presence/update", json={
            "device_id": "esp32-node-office-01",
            "room_id": "office",
            "detected": True,
            "rssi": -45
        })
        assert resp_update.status_code == 200
        assert resp_update.json()["current_room"] == "office"

        # 3. Presence Route Action
        resp_route = await ac.post("/v1/presence/route", json={
            "action": "turn_on_lights",
            "target_room": "office"
        })
        assert resp_route.status_code == 200
        assert resp_route.json()["target_entity"] == "light.office_lights"

        # 4. Memory Search
        resp_mem = await ac.post("/v1/memory/search?query=Proxmox&top_k=2")
        assert resp_mem.status_code == 200
        assert resp_mem.json()["results_count"] > 0

        # 5. Agent Execute (SecOps)
        resp_agent = await ac.post("/v1/agents/execute?role=secops_threat_hunter&action=analyze_logs")
        assert resp_agent.status_code == 200
        assert resp_agent.json()["role"] == "secops_threat_hunter"

        # 6. Voice Status
        resp_voice = await ac.get("/v1/voice/status")
        assert resp_voice.status_code == 200
        assert resp_voice.json()["status"] == "READY"
