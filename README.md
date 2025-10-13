## Mixpeek MCP Server

A lightweight, production-friendly Model Context Protocol (MCP) server for Mixpeek that:

- Auto-loads Mixpeek's OpenAPI spec and exposes endpoints as MCP tools
- Supports local and hosted use (bring-your-own API key)
- Injects `Authorization` and `X-Namespace` headers
- Includes rate limits, timeouts, and redacted logs
- Ships with Docker and simple configuration

### Quickstart

1) Install

Python (PyPI):
```bash
# global (recommended)
pipx install mixpeek-mcp

# or in a venv
python -m venv .venv && source .venv/bin/activate
pip install mixpeek-mcp
```

npm (Node):
```bash
# run once
npx @mixpeek/mcp

# or install globally
npm i -g @mixpeek/mcp
```

Homebrew (macOS):
```bash
# tap and install (once the tap is live)
brew tap mixpeek/tap https://github.com/mixpeek/homebrew-tap
brew install mixpeek-mcp

# temporary local formula (dev/testing):
brew install --build-from-source Formula/mixpeek-mcp.rb
```

2) Configure (env or your MCP client secret store)

```bash
cp env.sample .env
# edit as needed
```

Env vars:

- `MIXPEEK_API_KEY`: Your Mixpeek API key (optional if endpoints don't require auth)
- `MIXPEEK_API_BASE`: Default `https://api.mixpeek.com` (or `https://server-xb24.onrender.com` for testing)
- `MIXPEEK_OPENAPI_URL`: Defaults to `<API_BASE>/openapi.json` (or `/docs/openapi.json`)
- `MIXPEEK_NAMESPACE`: Optional namespace value to send via `X-Namespace`
- `MCP_RATE_MAX_CALLS`: Default `20` per `MCP_RATE_PER_SECONDS`
- `MCP_RATE_PER_SECONDS`: Default `10`
- `MCP_CONNECT_TIMEOUT`: Default `5`
- `MCP_READ_TIMEOUT`: Default `30`

3) Run locally (stdio)

```bash
# PyPI
mixpeek-mcp

# from source
python server.py

# npm
mixpeek-mcp
```

Your MCP client (e.g., Claude Desktop) can attach to this server via stdio.

### Docker

```bash
docker build -t mixpeek-mcp:latest .
docker run --rm -it \
  -e MIXPEEK_API_KEY=sk_... \
  -e MIXPEEK_NAMESPACE=your_namespace \
  mixpeek-mcp:latest
```

Or pull and run (once published):
```bash
docker run --rm -it \
  -e MIXPEEK_API_KEY=sk_... \
  -e MIXPEEK_NAMESPACE=your_namespace \
  ghcr.io/mixpeek/mcp:latest
```

### Distribution

- npm: `@mixpeek/mcp` → `https://www.npmjs.com/package/@mixpeek/mcp`
- PyPI: `mixpeek-mcp` → `https://pypi.org/project/mixpeek-mcp/` (publish pending)
- Docker Hub: `mixpeek/mcp` (pending push), GHCR: `ghcr.io/mixpeek/mcp` (pending push)
- Homebrew: `mixpeek/tap/mixpeek-mcp` (tap repo to be created)

### Submit to Docker MCP Registry

We prepared `registry.json` compatible with the [Official Docker MCP Registry](https://github.com/docker/mcp-registry/tree/main). To submit:

1) Fork the registry and create a new entry under the appropriate directory per their CONTRIBUTING guide.
2) Include our `registry.json` (update Docker image reference if you publish under a different org/tag).
3) Open a PR. Upon approval, it will appear in the MCP catalog and Docker Desktop's MCP Toolkit.

### Configuration

Required for write-protected endpoints:
- `MIXPEEK_API_KEY`: `Authorization: Bearer <key>`

Optional:
- `MIXPEEK_NAMESPACE`: sets `X-Namespace` for isolation
- `MIXPEEK_API_BASE`: defaults to `https://api.mixpeek.com`; testing: `https://server-xb24.onrender.com`
- `MIXPEEK_OPENAPI_URL`: defaults to `<API_BASE>/openapi.json` (or `/docs/openapi.json`)
- `MCP_RATE_MAX_CALLS` / `MCP_RATE_PER_SECONDS`: simple token bucket
- `MCP_CONNECT_TIMEOUT` / `MCP_READ_TIMEOUT`: request timeouts

### How it works

- Loads OpenAPI spec and maps GET/POST JSON endpoints to tools using `operationId`
- Tool arguments accept top-level query parameters or a `query`/`body` envelope
- Forwards requests to Mixpeek with configured headers
- Provides small allowlist (configurable) and redacts secrets in logs

### Testing

Unit tests:
```bash
pip install -r requirements.txt
pytest -q
```

Live test (optional):
```bash
export LIVE_MIXPEEK_API_KEY=sk_...
export LIVE_MIXPEEK_OPENAPI_URL=https://server-xb24.onrender.com/docs/openapi.json
export LIVE_MIXPEEK_API_BASE=https://server-xb24.onrender.com
pytest -q tests/test_live_integration.py
```

### Using with MCP clients

- This server uses MCP stdio transport and the official server interface, compatible with common MCP clients.
- Start the server, then point your MCP client to the stdio command (`mixpeek-mcp`).

### References

- Mixpeek docs: `https://docs.mixpeek.com/overview/introduction`
- Mixpeek OpenAPI: `https://server-xb24.onrender.com/docs/openapi.json`
 - MCP overview: `https://modelcontextprotocol.io/docs/getting-started/intro`

### Notes

- For production hosting, front with HTTPS, add SSO/session issuance, per-tenant rate limits, and audit logs without bodies/headers. Keep local stdio as the default; hosted HTTP/SSE can be added later.


