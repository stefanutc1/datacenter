from __future__ import annotations
import os
import pathlib
import uvicorn
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from elo_contracts.security import ApprovalDecision
from elo_security.gatekeeper import SecurityGatekeeper
from elo_ai_client.mock_client import MockLLMClient
from elo_ai_client.local_client import LocalOllamaClient
from elo_ai_client.cloud_client import CloudGeminiClient
from elo_ai_client.openai_client import OpenAIClient
from elo_ai_client.claude_client import AnthropicClaudeClient
from elo_ai_client.openrouter_client import OpenRouterClient
from elo_ai_client.router import HybridRouter, CascadeRouter
from .config import config
from .registry import create_default_registry
from .audit import AuditLogger
from .engine import ELOEngine
from .bot.telegram_bot import TelegramBotNotifier

# Dependency singletons
gatekeeper = SecurityGatekeeper(
    secret_key=config.secret_key,
    default_timeout_seconds=config.approval_timeout_seconds,
)
telegram_bot = TelegramBotNotifier(
    bot_token=config.telegram_bot_token,
    admin_chat_id=config.telegram_admin_chat_id,
    gatekeeper=gatekeeper,
)
gatekeeper.notifier_callback = telegram_bot.notify_approval_required

audit_logger = AuditLogger()
tool_registry = create_default_registry()


def build_llm_router(
    primary_prov: Optional[str] = None,
    gemini_key: Optional[str] = None,
    gemini_mdl: Optional[str] = None,
    openrouter_key: Optional[str] = None,
    openrouter_mdl: Optional[str] = None,
    openai_key: Optional[str] = None,
    openai_mdl: Optional[str] = None,
    claude_key: Optional[str] = None,
    claude_mdl: Optional[str] = None,
    ollama_url: Optional[str] = None,
    ollama_mdl: Optional[str] = None,
) -> CascadeRouter:
    prov = primary_prov or config.primary_provider
    g_key = gemini_key if gemini_key is not None else config.gemini_api_key
    g_mdl = gemini_mdl or config.gemini_model
    or_key = openrouter_key if openrouter_key is not None else config.openrouter_api_key
    or_mdl = openrouter_mdl or config.openrouter_model
    oai_key = openai_key if openai_key is not None else config.openai_api_key
    oai_mdl = openai_mdl or config.openai_model
    cl_key = claude_key if claude_key is not None else config.anthropic_api_key
    cl_mdl = claude_mdl or config.anthropic_model
    o_url = ollama_url or config.local_llm_base_url
    o_mdl = ollama_mdl or config.local_llm_model

    providers = []

    # Priority 1: Gemini (if configured)
    if g_key:
        providers.append(CloudGeminiClient(api_key=g_key, model=g_mdl))

    # Priority 2: OpenRouter Universal Hub (if configured)
    if or_key:
        providers.append(OpenRouterClient(api_key=or_key, model=or_mdl))

    # Priority 3: OpenAI Direct (if configured)
    if oai_key:
        providers.append(OpenAIClient(api_key=oai_key, model=oai_mdl))

    # Priority 4: Anthropic Claude Direct (if configured)
    if cl_key:
        providers.append(AnthropicClaudeClient(api_key=cl_key, model=cl_mdl))

    # Priority 5: Local Ollama (if configured/available)
    if prov == "local_ollama" or config.fallback_provider == "local_ollama":
        providers.append(LocalOllamaClient(base_url=o_url, model=o_mdl))

    # Priority 6: Deterministic Mock fallback (failsafe)
    providers.append(MockLLMClient())

    return CascadeRouter(providers=providers)


llm_router = build_llm_router()
engine = ELOEngine(
    llm_router=llm_router,
    tool_registry=tool_registry,
    gatekeeper=gatekeeper,
    audit_logger=audit_logger,
)


def update_engine_llm(
    primary_prov: Optional[str] = None,
    gemini_key: Optional[str] = None,
    gemini_mdl: Optional[str] = None,
    openrouter_key: Optional[str] = None,
    openrouter_mdl: Optional[str] = None,
    openai_key: Optional[str] = None,
    openai_mdl: Optional[str] = None,
    claude_key: Optional[str] = None,
    claude_mdl: Optional[str] = None,
    ollama_url: Optional[str] = None,
    ollama_mdl: Optional[str] = None,
) -> CascadeRouter:
    global llm_router
    if gemini_key is not None:
        config.gemini_api_key = gemini_key
    if gemini_mdl:
        config.gemini_model = gemini_mdl
    if openrouter_key is not None:
        config.openrouter_api_key = openrouter_key
    if openrouter_mdl:
        config.openrouter_model = openrouter_mdl
    if openai_key is not None:
        config.openai_api_key = openai_key
    if openai_mdl:
        config.openai_model = openai_mdl
    if claude_key is not None:
        config.anthropic_api_key = claude_key
    if claude_mdl:
        config.anthropic_model = claude_mdl
    if ollama_url:
        config.local_llm_base_url = ollama_url
    if ollama_mdl:
        config.local_llm_model = ollama_mdl
    if primary_prov:
        config.primary_provider = primary_prov

    llm_router = build_llm_router(
        primary_prov=primary_prov,
        gemini_key=gemini_key,
        gemini_mdl=gemini_mdl,
        openrouter_key=openrouter_key,
        openrouter_mdl=openrouter_mdl,
        openai_key=openai_key,
        openai_mdl=openai_mdl,
        claude_key=claude_key,
        claude_mdl=claude_mdl,
        ollama_url=ollama_url,
        ollama_mdl=ollama_mdl,
    )
    engine.llm = llm_router
    return llm_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown


STATIC_DIR = pathlib.Path(__file__).parent / "static"

app = FastAPI(
    title="ELO — AI Operating Layer & Orchestrator",
    version="0.1.0",
    description="Autonomous control plane for Homelab, Business ERP, and SaaS integration.",
    lifespan=lifespan,
)

if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/")
async def root():
    index_path = STATIC_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"message": "ELO Core API Online. Navigate to /docs for API schema."}


# Request/Response Schemas
class ChatRequest(BaseModel):
    message: str
    actor: str = Field(default="user")
    auto_wait_for_approval: bool = Field(default=False)


class ApprovalResolutionRequest(BaseModel):
    approved: bool
    actor: str = Field(default="admin")
    challenge_token: Optional[str] = None
    reason: Optional[str] = None


from .telemetry import get_real_system_telemetry


@app.get("/health")
async def health():
    llm_healthy = await llm_router.health_check()
    return {
        "status": "ONLINE",
        "system": "ELO Core",
        "env": config.env,
        "llm_status": "HEALTHY" if llm_healthy else "DEGRADED",
    }


class LLMConfigRequest(BaseModel):
    provider: Optional[str] = Field(None, description="cascade, cloud_gemini, openrouter, local_ollama, mock")
    gemini_api_key: Optional[str] = None
    gemini_model: Optional[str] = None
    openrouter_api_key: Optional[str] = None
    openrouter_model: Optional[str] = None
    openai_api_key: Optional[str] = None
    openai_model: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    anthropic_model: Optional[str] = None
    local_llm_base_url: Optional[str] = None
    local_llm_model: Optional[str] = None


@app.get("/v1/llm/status")
async def get_llm_status():
    is_healthy = await llm_router.health_check()
    
    # Active cascade tier info
    configured_cascade = []
    if config.gemini_api_key:
        configured_cascade.append(f"Gemini ({config.gemini_model})")
    if config.openrouter_api_key:
        configured_cascade.append(f"OpenRouter ({config.openrouter_model})")
    if config.openai_api_key:
        configured_cascade.append(f"ChatGPT ({config.openai_model})")
    if config.anthropic_api_key:
        configured_cascade.append(f"Claude ({config.anthropic_model})")
    if config.local_llm_base_url and config.primary_provider == "local_ollama":
        configured_cascade.append(f"Ollama ({config.local_llm_model})")
    configured_cascade.append("Mock (Failsafe)")

    return {
        "active_provider": config.primary_provider,
        "is_healthy": is_healthy,
        "cascade_chain": " ➔ ".join(configured_cascade),
        "gemini_configured": bool(config.gemini_api_key),
        "gemini_model": config.gemini_model,
        "openrouter_configured": bool(config.openrouter_api_key),
        "openrouter_model": config.openrouter_model,
        "openai_configured": bool(config.openai_api_key),
        "openai_model": config.openai_model,
        "anthropic_configured": bool(config.anthropic_api_key),
        "anthropic_model": config.anthropic_model,
        "local_ollama_url": config.local_llm_base_url,
        "local_ollama_model": config.local_llm_model,
    }


@app.post("/v1/llm/config")
async def set_llm_config(req: LLMConfigRequest):
    update_engine_llm(
        primary_prov=req.provider,
        gemini_key=req.gemini_api_key,
        gemini_mdl=req.gemini_model,
        openrouter_key=req.openrouter_api_key,
        openrouter_mdl=req.openrouter_model,
        openai_key=req.openai_api_key,
        openai_mdl=req.openai_model,
        claude_key=req.anthropic_api_key,
        claude_mdl=req.anthropic_model,
        ollama_url=req.local_llm_base_url,
        ollama_mdl=req.local_llm_model,
    )
    is_healthy = await llm_router.health_check()
    return {
        "status": "CONFIG_UPDATED",
        "provider": config.primary_provider,
        "is_healthy": is_healthy,
        "gemini_configured": bool(config.gemini_api_key),
        "openrouter_configured": bool(config.openrouter_api_key),
        "openai_configured": bool(config.openai_api_key),
        "anthropic_configured": bool(config.anthropic_api_key),
    }


from .telemetry import get_real_system_telemetry_async


@app.get("/v1/telemetry")
async def get_telemetry():
    return await get_real_system_telemetry_async()


@app.post("/v1/chat")
async def chat_endpoint(req: ChatRequest):
    result = await engine.process_user_message(
        user_text=req.message,
        actor=req.actor,
        auto_wait_for_approval=req.auto_wait_for_approval,
    )
    return result


@app.get("/v1/tools")
async def list_tools():
    return {"tools": tool_registry.get_definitions()}


@app.get("/v1/approvals")
async def list_pending_approvals():
    return {"pending_approvals": gatekeeper.get_pending_requests()}


@app.post("/v1/approvals/{request_id}/resolve")
async def resolve_approval(request_id: str, req: ApprovalResolutionRequest):
    decision = ApprovalDecision(
        request_id=request_id,
        approved=req.approved,
        actor=req.actor,
        challenge_token=req.challenge_token,
        reason=req.reason,
    )
    success, cap_token = gatekeeper.resolve_request(decision)
    if not success:
        raise HTTPException(
            status_code=400,
            detail="Failed to resolve ticket. Either invalid ID, already resolved, or expired.",
        )
    return {
        "request_id": request_id,
        "status": "APPROVED" if req.approved else "REJECTED",
        "capability_token": cap_token,
    }


@app.get("/v1/audit")
async def list_audit_logs(limit: int = 50):
    return {"audit_logs": audit_logger.get_recent_logs(limit=limit)}


if __name__ == "__main__":
    uvicorn.run(app, host=config.host, port=config.port)
