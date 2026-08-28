FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY packages/ /app/packages/
COPY apps/elo-core/ /app/apps/elo-core/

RUN pip install --upgrade pip setuptools wheel && \
    pip install -e /app/packages/elo-contracts && \
    pip install -e /app/packages/elo-security && \
    pip install -e /app/packages/elo-ai-client && \
    pip install -e /app/apps/elo-core

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["python", "-m", "elo_core.main"]
