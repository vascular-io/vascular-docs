import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Vascular Docs",
  description: "Developer documentation for the Vascular Platform",
  base: "/vascular-docs/",
  head: [
    ["link", { rel: "icon", type: "image/png", href: "/vascular-docs/favicon.png" }],
    ["link", { rel: "apple-touch-icon", href: "/vascular-docs/favicon.png" }],
  ],
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "Guide", link: "/guide/prerequisites" },
      { text: "Client SDKs", link: "/guide/client-integration" },
      { text: "Analytics", link: "/guide/analytics-s3" },
    ],
    sidebar: [
      {
        text: "Getting started",
        items: [
          { text: "Introduction", link: "/" },
          { text: "Prerequisites", link: "/guide/prerequisites" },
          { text: "Pull the image", link: "/guide/pull-image" },
          { text: "License activation", link: "/guide/license" },
          { text: "Envoy proxy", link: "/guide/envoy-proxy" },
          { text: "Deploying Vascular Inbox", link: "/guide/deploying" },
        ],
      },
      {
        text: "Configuration",
        items: [
          { text: "Environment variables", link: "/guide/environment-variables" },
        ],
      },
      {
        text: "Client SDKs",
        items: [
          { text: "Overview", link: "/guide/client-integration" },
          { text: "Authentication", link: "/guide/sdk/authentication" },
          { text: "Web / React", link: "/guide/sdk/web-react" },
          { text: "Flutter", link: "/guide/sdk/flutter" },
        ],
      },
      {
        text: "Integration",
        items: [
          { text: "Streaming events to S3", link: "/guide/analytics-s3" },
        ],
      },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/vascular-io/vascular-docs",
      },
    ],
    footer: {
      message: "Vascular Platform developer documentation",
      copyright: "Copyright © Vascular",
    },
  },
});
