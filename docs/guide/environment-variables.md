# Environment variables

Vascular supports runtime customization through environment variables. These variables control optional features and integrations without requiring code changes.

Set these environment variables using:

- `docker run -e VAR_NAME=value`
- In your `docker-compose.yml` or Kubernetes `env:` block
- As part of your deployment configuration

## Available environment variables

| Variable Name | Default | Type | Description |
| --- | --- | --- | --- |
| `SERVER_PORT` | `3000` | String | Port the application listens on. |
| `DATABASE_URL` | (required) | String | PostgreSQL connection string. Must include protocol, user, password, host, port, and db name. |
| `LICENSE_KEY` | `/etc/vascular-inbox/.license` | String | Full path to the license file used to activate the application. Must be mounted at runtime. |
| `TENANT_ID` | Required when using the backend SDK | String | Your Microsoft Entra ID tenant ID. The backend SDK sends Microsoft Entra ID access tokens with requests, and Vascular uses this tenant ID to verify that those tokens come from your organization. |
| `AWS_REGION` | `eu-west-1` | String | AWS region where Kinesis Firehose is hosted. Used to stream analytics event records to Firehose. |
