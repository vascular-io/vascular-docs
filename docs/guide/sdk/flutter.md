# Flutter SDK

The Vascular Flutter SDK (`vascular_flutter`) is a Dart client for **Flutter** apps on iOS and Android. It connects over TLS to Vascular Inbox directly (default port `3000`), not through Envoy.

**Repository:** [github.com/vascular-io/vascular-flutter](https://github.com/vascular-io/vascular-flutter)

## Prerequisites

- Vascular Inbox deployed and reachable from the device or emulator
- API key, app key, and user ID — see [Authentication](./authentication.md)

## Installation

Add the package to your app's `pubspec.yaml`:

```yaml
dependencies:
  vascular_flutter: ^1.0.0
```

```sh
flutter pub get
```

```dart
import 'package:vascular_flutter/vascular_flutter.dart';
```

## Initialize

Create a `Vascular` client with your API key, app key, user ID, and endpoint:

```dart
final vascular = initializeApp(
  apiKey,
  appKey,
  userId,
  'api.example.com',
);
```

You can also pass a URL with a scheme and port:

```dart
final vascular = initializeApp(
  apiKey,
  appKey,
  userId,
  'https://api.example.com:443',
);
```

To request localized inbox content, pass one or more languages:

```dart
final vascular = initializeApp(
  apiKey,
  appKey,
  userId,
  endpoint,
  [Language.enUs, Language.nb],
);
```

## Usage

All network operations are asynchronous and should be awaited.

### Create user

Creates a user. If `userId` is not provided, the SDK uses the user ID passed to `initializeApp`.

```dart
final createdUser = await vascular.CreateUser();
final createdOtherUser = await vascular.CreateUser(userId: otherUserId);
```

Returns:

```dart
{
  userId: String,
  inboxId: String,
  metadata: String,
}
```

### Get user

```dart
final user = await vascular.GetUser();
final otherUser = await vascular.GetUser(userId: otherUserId);
```

Returns:

```dart
{
  uuid: String,
  createdAt: String,
  metadata: String,
}
```

### Inbox

Fetches the first inbox page.

```dart
final inbox = await vascular.Inbox();
final messages = inbox.messages;
```

Returns:

```dart
{
  messages: [InboxMessage],
  newMessagesIds: [String],
  readMessagesIds: [String],
  next: String,
  newInbox: int,
}
```

`next` is the pagination token used by `InboxNext()`.

### Next inbox page

Fetches the next inbox page. Returns `null` when there is no next page.

```dart
final nextInbox = await vascular.InboxNext();
```

### Get message by ID

```dart
final message = await vascular.GetMessageById(inbox.messages.first.uuid);
```

### Delivered messages count

Returns the number of delivered messages for the current user.

```dart
final deliveredMessagesCount = await vascular.GetDeliveredMessages();
```

### Read messages

```dart
final status = await vascular.ReadMessages(['message-id-1', 'message-id-2']);
```

### Open messages

```dart
final status = await vascular.OpenMessages(['message-id-1', 'message-id-2']);
```

### Delete message

```dart
final status = await vascular.DeleteMessage(inbox.messages.first.uuid);
```

### Add tags

```dart
final status = await vascular.AddTags(['music', 'sport']);
```

### Delete tags

```dart
final status = await vascular.DeleteTags(['music', 'sport']);
```

### List tags

```dart
final tags = await vascular.Tags();
```

Returns:

```dart
[
  {
    uuid: String,
    name: String,
    createdAt: String,
  }
]
```

### Single-language message

Use `GetMessage` to return and remove the first message from a localized message map.

```dart
final messageData = vascular.GetMessage(inbox.messages.first.message);
```

### Multiple languages

When you initialize the SDK with multiple languages, each inbox message can contain message data keyed by language name.

```dart
final vascular = initializeApp(
  apiKey,
  appKey,
  userId,
  endpoint,
  [Language.enUs, Language.nb],
);

final inbox = await vascular.Inbox();
final message = inbox.messages.first;

final englishMessage = message.message[Language.enUs.name];
final norwegianMessage = message.message[Language.nb.name];
```

## Data structures

### Inbox message

```dart
{
  uuid: String,
  status: Status,
  message: { enUs: MessageData, nb: MessageData, ... },
  provider: Provider,
  createdAt: Timestamp,
  expdate: Timestamp,
  type: Type,
}
```

### Message data

```dart
{
  title: String,
  body: String,
  media: { thumbnail: String, image: String },
  actions: [{ name: String, value: String }],
  metadata: String,
  language: Language,
  subTitle: String,
}
```

## Enums

### `Language`

`Language.enUs` · `Language.enUk` · `Language.nb`

### `Provider`

`Provider.api` · `Provider.sfmc` · `Provider.dashboard`

### `Status`

`Status.delivered` · `Status.opened` · `Status.read` · `Status.deleted` · `Status.admin_delete`

### `Type`

`Type.info` · `Type.campaign` · `Type.payment` · `Type.notification`

## Related

- [Authentication](./authentication.md)
- [Client SDKs overview](../client-integration.md)
