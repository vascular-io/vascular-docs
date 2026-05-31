# Envoy proxy

**Envoy** is a proxy that sits in front of Vascular Inbox. SDK traffic goes to Envoy first; Envoy forwards allowed requests to Vascular.

## Why Envoy is needed

**Web SDKs (React, React Native in the browser)** cannot call Vascular Inbox on port `3000` directly. Browsers need a proxy that handles CORS and web-compatible routing. Point the SDK at Envoy on port **`8081`**.

**Your own authentication before Vascular** — optional. If you want every SDK request validated by **your** login or identity system (not only Vascular API key and app key), the SDK can send a `session-token` on each call. Envoy sends that token to **your authentication service** first; only approved requests reach Vascular Inbox. You build and run that service — it is not part of Vascular. See [Authentication](./sdk/authentication.md).

Native SDKs (Flutter, Android, iOS) without a `session-token` may connect to Vascular Inbox on port `3000` directly and do not need Envoy.

| Scenario | SDKs | Envoy listener |
| --- | --- | --- |
| **Web SDKs** | React, React Native (web) | `8081` — required |
| **Your custom authentication** | Web and/or native (with `session-token`) | `8081` (web) or `8082` (native) — required |

## Request flow

**Web SDKs** (API key + app key only)

```text
Web SDK  →  Envoy (:8081)  →  Vascular Inbox
```

**Your authentication, then Vascular** (`session-token` enabled)

```text
Vascular SDK  →  Envoy  →  your authentication service  →  Vascular Inbox
```

## Placeholders

Copy one configuration below to `envoy.yaml` and replace placeholders before deploying (for example with `envsubst`):

| Placeholder | Description | Example |
| --- | --- | --- |
| `${vascular_upstream_HOST}` | Hostname of the Vascular service | `vascular-inbox` |
| `${vascular_upstream_PORT}` | Port of the Vascular service | `3000` |
| `${ENVOY_API_DOMAIN}` | Envoy API domain name (hostname clients call) | `envoy.your-domain.com` |
| `${CORS_ALLOW_ORIGIN}` | Allowed browser frontend origin (web SDK configs only) | `https://app.your-domain.com` |
| `${auth_filter_HOST}` | Hostname of your authentication service (session token configs only) | `my-auth-service` |
| `${auth_filter_PORT}` | Port of your authentication service (session token configs only) | `9001` |

## SDK endpoints

| Configuration | Example `endpoint` |
| --- | --- |
| Web SDK | `https://envoy.your-domain.com:8081` |
| Web SDK + your authentication | `https://envoy.your-domain.com:8081` |
| Native SDK + your authentication | `https://envoy.your-domain.com:8082` |
| Native SDK (no Envoy) | `https://vascular.your-domain.com:3000` |

Ports (`8081`, `8082`, `3000`) and hostnames are examples — configure them in your Envoy and Vascular Inbox deployment.

Do not point web SDKs at the Vascular Inbox hostname or port.

## Configurations

::: details 1. Web SDKs — API key and app key only
Listener **`8081`** for React and React Native (web). No custom authentication service. Native SDKs use Vascular Inbox on port `3000` directly.

[Download `web-sdks.yaml`](/envoy/web-sdks.yaml)

<<< ../envoy/web-sdks.yaml
:::

::: details 2. Web SDKs + your authentication — session token on web only
Listener **`8081`**. Use when only web clients send a `session-token` and you validate it with your own service before Vascular Inbox.

[Download `web-sdks-auth-filter.yaml`](/envoy/web-sdks-auth-filter.yaml)

<<< ../envoy/web-sdks-auth-filter.yaml
:::

::: details 3. All SDKs + your authentication — session token on web and native
Listeners **`8081`** (web, with CORS) and **`8082`** (Flutter, Android, iOS). Use when every SDK sends a `session-token` validated by your service before Vascular Inbox.

[Download `all-sdks-auth-filter.yaml`](/envoy/all-sdks-auth-filter.yaml)

<<< ../envoy/all-sdks-auth-filter.yaml
:::

## Related

- [Authentication](./sdk/authentication.md) — API keys and optional `session-token`
- [Deploying Vascular Inbox](./deploying.md) — Docker and Kubernetes examples
