# API key rotation

Rotate API keys without downtime using the primary and secondary keys. Client SDKs should start on the **primary** key. If they start on secondary, mirror the steps: distribute primary → rotate secondary → migrate → rotate primary.

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `LICENSE_KEY` | Your license key |

## Recommended rotation sequence

### Phase 1 — Distribute secondary (no downtime)

Client SDKs keep using **primary**. Distribute the **secondary** key so integrators can switch when ready.

Run `show-creds` — see [Obtaining API and app keys](./obtaining-api-and-app-keys.md).

Share:

- `AppKey` (unchanged)
- `SecondaryAPIKey` (standby — Client SDKs should configure but not cut over yet)

Wait until all Client SDKs confirm they can authenticate with **secondary**.

### Phase 2 — Rotate primary

Primary is no longer needed by Client SDKs. Run `rotate-primary-key`, then [reload all server processes](#reloading-servers).

Run `show-creds` again and distribute the new **PrimaryAPIKey**. Client SDKs should move from secondary → new primary.

### Phase 3 — Rotate secondary (optional)

Once Client SDKs use the **new primary**, the old secondary is unused. Run `rotate-secondary-key`, [reload all server processes](#reloading-servers), then run `show-creds`.

Share the new **SecondaryAPIKey** as the next standby for the following rotation cycle.

## Docker

```bash
docker run --rm \
  -e DATABASE_URL='postgres://myuser:mypassword@localhost:5432/mydatabase?sslmode=disable' \
  -e LICENSE_KEY='your-license-key' \
  ghcr.io/vascular-io/inbox:v0.0.14 \
  rotate-primary-key
```

```bash
docker run --rm \
  -e DATABASE_URL='postgres://myuser:mypassword@localhost:5432/mydatabase?sslmode=disable' \
  -e LICENSE_KEY='your-license-key' \
  ghcr.io/vascular-io/inbox:v0.0.14 \
  rotate-secondary-key
```

For `show-creds`, see [Obtaining API and app keys](./obtaining-api-and-app-keys.md#docker).

### Reloading servers

```bash
docker restart vascular-inbox
```

Or, with Docker Compose:

```bash
docker compose restart vascular-inbox
```

## Kubernetes

Run a one-off Job for each rotation command. Use the same Secret as your deployment — see [Obtaining API and app keys](./obtaining-api-and-app-keys.md#kubernetes).

**Rotate primary:**

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: vascular-rotate-primary-key
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: vascular-inbox
          image: ghcr.io/vascular-io/inbox:v0.0.14
          args: ["rotate-primary-key"]
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

**Rotate secondary:** use the same manifest with `metadata.name: vascular-rotate-secondary-key` and `args: ["rotate-secondary-key"]`.

```bash
kubectl apply -f vascular-rotate-primary-key-job.yaml
kubectl logs job/vascular-rotate-primary-key
kubectl delete job vascular-rotate-primary-key
```

For `show-creds`, see [Obtaining API and app keys](./obtaining-api-and-app-keys.md#kubernetes).

### Reloading servers

```bash
kubectl rollout restart deployment/vascular-inbox
```
