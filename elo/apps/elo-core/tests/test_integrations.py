import pytest
from elo_core.proxmox_client import ProxmoxClient
from elo_core.homeassistant_client import HomeAssistantClient
from elo_core.opnsense_client import OPNsenseClient
from elo_core.watchdog import SelfHealingWatchdog
from elo_core.knowledge import HomelabKnowledgeBase


@pytest.mark.asyncio
async def test_proxmox_client_reachability_and_offline_fallback():
    pve = ProxmoxClient(host="192.168.1.132")
    status = await pve.get_cluster_status()
    assert status["host"] == "192.168.1.132"
    assert status["status"] in ["ONLINE", "OFFLINE", "ONLINE (AUTH_REQUIRED)"]


@pytest.mark.asyncio
async def test_homeassistant_client_offline_fallback():
    hass = HomeAssistantClient(base_url="http://192.168.1.10:8123")
    res = await hass.get_states()
    assert res["status"] in ["SUCCESS", "OFFLINE", "ONLINE (AUTH_REQUIRED)"]


@pytest.mark.asyncio
async def test_opnsense_client_block_ip():
    opn = OPNsenseClient(host="192.168.1.132:8443")
    res = await opn.block_ip("45.33.32.156", "Test Malicious IP")
    assert res["status"] in ["SUCCESS", "OFFLINE"]


@pytest.mark.asyncio
async def test_watchdog_health_cycle():
    watchdog = SelfHealingWatchdog(check_interval=30.0)
    cycle = await watchdog.perform_health_cycle()
    assert cycle["nodes_checked"] >= 3
    assert "timestamp" in cycle


def test_knowledge_base_search():
    kb = HomelabKnowledgeBase()
    res = kb.search("Proxmox VLAN 10")
    assert len(res) > 0
    assert "Proxmox" in res[0]["topic"] or "OPNsense" in res[0]["topic"]
