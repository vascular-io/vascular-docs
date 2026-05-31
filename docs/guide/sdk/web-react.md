# Web / React SDK

The Vascular JavaScript SDK (`@vascular-io/vascular-js`) is the client for **React** and **React Native** web applications. It must connect through [Envoy](../envoy-proxy.md), not directly to Vascular Inbox port `3000`.

**Repository:** [github.com/vascular-io/vascular-js](https://github.com/vascular-io/vascular-js)  
**npm:** [@vascular-io/vascular-js](https://www.npmjs.com/package/@vascular-io/vascular-js)

## Prerequisites

- Vascular Inbox deployed and reachable from Envoy
- [Envoy configured](../envoy-proxy.md) on port `8081`
- API key, app key, and user ID — see [Authentication](./authentication.md)

## Installation

```sh
npm install @vascular-io/vascular-js
```

```ts
import Vascular, { Language } from '@vascular-io/vascular-js';
```

## Initialize

Create a `Vascular` client with your API key, app key, user ID, endpoint (Envoy URL), and optional languages:

```ts
const vascular = new Vascular({
  apiKey: 'API_KEY',
  appKey: 'APP_KEY',
  userId: 'USER_ID',
  endpoint: 'https://api.your-domain.com',
  languages: [Language.ENUK],
});
```

If `languages` is not provided, the SDK defaults to `Language.ENUK`.

For optional session-token authentication, see [Authentication](./authentication.md).

## Usage

All network operations are asynchronous and should be awaited.

### Create user

Creates a user. If `userId` is not provided, the SDK uses the user ID passed to the constructor.

```ts
const createdUser = await vascular.createUser();
const createdOtherUser = await vascular.createUser(otherUserId);
```

Returns:

```ts
{
  userId: string,
  inboxId: string,
  metadata: string,
}
```

### Get user

Fetches a user. If `userId` is not provided, the SDK uses the user ID passed to the constructor.

```ts
const user = await vascular.getUser();
const otherUser = await vascular.getUser(otherUserId);
```

Returns:

```ts
{
  uuid: string,
  createdAt: string,
  metadata: string,
}
```

### Inbox

Fetches the first inbox page.

```ts
const messages = await vascular.inbox();
```

Returns an array of inbox messages.

### Next inbox page

Fetches the next inbox page using the pagination state from the previous `inbox()` or `inboxNext()` call.

```ts
const messages = await vascular.inboxNext();
```

### Get message by ID

```ts
const message = await vascular.getMessageById('MESSAGE_ID');
```

### Read messages

Marks the given message IDs as read.

```ts
const status = await vascular.readMessages(['message-id-1', 'message-id-2']);
```

### Open messages

Marks the given message IDs as opened.

```ts
const status = await vascular.openMessages(['message-id-1', 'message-id-2']);
```

### Delete message

```ts
const status = await vascular.deleteMessage('MESSAGE_ID');
```

### Add tags

Adds tags to the current user.

```ts
const status = await vascular.addTags(['music', 'sport']);
```

### Delete tags

Deletes matching tags from the current user. Tags that do not exist are ignored.

```ts
const status = await vascular.deleteTags(['music', 'sport']);
```

When no matching tags exist, the SDK returns `'Nothing to be deleted'`.

### List tags

```ts
const tags = await vascular.tags();
```

Returns:

```ts
[
  {
    uuid: string,
    name: string,
    createdAt: string,
  }
]
```

### Multiple languages

When you initialize the SDK with multiple languages, each inbox message can contain message data keyed by language name.

```ts
const vascular = new Vascular({
  apiKey: 'API_KEY',
  appKey: 'APP_KEY',
  userId: 'USER_ID',
  endpoint: 'https://api.your-domain.com',
  languages: [Language.ENUS, Language.NB],
});

const messages = await vascular.inbox();
const message = messages[0];

const englishMessage = message.messageData.enUs;
const norwegianMessage = message.messageData.nb;
```

## Data structures

### Inbox message

```ts
{
  uuid: string,
  status: Status,
  provider: Provider,
  created_at: Timestamp,
  expdate: Timestamp,
  type: Type,
  messageData: {
    enUs?: MessageData,
    enUk?: MessageData,
    nb?: MessageData,
  },
}
```

### Message data

```ts
{
  title: string,
  body: string,
  media: {
    thumbnail: string,
    image: string,
  },
  actions: [{ name: string, value: string }],
  subTitle: string,
}
```

## Enums

### `Language`

| Value | Message data key |
| --- | --- |
| `Language.ENUS` | `enUs` |
| `Language.ENUK` | `enUk` |
| `Language.NB` | `nb` |

### `Provider`

`api` · `sfmc` · `dashboard`

### `Status`

`delivered` · `opened` · `read` · `deleted` · `admin_deleted`

### `Type`

`info` · `campaign` · `payment` · `notification`

## Related

- [Authentication](./authentication.md)
- [Envoy proxy for web SDKs](../envoy-proxy.md)
- [Client SDKs overview](../client-integration.md)
