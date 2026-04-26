# Local Codex config template for this repository.
# Copy needed values into your global config if required.

model_provider = "kfc-coding"
model = "gpt-5.3-codex"
model_reasoning_effort = "medium"
network_access = "enabled"
disable_response_storage = true
personality = "pragmatic"

[model_providers.kfc-coding]
name = "KFC-Coding Proxy"
base_url = "https://kfc-api.sxxe.net/v1"
wire_api = "responses"
requires_openai_auth = true

# Project note:
# Keep secrets/tokens in user-level secure config or env vars.
# Do not commit keys into repository files.
