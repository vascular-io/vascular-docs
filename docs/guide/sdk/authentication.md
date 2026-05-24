# Authentication

Client SDKs authenticate with Vascular Inbox on every API call. There is no separate login step or token refresh flow — you supply credentials when you construct the client, and the SDK attaches them to each request.

## Credentials

| Credential | Purpose |
| --- | --- |
| **API key** | Identifies your Vascular account. |
| **App key** | Identifies your application within your account. |
| **User ID** | Identifies the end user for inbox and profile operations. |

Obtain API and app keys from the [Customer Dashboard](https://dashboard.vascular.io). Store them securely and never commit them to source control.

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
