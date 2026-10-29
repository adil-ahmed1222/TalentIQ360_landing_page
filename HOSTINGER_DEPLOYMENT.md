# Hostinger deployment

TalentIQ360 is a TanStack Start application (React 19, Vite 8, Nitro). It is a Node.js server, not a static site. Checkout, payment verification, and the Supabase service role run on the server. Do not publish only the `dist` or `public` folder.

## Settings

| Setting | Value |
| --- | --- |
| Deployment type | Node.js Web App |
| Node.js version | 22, or 20.19 or newer |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Start command | `npm start` |
| Application root | repository root (the folder that contains `package.json`) |
| Static output directory | none |

`npm start` runs `scripts/start.mjs`, which listens on `PORT` (Hostinger sets this) and `0.0.0.0` unless `HOST` is already set. The server entry after the build is `.output/server/index.mjs`.

## Environment variables

Set these in the Hostinger Node.js environment before the build. Names only; do not commit values.

| Name | Required | Exposure | Purpose |
| --- | --- | --- | --- |
| `SITE_URL` | Yes, for a custom domain | Server | Public `https` origin used to allow Ziina return URLs |
| `VITE_SITE_URL` | Yes, for a custom domain | Public, baked in at build | Canonical URL, Open Graph URL, and sitemap origin |
| `SUPABASE_URL` | Yes | Server | Supabase project URL |
| `VITE_SUPABASE_URL` | Yes | Public | Same URL for the browser |
| `SUPABASE_PUBLISHABLE_KEY` | Yes | Server | Publishable Supabase key |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Public | Same publishable key for the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes for payment records | Server only | Writes `ziina_payments`. Never prefix with `VITE_` |
| `ZIINA_API_KEY` | Yes for checkout | Server only | Ziina secret. Never prefix with `VITE_` |
| `ZIINA_TEST_MODE` | Optional | Server | `false` in production. `true` creates test links that do not charge a card |

`VITE_` values are included in the client bundle. Only the publishable Supabase key and the public site URL belong there.

Use the same origin for `SITE_URL` and `VITE_SITE_URL`, with `https://` and no trailing slash. The build writes `public/sitemap.xml` and `public/robots.txt` from that origin. If those variables are empty, both files keep `https://talent-iq-360-landing-page.vercel.app`.

## Setup

1. In hPanel, create a Node.js Web App and choose Node.js 22.
2. Connect this Git repository, or upload the project without `node_modules`, `.env`, or `.output`.
3. Set the environment variables above, then run the install and build commands.
4. Set the start command to `npm start` and start the app.
5. Point the domain at the Hostinger app and enable the free SSL certificate.
6. Open `https://your-domain/`, `https://your-domain/auth`, and `https://your-domain/checkout/result`. The payment page should load and must not claim a charge succeeded.
7. Confirm `https://your-domain/sitemap.xml` lists that domain.

Ziina must also allow the production success, cancel, and failure URLs for the new domain. Checkout rejects any `https` origin other than `SITE_URL` and the existing Vercel hostname.

## Troubleshooting

- The app exits immediately: the build did not create `.output/server/index.mjs`. Run `npm run build` on the server, then `npm start`.
- Checkout says it cannot start from this address: `SITE_URL` does not match the browser origin exactly, including `https`.
- The browser reports missing Supabase variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` were missing when `npm run build` ran. Set them and build again.
- Payment records are not saved: `SUPABASE_SERVICE_ROLE_KEY` is missing, or the `ziina_payments` table has not been created. Checkout can still open Ziina.
- A payment page says it could not be verified: `ZIINA_API_KEY` is missing or Ziina rejected the lookup. Do not treat that as a successful charge.
