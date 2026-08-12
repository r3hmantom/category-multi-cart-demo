import { useState } from 'react'
import { CATEGORIES, PRODUCTS, formatMoney, productById } from './data'
import { MultiCartProvider, useMultiCart } from './MultiCartContext'

function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const { allCount, activeCategory, setActiveCategory } = useMultiCart()

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--card)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div>
          <p className="text-lg font-semibold tracking-tight">Category Multi-Cart</p>
          <p className="text-sm text-[var(--muted)]">
            Isolated carts per category — pattern demo
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCart}
          className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          Carts ({allCount})
        </button>
      </div>
      <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 pb-3">
        {CATEGORIES.map((c) => {
          const active = c.id === activeCategory
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`shrink-0 rounded-md border px-3 py-1.5 text-sm transition ${
                active
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'border-[var(--line)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--accent)]'
              }`}
            >
              {c.label}
            </button>
          )
        })}
      </div>
    </header>
  )
}

function Catalog() {
  const { activeCategory, addItem } = useMultiCart()
  const category = CATEGORIES.find((c) => c.id === activeCategory)!
  const items = PRODUCTS.filter((p) => p.categoryId === activeCategory)

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">{category.label}</h1>
      <p className="mt-1 text-[var(--muted)]">{category.tagline}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="flex flex-col rounded-lg border border-[var(--line)] bg-[var(--card)] p-4 shadow-[0_1px_0_rgba(26,31,28,0.04)]"
          >
            <h2 className="text-lg font-medium">{p.name}</h2>
            <p className="mt-1 flex-1 text-sm text-[var(--muted)]">{p.blurb}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="font-medium">{formatMoney(p.price)}</span>
              <button
                type="button"
                onClick={() => addItem(p.id)}
                className="rounded-md border border-[var(--accent)] px-3 py-1.5 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
              >
                Add to cart
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    carts,
    activeCategory,
    setActiveCategory,
    setQuantity,
    clearCategory,
    activeTotal,
  } = useMultiCart()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-[var(--line)] bg-[var(--card)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
          <h2 className="text-lg font-semibold">Multi-cart</h2>
          <button type="button" onClose} className="text-sm text-[var(--muted)]">
            Close
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-[var(--line)] px-4 py-2">
          {CATEGORIES.map((c) => {
            const count = carts[c.id].reduce((n, l) => n + l.quantity, 0)
            const active = c.id === activeCategory
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`shrink-0 rounded-md px-2.5 py-1 text-sm ${
                  active ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--muted)]'
                }`}
              >
                {c.label} ({count})
              </button>
            )
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {carts[activeCategory].length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              This category cart is empty. Items from other categories stay in their own carts.
            </p>
          ) : (
            <ul className="space-y-3">
              {carts[activeCategory].map((line) => {
                const p = productById(line.productId)
                if (!p) return null
                return (
                  <li key={line.productId} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-[var(--muted)]">{formatMoney(p.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-[var(--line)]"
                        onClick={() =>
                          setQuantity(activeCategory, line.productId, line.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{line.quantity}</span>
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-[var(--line)]"
                        onClick={() =>
                          setQuantity(activeCategory, line.productId, line.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-[var(--line)] px-4 py-4">
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-[var(--muted)]">Active cart total</span>
            <span className="font-semibold">{formatMoney(activeTotal)}</span>
          </div>
          <button
            type="button"
            disabled={carts[activeCategory].length === 0}
            onClick={() => clearCategory(activeCategory)}
            className="mb-2 w-full rounded-md border border-[var(--line)] py-2 text-sm disabled:opacity-40"
          >
            Clear this category cart
          </button>
          <button
            type="button"
            disabled={carts[activeCategory].length === 0}
            className="w-full rounded-md bg-[var(--accent)] py-2.5 text-sm font-medium text-white disabled:opacity-40"
            onClick={() =>
              alert(
                `Demo checkout for “${CATEGORIES.find((c) => c.id === activeCategory)?.label}” only — other category carts stay untouched.`,
              )
            }
          >
            Checkout active cart
          </button>
        </div>
      </aside>
    </div>
  )
}

function Shell() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Header onOpenCart={() => setOpen(true)} />
      <Catalog />
      <footer className="mx-auto max-w-5xl px-4 pb-10 text-sm text-[var(--muted)]">
        Teaching demo of per-category cart isolation + localStorage persistence. Not affiliated
        with any merchant.
      </footer>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default function App() {
  return (
    <MultiCartProvider>
      <Shell />
    </MultiCartProvider>
  )
}
