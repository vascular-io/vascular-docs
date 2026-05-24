# Prerequisites

Before running Vascular, ensure you meet the following requirements.

Make sure you have:

- An active subscription
- Access credentials for our private container registry (Vascular is distributed as a container image)
- A valid license file (`.license`). Download it from the [Customer Dashboard](https://dashboard.vascular.io) after registration
- A PostgreSQL database reachable from the container. Set `DATABASE_URL` to a full connection string (see [Environment variables](./environment-variables.md))
- An Envoy proxy running alongside Vascular Inbox if you use the web client with the **React** or **React Native** SDK (see [Envoy proxy for web SDKs](./envoy-proxy.md))
