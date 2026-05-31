# Deploying Vascular Inbox

The examples below show how to run Vascular Inbox with PostgreSQL, required environment variables, and your license file. Include Envoy when using React or React Native web SDKs, or when SDKs authenticate with **your own service** before Vascular Inbox (see [Vascular Inbox with Envoy](./envoy-proxy.md)).

## Database and required environment variables

Vascular Inbox requires PostgreSQL. Set `DATABASE_URL` when starting the container. Set `TENANT_ID` when using the Vascular backend SDK to authenticate with the Vascular service (see [Environment variables](./environment-variables.md)).

## Custom license path

By default, mount the license at `/etc/vascular-inbox/.license`. For a custom path, pass `--license-file` and mount the file to match:

```bash
-v /path/to/.license:/custom/path/.license:ro \
--license-file=/custom/path/.license
```

## Example: Docker Compose

The example below runs PostgreSQL, Vascular Inbox, and Envoy together. Copy the files from the [`examples/`](https://github.com/vascular-io/vascular-docs/tree/main/examples) directory in this repository:

```bash
cp -r examples/ vascular-stack/
cd vascular-stack
cp .env.example .env
# Edit .env — set TENANT_ID
# Place your license at license/.license
docker compose up -d
```

| Service | Port | Purpose |
| --- | --- | --- |
| `postgres` | `5432` (internal) | PostgreSQL database |
| `vascular-inbox` | `3000` | Native SDKs and direct API access |
| `envoy` | `8081` | Web SDKs (`https://localhost:8081` locally) |

Adjust `examples/envoy.yaml` for your frontend origin and API domain before production. See [Vascular Inbox with Envoy](./envoy-proxy.md) for configuration options.

Remove the `envoy` service from `docker-compose.yml` if you only use native SDKs without your own authentication.

### `docker-compose.yml`

<<< ../../examples/docker-compose.yml

### `.env`

```bash
TENANT_ID=your-entra-tenant-id
```

Mount your license at `license/.license` before starting the stack.

## Example: Kubernetes deployment

Create Secrets for the database connection string, tenant ID, and license file, then apply the Deployment:

```bash
kubectl create secret generic vascular-inbox-secrets \
  --from-literal=database-url='postgresql://user:password@postgres-host:5432/vascular_inbox' \
  --from-literal=tenant-id='your-entra-tenant-id'
```

For web SDKs or your own authentication, add Envoy as a sidecar in the same Pod. Create a ConfigMap from `envoy.yaml` and set the cluster address to `127.0.0.1` so Envoy reaches Vascular Inbox on localhost:

```bash
kubectl create configmap vascular-envoy-config --from-file=envoy.yaml=./envoy.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vascular-inbox
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vascular-inbox
  template:
    metadata:
      labels:
        app: vascular-inbox
    spec:
      containers:
        - name: vascular-inbox
          image: vascular.registry.com/inbox:latest
          args: ["--license-file=/etc/vascular-inbox/.license"] # optional if using default
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: vascular-inbox-secrets
                  key: database-url
            - name: TENANT_ID
              valueFrom:
                secretKeyRef:
                  name: vascular-inbox-secrets
                  key: tenant-id
          volumeMounts:
            - name: license
              mountPath: /etc/vascular-inbox/.license
              subPath: .license
              readOnly: true
        - name: envoy
          image: envoyproxy/envoy:v1.31-latest
          args: ["-c", "/etc/envoy/envoy.yaml"]
          ports:
            - containerPort: 8081
          volumeMounts:
            - name: envoy-config
              mountPath: /etc/envoy
              readOnly: true
      volumes:
        - name: license
          secret:
            secretName: vascular-license
        - name: envoy-config
          configMap:
            name: vascular-envoy-config
---
apiVersion: v1
kind: Service
metadata:
  name: vascular-inbox
spec:
  selector:
    app: vascular-inbox
  ports:
    - name: api
      port: 3000
      targetPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: vascular-envoy
spec:
  selector:
    app: vascular-inbox
  ports:
    - name: envoy-web
      port: 8081
      targetPort: 8081
```
