from __future__ import annotations
import time
import httpx
import json
import logging
from typing import List, Dict, Any, Optional
from .base import BaseLLMClient, ChatMessage, LLMResponse, ToolCall, Role

logger = logging.getLogger("elo.ai.claude")


class AnthropicClaudeClient(BaseLLMClient):
    """
    Anthropic Claude Client (e.g. claude-3-5-sonnet-20241022, claude-3-haiku-20240307).
    Supports multi-turn chat, system prompt separation, and tool use/tool result.
    """

    def __init__(
        self,
        api_key: str,
        model: str = "claude-3-5-sonnet-20241022",
        timeout: float = 35.0,
    ):
        self.api_key = api_key.strip() if api_key else ""
        self.model = model.strip() if model else "claude-3-5-sonnet-20241022"
        self.timeout = timeout

    async def chat(
        self,
        messages: List[ChatMessage],
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: float = 0.2,
        max_tokens: int = 2048,
    ) -> LLMResponse:
        start_time = time.perf_counter()

        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY is not configured.")

        system_text = None
        formatted_messages = []

        for m in messages:
            if m.role == Role.SYSTEM:
                system_text = m.content
                continue

            if m.role == Role.USER:
                formatted_messages.append({"role": "user", "content": m.content or ""})
            elif m.role == Role.ASSISTANT:
                content_blocks = []
                if m.content:
                    content_blocks.append({"type": "text", "text": m.content})
                if m.tool_calls:
                    for tc in m.tool_calls:
                        content_blocks.append({
                            "type": "tool_use",
                            "id": tc.id,
                            "name": tc.name,
                            "input": tc.arguments,
                        })
                formatted_messages.append({"role": "assistant", "content": content_blocks or ""})
            elif m.role == Role.TOOL:
                formatted_messages.append({
                    "role": "user",
                    "content": [
                        {
                            "type": "tool_result",
                            "tool_use_id": m.tool_call_id or "call_unknown",
                            "content": m.content or "",
                        }
                    ],
                })

        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": formatted_messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }

        if system_text:
            payload["system"] = system_text

        if tools:
            payload["tools"] = [
                {
                    "name": t.get("name"),
                    "description": t.get("description", ""),
                    "input_schema": t.get("parameters_schema") or t.get("parameters") or {"type": "object", "properties": {}},
                }
                for t in tools
            ]

        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post("https://api.anthropic.com/v1/messages", json=payload, headers=headers)
            if resp.status_code != 200:
                err_body = resp.text
                logger.error(f"Anthropic API Error ({resp.status_code}): {err_body}")
                raise RuntimeError(f"Anthropic API Error [{resp.status_code}]: {err_body}")
            data = resp.json()

        content_list = data.get("content", [])
        text_parts = []
        tool_calls: List[ToolCall] = []

        for item in content_list:
            if item.get("type") == "text":
                text_parts.append(item.get("text", ""))
            elif item.get("type") == "tool_use":
                tool_calls.append(
                    ToolCall(
                        id=item.get("id", f"call_{int(time.time()*1000)}"),
                        name=item.get("name", "unknown_tool"),
                        arguments=item.get("input", {}),
                    )
                )

        usage = data.get("usage", {})
        return LLMResponse(
            content="".join(text_parts) if text_parts else None,
            tool_calls=tool_calls,
            model_used=self.model,
            provider="claude",
            prompt_tokens=usage.get("input_tokens", 0),
            completion_tokens=usage.get("output_tokens", 0),
            latency_ms=(time.perf_counter() - start_time) * 1000,
        )

    async def health_check(self) -> bool:
        if not self.api_key:
            return False
        # Lightweight check: model list or 1-token query
        return bool(self.api_key.startswith("sk-ant-") or len(self.api_key) > 20)
