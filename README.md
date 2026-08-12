# Category Multi-Cart Demo

Small **React + TypeScript** demo of **isolated carts per category**, with `localStorage` persistence.

This is a portfolio teaching app — it shows the UX/state pattern behind multi-context shopping (add in category A, switch to B, checkout only the active cart). It is **not** a Shopify integration and is **not** affiliated with any client.

## Try it

```bash
npm install
npm run dev
```

```bash
npm run build
```

## What to notice

- Each category has its **own cart lines**
- Switching categories does not merge carts
- “Checkout active cart” only targets the selected category
- State survives refresh via `localStorage`

## Stack

- Vite
- React 19
- TypeScript
- Tailwind CSS 4

## Deploy

Any static host (Vercel, Netlify, Cloudflare Pages):

```bash
npm run build
# publish dist/
```

## License

MIT
