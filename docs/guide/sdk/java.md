# Java Backend SDK

The Vascular Java SDK (`vascular-java`) is a server-side client for Vascular backend APIs. Use it from your Java backend to publish messages, manage users and tags, and read application metadata. It connects directly to Vascular Inbox (port `3000`).

**Repository:** [github.com/vascular-io/vascular-java](https://github.com/vascular-io/vascular-java)  
**Maven:** `io.vascular:vascular-java`

## Prerequisites

- Vascular Inbox deployed and reachable from your backend
- API key and app key — see [Authentication](./authentication.md)
- For OAuth-protected methods such as `sendMessage`, set `TENANT_ID` on Vascular Inbox and supply a Microsoft Entra ID access token — see [Environment variables](../environment-variables.md)

## Installation

```gradle
implementation("io.vascular:vascular-java:1.0.0")
```

```java
import io.vascular.App;
import io.vascular.Language;
import io.vascular.MessageAction;
import io.vascular.MessageData;
import io.vascular.MessageMedia;
import io.vascular.MessageState;
import io.vascular.MessageType;
import io.vascular.Provider;
import io.vascular.SendMessageRequest;
import io.vascular.Tag;
import io.vascular.User;
import io.vascular.Vascular;
import io.vascular.VascularConfig;

import java.time.Instant;
import java.util.List;
```

## Initialize

Create a `Vascular` client with your API key, app key, endpoint, and optional access-token supplier:

```java
VascularConfig config = VascularConfig.builder()
    .apiKey("API_KEY")
    .appKey("APP_KEY")
    .endpoint("inbox.example.com:3000")
    .accessTokenSupplier(() -> myTokenProvider.getAccessToken())
    .build();

Vascular vascular = new Vascular(config);
```

The endpoint accepts a host, `host:port`, `https://` URL, or `http://` URL. Bare hosts are treated as HTTPS. When no port is provided, the SDK uses port `443` for HTTPS and port `80` for HTTP.

Close the client when finished:

```java
vascular.close();
```

## Access token

OAuth-protected methods (such as `sendMessage`) send `authorization: Bearer <token>` when `accessTokenSupplier` returns a non-empty token. The SDK calls the supplier before each OAuth-protected method so you can return a fresh token.

Acquire the token outside the SDK from Microsoft Entra ID. The SDK does not generate tokens for you.

The supplier is optional. When omitted, no `authorization` header is sent.

## Usage

All network operations are synchronous and throw on failure.

### Get app

Returns application metadata for the configured app key.

```java
App app = vascular.getApp();
```

Returns:

```java
{
  uuid: STRING,
  name: STRING,
  appKey: STRING,
  createdAt: STRING,
}
```

### Create user

Registers a user in Vascular.

```java
User createdUser = vascular.createUser("user-123");
```

Returns:

```java
{
  uuid: STRING,
  inboxId: STRING,
  tags: [TAG],
  createdAt: STRING,
  metadata: STRING,
}
```

### Get user

Fetches a user profile.

```java
User user = vascular.getUser("user-123");
```

Returns:

```java
{
  uuid: STRING,
  inboxId: STRING,
  tags: [TAG],
  createdAt: STRING,
  metadata: STRING,
}
```

### Add tags

Adds tags to a user.

```java
String status = vascular.addTags("user-123", List.of("music", "sport"));
```

Returns:

```java
STRING
```

### Delete tags

Deletes matching tags from a user. Tags that do not exist are ignored.

```java
String status = vascular.removeTags("user-123", List.of("music", "sport"));
```

Returns:

```java
STRING
```

When no matching tags exist, the SDK returns:

```java
"Nothing to be deleted"
```

### List tags

Lists tags for a user.

```java
List<Tag> tags = vascular.getUserTags("user-123");
```

Returns:

```java
[
  {
    uuid: STRING,
    name: STRING,
    createdAt: STRING,
  }
]
```

### Send message

Publishes a message via the API. Requires OAuth.

```java
String status = vascular.sendMessage(new SendMessageRequest(
    "user-123",
    "cashback",
    Provider.API,
    MessageType.PAYMENT,
    List.of(
        new MessageData(
            "You've earned cashback, Sarah 🎉",
            "Hi Sarah, you earned €42.50 in cashback this month. Move it to your Saver and start earning 4.1% interest right away.",
            new MessageMedia(
                "https://cdn.example.com/thumbnails/cashback-earned.jpg",
                "https://cdn.example.com/images/cashback-earned.jpg"
            ),
            List.of(
                new MessageAction("Move to Saver", "myapp://saver/move?amount=42.50"),
                new MessageAction("View breakdown", "myapp://cashback/breakdown/2026-06")
            ),
            "{\"cashbackAmount\":\"42.50\",\"currency\":\"EUR\",\"saverRate\":\"4.1\"}",
            Language.EN_US,
            "€42.50 cashback · 4.1% Saver rate"
        ),
        new MessageData(
            "Du har tjent cashback, Sarah 🎉",
            "Hei Sarah, du tjente €42,50 i cashback denne måneden. Flytt beløpet til Sparer-kontoen din og begynn å tjene 4,1 % rente med en gang.",
            new MessageMedia(
                "https://cdn.example.com/thumbnails/cashback-earned.jpg",
                "https://cdn.example.com/images/cashback-earned.jpg"
            ),
            List.of(
                new MessageAction("Flytt til Sparer", "myapp://saver/move?amount=42.50"),
                new MessageAction("Se oversikt", "myapp://cashback/breakdown/2026-06")
            ),
            "{\"cashbackAmount\":\"42.50\",\"currency\":\"EUR\",\"saverRate\":\"4.1\"}",
            Language.NB,
            "€42,50 cashback · 4,1 % Sparer-rente"
        )
    ),
    Instant.parse("2026-07-31T23:59:59Z")
));
```

Returns:

```java
STRING
```

### Delete message

Deletes one message for a user.

```java
String status = vascular.deleteMessage("user-123", "MESSAGE_ID");
```

Returns:

```java
STRING
```

### Read messages

Marks the given message IDs as read.

```java
String status = vascular.changeMessageState(
    "user-123",
    List.of("message-id-1", "message-id-2"),
    MessageState.READ
);
```

Returns:

```java
STRING
```

### Open messages

Marks the given message IDs as opened.

```java
String status = vascular.changeMessageState(
    "user-123",
    List.of("message-id-1", "message-id-2"),
    MessageState.OPEN
);
```

Returns:

```java
STRING
```

## Data structures

### App

```java
{
  uuid: STRING,
  name: STRING,
  appKey: STRING,
  createdAt: STRING,
}
```

### User

```java
{
  uuid: STRING,
  createdAt: STRING,
  metadata: STRING,
}
```

### Tag

```java
{
  uuid: STRING,
  name: STRING,
  createdAt: STRING,
}
```

### Message data

```java
{
  title: STRING,
  body: STRING,
  media: {
    thumbnail: STRING,
    image: STRING,
  },
  actions: [
    {
      name: STRING,
      value: STRING,
    }
  ],
  metadata: STRING,
  language: LANGUAGE,
  subTitle: STRING,
}
```

## Enums

### `Provider`

`Provider.API` · `Provider.SFMC` · `Provider.DASHBOARD`

### `MessageType`

`MessageType.INFO` · `MessageType.CAMPAIGN` · `MessageType.PAYMENT` · `MessageType.NOTIFICATION`

### `Language`

`Language.EN_US` · `Language.EN_UK` · `Language.NB`

### `MessageState`

`MessageState.READ` · `MessageState.OPEN`

## Related

- [Authentication](./authentication.md)
- [Environment variables](../environment-variables.md) — `TENANT_ID` for OAuth
- [Client SDKs overview](../client-integration.md)
