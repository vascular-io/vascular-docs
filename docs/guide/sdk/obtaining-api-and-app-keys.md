# Obtaining API and app keys

::: warning
API keys and app keys are identifiers exposed to client SDKs. They are not sufficient on their own for strict authentication. For stronger access control, enable [session token](./authentication.md#session-token-optional) validation through your own authentication service.
:::

Run the Vascular container with the `show-creds` argument to print your credentials to the console.

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `LICENSE_KEY` | Your license key |

The command prints `AppKey`, `PrimaryAPIKey`, and `SecondaryAPIKey`. Credentials are **not** stored in the database when using `show-creds`.

To generate credentials and persist them in the database instead, set `CREDS_IN_DB=true` when running Vascular Inbox and retrieve the keys from the database. See [Environment variables](../environment-variables.md).

Store credentials securely and never commit them to source control.

## Docker

```bash
docker run --rm \
  -e DATABASE_URL='postgres://myuser:mypassword@localhost:5432/mydatabase?sslmode=disable' \
  -e LICENSE_KEY='your-license-key' \
  docker pull ghcr.io/vascular-io/inbox:v0.0.14 \
  show-creds
```

## Kubernetes

Create a Secret with the required values, then run a one-off Job:

```bash
kubectl create secret generic vascular-inbox-secrets \
  --from-literal=database-url='postgresql://user:password@postgres-host:5432/vascular_inbox' \
  --from-literal=license-key='your-license-key'
```

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: vascular-show-creds
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: vascular-inbox
          image: vascular.registry.com/inbox:latest
          args: ["show-creds"]
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: vascular-inbox-secrets
                  key: database-url
            - name: LICENSE_KEY
              valueFrom:
                secretKeyRef:
                  name: vascular-inbox-secrets
                  key: license-key
```

```bash
kubectl apply -f vascular-show-creds-job.yaml
kubectl logs job/vascular-show-creds
kubectl delete job vascular-show-creds
```

If you already have `vascular-inbox-secrets` from your deployment, add `license-key` to it or reference the existing `database-url` key.
