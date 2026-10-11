# TalentIQ360

Marketing site for TalentIQ360, an AI-powered workforce intelligence product.

## Development

Requires Node.js and npm.

```sh
npm install
npm run dev
```

The app runs at http://localhost:8080.

Create a local `.env` with your Supabase project URL and keys. Do not commit that file.

```
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
ZIINA_API_KEY=
ZIINA_TEST_MODE=false
```

`ZIINA_API_KEY` is the Ziina secret used only on the server. Do not prefix it with `VITE_` and do not commit it. Set `ZIINA_TEST_MODE=true` to create test payment links that do not charge a card.

## Scripts

- `npm run dev` starts the local site
- `npm run build` creates a production build
- `npm run preview` serves the production build
