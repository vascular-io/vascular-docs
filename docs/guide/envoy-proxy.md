# Envoy proxy for web SDKs

Vascular Inbox listens on port `3000` by default (configurable via `SERVER_PORT`). That port serves all SDKs **except** the web clients for **React** and **React Native**.

| SDK / client | Connects to | Port |
| --- | --- | --- |
| Android, iOS, Flutter, and other native SDKs | Vascular Inbox directly | `3000` (default) |
| React and React Native (web) | Envoy proxy | `8081` |

For React and React Native, run **Envoy** alongside Vascular Inbox. The web app calls Envoy on port `8081`; Envoy forwards those requests to Vascular Inbox on port `9090` (not `3000`).

- **React / React Native → Envoy**: port `8081`
- **Envoy → Vascular Inbox**: port `9090`
- **Other SDKs → Vascular Inbox**: port `3000` (default)

Save the configuration below as `envoy.yaml`. Replace the placeholder domains with your Envoy/API hostname and your frontend app origin, and set the cluster `address` to reach Vascular Inbox (see [Deploying Vascular Inbox](./deploying.md)).

```yaml
static_resources:
  listeners:
    - name: web_listener
      address:
        socket_address:
          address: 0.0.0.0
          port_value: 8081

      filter_chains:
        - filters:
            - name: envoy.filters.network.http_connection_manager
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
                stat_prefix: web_proxy
                codec_type: AUTO

                access_log:
                  - name: envoy.access_loggers.stdout
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.access_loggers.stream.v3.StdoutAccessLog

                route_config:
                  name: local_route
                  virtual_hosts:
                    - name: web_service
                      # Envoy/API server domain that the browser is calling.
                      domains: ["api.your-domain.com"]

                      cors:
                        allow_origin_string_match:
                          # Frontend app domain.
                          - exact: "https://your-frontend.example.com"
                        allow_methods: "POST, GET, OPTIONS, PUT, DELETE"
                        allow_headers: "api-key,app-key,keep-alive,user-agent,cache-control,content-type,content-transfer-encoding,custom-header-1,x-accept-content-transfer-encoding,x-accept-response-streaming,x-user-agent,x-grpc-web,grpc-timeout"
                        expose_headers: "grpc-status,grpc-message,grpc-status-details-bin"
                        max_age: "1728000"

                      routes:
                        - match:
                            prefix: "/"
                          route:
                            cluster: inbox_backend
                            timeout: 0s

                http_filters:
                  - name: envoy.filters.http.grpc_web
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.filters.http.grpc_web.v3.GrpcWeb

                  - name: envoy.filters.http.cors
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.filters.http.cors.v3.Cors

                  - name: envoy.filters.http.router
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
    - name: inbox_backend
      connect_timeout: 5s
      type: LOGICAL_DNS
      dns_lookup_family: V4_ONLY
      load_assignment:
        cluster_name: inbox_backend
        endpoints:
          - lb_endpoints:
              - endpoint:
                  address:
                    socket_address:
                      # Vascular Inbox address (container name, service name, or host).
                      # Port 9090 is used by Envoy; port 3000 is for other SDKs.
                      address: vascular-inbox
                      port_value: 9090

      typed_extension_protocol_options:
        envoy.extensions.upstreams.http.v3.HttpProtocolOptions:
          "@type": type.googleapis.com/envoy.extensions.upstreams.http.v3.HttpProtocolOptions
          explicit_http_config:
            http2_protocol_options: {}
```

Point your React or React Native web SDK at the Envoy listener (for example `https://api.your-domain.com` on port `8081`). Do not point the web SDK at port `3000` — that port is for the other SDKs only.

SDK credentials (`api-key` and `app-key`) are sent on every request — see [Client SDK authentication](./sdk/authentication.md).

Full Docker and Kubernetes deployment examples are in the next page: [Deploying Vascular Inbox](./deploying.md).
