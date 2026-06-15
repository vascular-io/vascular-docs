# Authentication

Client SDKs authenticate with Vascular on every API call. You supply credentials when you construct the client; the SDK attaches them to each request. There is no separate login step in the SDK itself.

## Credentials

| Credential | Required | Purpose |
| --- | --- | --- |
| **API key** | Yes | Identifies your Vascular account. |
| **App key** | Yes | Identifies your application within your account. |
| **User ID** | Yes | Identifies the end user for inbox and profile operations. |
| **Session token** | No | Validates the caller against your own authentication system. |

See [Obtaining API and app keys](./obtaining-api-and-app-keys.md) for how to generate your API and app keys from the container. See [API key rotation](./api-key-rotation.md) for rotating keys without downtime.

## Initialize with credentials

### Web (React / React Native)

```ts
const vascular = new Vascular({
  apiKey: 'API_KEY',
  appKey: 'APP_KEY',
  userId: 'USER_ID',
});
```

### Flutter

```dart
final vascular = initializeApp(apiKey, appKey, userId, ...);
```

## Session token (optional)

All SDKs support an optional **session token** for integrations that verify users through your own authentication service.

Provide a `getSessionToken` callback when initializing the SDK. The SDK calls it before every request to obtain a fresh token and sends it as a `session-token` header. The callback is optional — when omitted, no `session-token` header is sent.

When session tokens are enabled, route SDK traffic through **Envoy** so **your own authentication service** can validate each request before it reaches Vascular Inbox. You deploy and operate that service — it is not part of Vascular. See [Envoy proxy](../envoy-proxy.md) and set `${auth_filter_HOST}` and `${auth_filter_PORT}` in your Envoy config.

### Web (React / React Native)

```ts
const vascular = new Vascular({
  apiKey: 'API_KEY',
  appKey: 'APP_KEY',
  userId: 'USER_ID',
  endpoint: 'https://api.example.com',
  getSessionToken: async () => {
    return await yourAuthService.getValidToken();
  },
});
```

### Flutter

```dart
final vascular = initializeApp(
  apiKey,
  appKey,
  userId,
  endpoint,
  [Language.enUs],
  () async {
    return await yourAuthService.getValidToken();
  },
);
```
