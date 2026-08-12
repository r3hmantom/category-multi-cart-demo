import { useMemo, useState } from 'react'
import { CATEGORIES, PRODUCTS, type CategoryId } from './data'
import './App.css'

type CartMap = Record<CategoryId, Record<string, number>>

function emptyCarts(): CartMap {
  return {
    produce: {},
    dairy: {},
    bakery: {},
    pantry: {},
  }
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('produce')
  const [carts, setCarts] = useState<CartMap>(emptyCarts)

  const products = useMemo(
    () => PRODUCTS.filter((p) => p.categoryId === activeCategory),
    [activeCategory],
  )

  const activeCart = carts[activeCategory]
  const cartCount = Object.values(activeCart).reduce((n, q) => n + q, 0)
  const cartTotal = PRODUCTS.filter((p) => p.categoryId === activeCategory).reduce(
    (sum, p) => sum + (activeCart[p.id] ?? 0) * p.price,
    0,
  )

  function setQty(productId: string, qty: number) {
    setCarts((prev) => {
      const next = { ...prev }
      const cart = { ...next[activeCategory] }
      if (qty <= 0) delete cart[productId]
      else cart[productId] = qty
      next[activeCategory] = cart
      return next
    })
  }

  function add(productId: string) {
    setQty(productId, (activeCart[productId] ?? 0) + 1)
  }

  function checkout() {
    const lines = PRODUCTS.filter((p) => (activeCart[p.id] ?? 0) > 0).map(
      (p) => `${activeCart[p.id]} x ${p.name}`,
    )
    alert(
      `Checkout (${CATEGORIES.find((c) => c.id === activeCategory)?.label})\n\n${lines.join('\n')}\n\nTotal: $${cartTotal.toFixed(2)}\n\nOther category carts stay untouched.`,
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">Category Multi-Cart</p>
          <h1>Shop by aisle, checkout by aisle</h1>
          <p className="subtitle">Isolated carts per category - pattern demo</p>
        </div>
        <div className="cart-summary">
          <span>{cartCount} items</span>
          <strong>${cartTotal.toFixed(2)}</strong>
          <button type="button" disabled={cartCount === 0} onClick={checkout}>
            Checkout aisle
          </button>
        </div>
      </header>

      <nav className="tabs" aria-label="Categories">
        {CATEGORIES.map((c) => {
          const count = Object.values(carts[c.id]).reduce((n, q) => n + q, 0)
          return (
            <button
              key={c.id}
              type="button"
              className={c.id === activeCategory ? 'tab active' : 'tab'}
              onClick={() => setActiveCategory(c.id)}
            >
              {c.label}
              {count > 0 ? <span className="badge">{count}</span> : null}
            </button>
          )
        })}
      </nav>

      <main className="grid">
        {products.map((p) => {
          const qty = activeCart[p.id] ?? 0
          return (
            <article key={p.id} className="card">
              <div className="card-top">
                <h2>{p.name}</h2>
                <p className="price">${p.price.toFixed(2)}</p>
              </div>
              <p className="desc">{p.description}</p>
              {qty === 0 ? (
                <button type="button" onClick={() => add(p.id)}>
                  Add to aisle cart
                </button>
              ) : (
                <div className="qty">
                  <button type="button" onClick={() => setQty(p.id, qty - 1)} aria-label="Decrease">
                    -
                  </button>
                  <span>{qty}</span>
                  <button type="button" onClick={() => add(p.id)} aria-label="Increase">
                    +
                  </button>
                </div>
              )}
            </article>
          )
        })}
      </main>
    </div>
  )
}
