# Prerequisites

Before running Vascular, ensure you meet the following requirements.

Make sure you have:

- A Vascular account — free to register, no credit card required
- Docker — Vascular is distributed as a public container image; no registry credentials are required
- A valid license file (`.license`). Download it from the [Customer Dashboard](https://dashboard.vascular.io) after registration
- A PostgreSQL database reachable from the container. Set `DATABASE_URL` to a full connection string (see [Environment variables](./environment-variables.md))
- An [Envoy proxy](./envoy-proxy.md) alongside Vascular Inbox for **React** / **React Native** web SDKs, or for any SDK when using custom authentication with a session token
