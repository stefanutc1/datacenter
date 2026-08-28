from __future__ import annotations
import time
import httpx
import json
import logging
from typing import List, Dict, Any, Optional
from .base import BaseLLMClient, ChatMessage, LLMResponse, ToolCall, Role

logger = logging.getLogger("elo.ai.openai")


class OpenAIClient(BaseLLMClient):
    """
    OpenAI ChatGPT Client (e.g., gpt-4o, gpt-4o-mini).
    Supports multi-turn chat, system messages, and native tool/function calling.
    """

    def __init__(
        self,
        api_key: str,
        model: str = "gpt-4o-mini",
        timeout: float = 35.0,
    ):
        self.api_key = api_key.strip() if api_key else ""
        self.model = model.strip() if model else "gpt-4o-mini"
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
            raise ValueError("OPENAI_API_KEY is not configured.")

        # Convert messages to OpenAI chat format
        formatted_messages = []
        for m in messages:
            msg_dict: Dict[str, Any] = {"role": m.role.value}
            
            if m.content is not None:
                msg_dict["content"] = m.content

            if m.tool_calls:
                msg_dict["tool_calls"] = [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.name,
                            "arguments": json.dumps(tc.arguments) if isinstance(tc.arguments, dict) else str(tc.arguments),
                        },
                    }
                    for tc in m.tool_calls
                ]

            if m.role == Role.TOOL:
                msg_dict["tool_call_id"] = m.tool_call_id or (m.name if m.name else "call_unknown")
                msg_dict["name"] = m.name

            formatted_messages.append(msg_dict)

        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": formatted_messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        if tools:
            payload["tools"] = [
                {
                    "type": "function",
                    "function": {
                        "name": t.get("name"),
                        "description": t.get("description", ""),
                        "parameters": t.get("parameters_schema") or t.get("parameters") or {},
                    },
                }
                for t in tools
            ]

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
            if resp.status_code != 200:
                err_body = resp.text
                logger.error(f"OpenAI API Error ({resp.status_code}): {err_body}")
                raise RuntimeError(f"OpenAI API Error [{resp.status_code}]: {err_body}")
            data = resp.json()

        choices = data.get("choices", [])
        if not choices:
            return LLMResponse(
                content="",
                tool_calls=[],
                model_used=self.model,
                provider="openai",
                latency_ms=(time.perf_counter() - start_time) * 1000,
            )

        choice = choices[0]
        msg = choice.get("message", {})
        text_content = msg.get("content")
        raw_tools = msg.get("tool_calls", [])

        tool_calls: List[ToolCall] = []
        for rt in raw_tools:
            fn = rt.get("function", {})
            args_raw = fn.get("arguments", "{}")
            try:
                args = json.loads(args_raw) if isinstance(args_raw, str) else args_raw
            except Exception:
                args = {"raw": args_raw}

            tool_calls.append(
                ToolCall(
                    id=rt.get("id", f"call_{int(time.time()*1000)}"),
                    name=fn.get("name", "unknown_tool"),
                    arguments=args,
                )
            )

        usage = data.get("usage", {})
        return LLMResponse(
            content=text_content,
            tool_calls=tool_calls,
            model_used=self.model,
            provider="openai",
            prompt_tokens=usage.get("prompt_tokens", 0),
            completion_tokens=usage.get("completion_tokens", 0),
            latency_ms=(time.perf_counter() - start_time) * 1000,
        )

    async def health_check(self) -> bool:
        if not self.api_key:
            return False
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get("https://api.openai.com/v1/models", headers=headers)
                return resp.status_code == 200
        except Exception:
            return False
