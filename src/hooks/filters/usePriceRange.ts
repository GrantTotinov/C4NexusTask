import { useMemo } from 'react'
import type { Product } from '../../types'

interface PriceRange {
  min: number
  max: number
}

interface UsePriceRangeReturn {
  minPrice: number
  maxPrice: number
  priceRange: PriceRange
}

/**
 * Custom hook for calculating min/max price range from a list of products
 * Takes into account discount prices if available
 * @param products - Array of products to calculate price range from
 * @returns Object with minPrice, maxPrice, and priceRange
 */
export function usePriceRange(products: Product[]): UsePriceRangeReturn {
  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) {
      return { minPrice: 0, maxPrice: 1000 }
    }

    const prices = products.map((p) => p.discountPrice || p.price)
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    }
  }, [products])

  return {
    minPrice,
    maxPrice,
    priceRange: { min: minPrice, max: maxPrice },
  }
}
