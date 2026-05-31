# Client SDKs

Integrate Vascular into your applications using our open-source client SDKs. Each SDK uses the same credential model — see [Authentication](./sdk/authentication.md) for how API keys, app keys, and user IDs are sent on every request.

## Connection overview

| SDK | Package / repo | Connects to | Port |
| --- | --- | --- | --- |
| [Web / React](./sdk/web-react.md) | [`@vascular-io/vascular-js`](https://github.com/vascular-io/vascular-js) | [Envoy](./envoy-proxy.md) | `8081` |
| React Native (web) | Same as Web / React | [Envoy](./envoy-proxy.md) | `8081` |
| [Flutter](./sdk/flutter.md) | [`vascular_flutter`](https://github.com/vascular-io/vascular-flutter) | Vascular Inbox, or [Envoy](./envoy-proxy.md) with session token | `3000` or `8082` |
| Android (Java) | [vascular-android](https://github.com/vascular-io/vascular-android) | Vascular Inbox, or [Envoy](./envoy-proxy.md) with session token | `3000` or `8082` |
| iOS (Swift) | [vascular-ios](https://github.com/vascular-io/vascular-ios) | Vascular Inbox, or [Envoy](./envoy-proxy.md) with session token | `3000` or `8082` |

## Documented SDKs

- [Authentication](./sdk/authentication.md) — API key, app key, user ID, and optional session token
- [Web / React](./sdk/web-react.md) — `@vascular-io/vascular-js` installation and API
- [Flutter](./sdk/flutter.md) — `vascular_flutter` installation and API

## Quick start

1. Deploy [Vascular Inbox](./deploying.md) and obtain your [license](./license.md).
2. Get an **API key** and **app key** from the [Customer Dashboard](https://dashboard.vascular.io).
3. Read [Authentication](./sdk/authentication.md) and open the guide for your platform:
   - Web or React → [Web / React SDK](./sdk/web-react.md) and [Envoy proxy](./envoy-proxy.md)
   - Flutter → [Flutter SDK](./sdk/flutter.md)

## Other platforms

Documentation for Android and iOS SDKs will be added here. Until then, refer to the repositories:

- [vascular-android](https://github.com/vascular-io/vascular-android)
- [vascular-ios](https://github.com/vascular-io/vascular-ios)
