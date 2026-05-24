# vascular-docs

Developer documentation for the [Vascular Platform](https://vascular.io), built with [VitePress](https://vitepress.dev/).

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173/vascular-docs/` (or the URL printed by VitePress).

## Build

```bash
npm run build
npm run preview
```

Static output is written to `docs/.vitepress/dist`.

## Deploy to GitHub Pages

1. Create a GitHub repository named `vascular-docs` under your organization (for example `vascular-io/vascular-docs`).
2. Push this directory to the repository.
3. In GitHub → **Settings** → **Pages**, set source to **GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) publishes the site on every push to `main`.

Default site URL: `https://<org>.github.io/vascular-docs/`

### Custom domain

To serve at `https://docs.vascular.io`:

1. Add a `docs/public/CNAME` file containing `docs.vascular.io`.
2. Set `base: '/'` in `docs/.vitepress/config.ts`.
3. Configure DNS for your domain to point at GitHub Pages.

## Project structure

```
docs/
  index.md                 # Home page
  guide/                   # Documentation pages
  .vitepress/config.ts     # Site configuration
  public/                  # Static assets
```

## Related repositories

- [vascular-dashboard](https://github.com/vascular-io/vascular-dashboard) — Customer dashboard (license download, account management)
