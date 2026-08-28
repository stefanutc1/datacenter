from __future__ import annotations
import os
from typing import Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()


class ELOConfig(BaseModel):
    # App Settings
    env: str = Field(default_factory=lambda: os.getenv("ELO_ENV", "development"))
    host: str = Field(default_factory=lambda: os.getenv("ELO_HOST", "0.0.0.0"))
    port: int = Field(default_factory=lambda: int(os.getenv("ELO_PORT", "8000")))
    secret_key: str = Field(
        default_factory=lambda: os.getenv("ELO_SECRET_KEY", "elo_default_insecure_key_1234567890")
    )

    # Telegram
    telegram_bot_token: Optional[str] = Field(
        default_factory=lambda: os.getenv("TELEGRAM_BOT_TOKEN")
    )
    telegram_admin_chat_id: Optional[str] = Field(
        default_factory=lambda: os.getenv("TELEGRAM_ADMIN_CHAT_ID")
    )

    # Providers
    primary_provider: str = Field(default_factory=lambda: os.getenv("PRIMARY_LLM_PROVIDER", "mock"))
    fallback_provider: str = Field(default_factory=lambda: os.getenv("FALLBACK_LLM_PROVIDER", "mock"))

    # Local LLM
    local_llm_base_url: str = Field(
        default_factory=lambda: os.getenv("LOCAL_LLM_BASE_URL", "http://localhost:11434")
    )
    local_llm_model: str = Field(
        default_factory=lambda: os.getenv("LOCAL_LLM_MODEL", "llama3.1:8b")
    )

    # Cloud LLMs
    gemini_api_key: Optional[str] = Field(
        default_factory=lambda: os.getenv("GEMINI_API_KEY")
    )
    gemini_model: str = Field(
        default_factory=lambda: os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
    )
    openai_api_key: Optional[str] = Field(
        default_factory=lambda: os.getenv("OPENAI_API_KEY")
    )
    openai_model: str = Field(
        default_factory=lambda: os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    )
    anthropic_api_key: Optional[str] = Field(
        default_factory=lambda: os.getenv("ANTHROPIC_API_KEY")
    )
    anthropic_model: str = Field(
        default_factory=lambda: os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
    )
    openrouter_api_key: Optional[str] = Field(
        default_factory=lambda: os.getenv("OPENROUTER_API_KEY")
    )
    openrouter_model: str = Field(
        default_factory=lambda: os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
    )

    # Gatekeeper
    approval_timeout_seconds: int = Field(
        default_factory=lambda: int(os.getenv("DEFAULT_APPROVAL_TIMEOUT_SECONDS", "300"))
    )


config = ELOConfig()
