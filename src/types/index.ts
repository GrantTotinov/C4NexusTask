// Product type definition
export interface Product {
  id: string
  name: string
  description: string
  price: number
  discountPrice?: number // Optional - only for products on sale
  image: string
  category: 'bags' | 'shoes' | 'accessories' | 'suits'
  color: string[] // Array of colors
  rating: number // 1 to 5
}

// Category type definition
export interface Category {
  id: string
  name: string
  slug: 'bags' | 'shoes' | 'accessories' | 'suits'
  description: string
}

// Filter state for managing active filters
export interface FilterState {
  selectedColors: string[]
  priceRange: {
    min: number
    max: number
  }
}

// Sort options as a union type
export type SortOption =
  | 'default'
  | 'a-z'
  | 'z-a'
  | 'price-low-high'
  | 'price-high-low'

// Helper type for sort option display
export interface SortOptionConfig {
  value: SortOption
  label: string
}

// Cart item type definit (Product + quantity)
export interface CartItem {
  product: Product
  quantity: number
}
