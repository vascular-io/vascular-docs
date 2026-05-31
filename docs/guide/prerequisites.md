# Prerequisites

Before running Vascular, ensure you meet the following requirements.

Make sure you have:

- A Vascular account — free to register, no credit card required
- Access credentials for our private container registry (Vascular is distributed as a container image)
- A valid license file (`.license`). Download it from the [Customer Dashboard](https://dashboard.vascular.io) after registration
- A PostgreSQL database reachable from the container. Set `DATABASE_URL` to a full connection string (see [Environment variables](./environment-variables.md))
- An [Envoy proxy](./envoy-proxy.md) alongside Vascular Inbox for **React** / **React Native** web SDKs, or for any SDK when using custom authentication with a session token
