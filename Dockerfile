FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

WORKDIR /app

RUN --mount=type=cache,target=/root/.cache/uv \
  --mount=type=bind,source=uv.lock,target=uv.lock \
  --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
  uv sync --frozen --no-install-project --no-dev

COPY .python-version pyproject.toml uv.lock ./

RUN --mount=type=cache,target=/root/.cache/uv uv sync --frozen --no-dev

COPY . .

FROM python:3.12-slim AS runner

ARG VERSION
ARG BUILD_TIME

ENV PYTHON_ENV=production
ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app

COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/src /app/src

EXPOSE 4200

CMD ["python", "src/main.py"]
