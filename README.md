# Category Multi-Cart Demo

**Live:** [category-multi-cart-demo.vercel.app](https://category-multi-cart-demo.vercel.app)

React + TypeScript teaching app for **isolated carts per category** with `localStorage` persistence. Add items in one category, switch to another, and checkout only the active cart — carts never merge.

This is portfolio work demonstrating the UX/state pattern behind multi-context shopping. It is not a Shopify integration and is not affiliated with any client.

## What it shows

- Each category keeps its own cart lines
- Switching categories does not merge carts
- Checkout targets only the selected category
- State survives refresh via `localStorage`

## Stack

- Vite
- React 19
- TypeScript
- Tailwind CSS 4

## Run locally

```bash
npm install
npm run dev
```

```bash
npm run build
```

## Related

Full storefront case study (Hydrogen / Oxygen architecture):  
[shopify-hydrogen-marketplace-case-study](https://github.com/r3hmantom/shopify-hydrogen-marketplace-case-study)

## License

MIT
