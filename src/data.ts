export type CategoryId = 'outdoors' | 'studio' | 'kitchen'

export type Product = {
  id: string
  categoryId: CategoryId
  name: string
  price: number
  blurb: string
}

export type CartLine = {
  productId: string
  quantity: number
}

export type CartByCategory = Record<CategoryId, CartLine[]>

export const CATEGORIES: { id: CategoryId; label: string; tagline: string }[] = [
  { id: 'outdoors', label: 'Outdoors', tagline: 'Trail-ready gear' },
  { id: 'studio', label: 'Studio', tagline: 'Desk & creative tools' },
  { id: 'kitchen', label: 'Kitchen', tagline: 'Everyday cookware' },
]

export const PRODUCTS: Product[] = [
  { id: 'o1', categoryId: 'outdoors', name: 'Pack 28L', price: 89, blurb: 'Light daypack with sternum strap.' },
  { id: 'o2', categoryId: 'outdoors', name: 'Trail Bottle', price: 24, blurb: 'Insulated 750ml.' },
  { id: 'o3', categoryId: 'outdoors', name: 'Camp Light', price: 36, blurb: 'USB-C lantern.' },
  { id: 's1', categoryId: 'studio', name: 'Focus Lamp', price: 64, blurb: 'Warm dimmable desk lamp.' },
  { id: 's2', categoryId: 'studio', name: 'Notebook Set', price: 18, blurb: 'Dot-grid, 3 pack.' },
  { id: 's3', categoryId: 'studio', name: 'Desk Mat', price: 42, blurb: 'Cork surface, stitched edge.' },
  { id: 'k1', categoryId: 'kitchen', name: 'Skillet 10"', price: 55, blurb: 'Seasoned cast iron.' },
  { id: 'k2', categoryId: 'kitchen', name: 'Herb Shears', price: 16, blurb: 'Spring-loaded, dishwasher safe.' },
  { id: 'k3', categoryId: 'kitchen', name: 'Pour Kettle', price: 48, blurb: 'Gooseneck, 1L.' },
]

export function productById(id: string) {
  return PRODUCTS.find((p) => p.id === id)
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}
