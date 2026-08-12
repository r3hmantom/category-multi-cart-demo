import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  CATEGORIES,
  type CartByCategory,
  type CartLine,
  type CategoryId,
  productById,
} from './data'

const STORAGE_KEY = 'category-multi-cart-v1'

function emptyCarts(): CartByCategory {
  return { outdoors: [], studio: [], kitchen: [] }
}

function loadCarts(): CartByCategory {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyCarts()
    const parsed = JSON.parse(raw) as CartByCategory
    return { ...emptyCarts(), ...parsed }
  } catch {
    return emptyCarts()
  }
}

type MultiCartValue = {
  activeCategory: CategoryId
  setActiveCategory: (id: CategoryId) => void
  carts: CartByCategory
  addItem: (productId: string) => void
  setQuantity: (categoryId: CategoryId, productId: string, quantity: number) => void
  clearCategory: (categoryId: CategoryId) => void
  activeLines: CartLine[]
  activeCount: number
  activeTotal: number
  allCount: number
}

const MultiCartContext = createContext<MultiCartValue | null>(null)

export function MultiCartProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('outdoors')
  const [carts, setCarts] = useState<CartByCategory>(() => emptyCarts())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setCarts(loadCarts())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carts))
  }, [carts, hydrated])

  const addItem = useCallback((productId: string) => {
    const product = productById(productId)
    if (!product) return
    const categoryId = product.categoryId
    setCarts((prev) => {
      const lines = prev[categoryId]
      const existing = lines.find((l) => l.productId === productId)
      const nextLines = existing
        ? lines.map((l) =>
            l.productId === productId ? { ...l, quantity: l.quantity + 1 } : l,
          )
        : [...lines, { productId, quantity: 1 }]
      return { ...prev, [categoryId]: nextLines }
    })
    setActiveCategory(categoryId)
  }, [])

  const setQuantity = useCallback(
    (categoryId: CategoryId, productId: string, quantity: number) => {
      setCarts((prev) => {
        const nextLines =
          quantity <= 0
            ? prev[categoryId].filter((l) => l.productId !== productId)
            : prev[categoryId].map((l) =>
                l.productId === productId ? { ...l, quantity } : l,
              )
        return { ...prev, [categoryId]: nextLines }
      })
    },
    [],
  )

  const clearCategory = useCallback((categoryId: CategoryId) => {
    setCarts((prev) => ({ ...prev, [categoryId]: [] }))
  }, [])

  const activeLines = carts[activeCategory]
  const activeCount = activeLines.reduce((n, l) => n + l.quantity, 0)
  const activeTotal = activeLines.reduce((sum, l) => {
    const p = productById(l.productId)
    return sum + (p?.price ?? 0) * l.quantity
  }, 0)
  const allCount = CATEGORIES.reduce(
    (n, c) => n + carts[c.id].reduce((m, l) => m + l.quantity, 0),
    0,
  )

  const value = useMemo(
    () => ({
      activeCategory,
      setActiveCategory,
      carts,
      addItem,
      setQuantity,
      clearCategory,
      activeLines,
      activeCount,
      activeTotal,
      allCount,
    }),
    [
      activeCategory,
      carts,
      addItem,
      setQuantity,
      clearCategory,
      activeLines,
      activeCount,
      activeTotal,
      allCount,
    ],
  )

  return (
    <MultiCartContext.Provider value={value}>{children}</MultiCartContext.Provider>
  )
}

export function useMultiCart() {
  const ctx = useContext(MultiCartContext)
  if (!ctx) throw new Error('useMultiCart must be used within MultiCartProvider')
  return ctx
}
