# Deploying Vascular Inbox

The examples below show how to run Vascular Inbox with PostgreSQL, required environment variables, and your license file. Include Envoy when using the React or React Native web SDKs (see [Envoy proxy for web SDKs](./envoy-proxy.md)).

## Database and required environment variables

Vascular Inbox requires PostgreSQL. Set `DATABASE_URL` to a full connection string and `TENANT_ID` to your Microsoft Entra tenant ID when starting the container (see [Environment variables](./environment-variables.md)).

## Custom license path

By default, mount the license at `/etc/vascular-inbox/.license`. For a custom path, pass `--license-file` and mount the file to match:

```bash
-v /path/to/.license:/custom/path/.license:ro \
--license-file=/custom/path/.license
```

## Example: Run with Docker

Create a Docker network, start Vascular Inbox, then start Envoy on the same network when using React or React Native web SDKs. Publish port `3000` for native and other SDKs, and port `8081` for web clients.

```bash
docker network create vascular-net

docker run -d \
  --name vascular-inbox \
  --network vascular-net \
  -p 3000:3000 \
  -e DATABASE_URL='postgresql://user:password@postgres-host:5432/vascular_inbox' \
  -e TENANT_ID='your-entra-tenant-id' \
  -v /path/to/.license:/etc/vascular-inbox/.license:ro \
  vascular.registry.com/inbox:latest

docker run -d \
  --name vascular-envoy \
  --network vascular-net \
  -p 8081:8081 \
  -v /path/to/envoy.yaml:/etc/envoy/envoy.yaml:ro \
  envoyproxy/envoy:v1.31-latest \
  -c /etc/envoy/envoy.yaml
```

In `envoy.yaml`, set the cluster address to `vascular-inbox` (the Docker container name). On Docker Desktop you can use `host.docker.internal` instead if Vascular Inbox runs on the host. Skip the Envoy container if you only use native SDKs.

## Example: Kubernetes deployment

Create Secrets for the database connection string, tenant ID, and license file, then apply the Deployment:

```bash
kubectl create secret generic vascular-inbox-secrets \
  --from-literal=database-url='postgresql://user:password@postgres-host:5432/vascular_inbox' \
  --from-literal=tenant-id='your-entra-tenant-id'
```

For web SDKs, add Envoy as a sidecar in the same Pod. Create a ConfigMap from `envoy.yaml` and set the cluster address to `127.0.0.1` so Envoy reaches Vascular Inbox on localhost:

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
            - containerPort: 9090
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
