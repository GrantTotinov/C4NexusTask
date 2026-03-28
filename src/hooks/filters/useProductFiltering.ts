import { useMemo } from 'react'
import type { FilterState, Product, SortOption } from '../../types'

export function useProductFiltering(
  products: Product[],
  filters: FilterState,
  searchQuery: string,
  sortOption: SortOption,
) {
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchMatch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      const colorMatch =
        filters.selectedColors.length === 0 ||
        product.color.some((color) => filters.selectedColors.includes(color))

      const materialsMatch =
        filters.selectedMaterials.length === 0 ||
        product.materials.some((material) =>
          filters.selectedMaterials.includes(material),
        )

      const productPrice = product.discountPrice || product.price
      const priceMatch =
        productPrice >= filters.priceRange.min &&
        productPrice <= filters.priceRange.max

      return searchMatch && colorMatch && materialsMatch && priceMatch
    })
  }, [products, filters, searchQuery])

  return useMemo(() => {
    const productsToSort = [...filteredProducts]

    switch (sortOption) {
      case 'a-z':
        return productsToSort.sort((a, b) => a.name.localeCompare(b.name))
      case 'z-a':
        return productsToSort.sort((a, b) => b.name.localeCompare(a.name))
      case 'price-low-high':
        return productsToSort.sort((a, b) => {
          const priceA = a.discountPrice || a.price
          const priceB = b.discountPrice || b.price
          return priceA - priceB
        })
      case 'price-high-low':
        return productsToSort.sort((a, b) => {
          const priceA = a.discountPrice || a.price
          const priceB = b.discountPrice || b.price
          return priceB - priceA
        })
      case 'default':
      default:
        return productsToSort
    }
  }, [filteredProducts, sortOption])
}
