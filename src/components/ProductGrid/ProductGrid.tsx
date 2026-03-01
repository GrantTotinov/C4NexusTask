import { useState, useEffect } from 'react'
import ProductCard from '../ProductCard/ProductCard'
import type { Product } from '../../types'

interface ProductGridProps {
  products: Product[]
  initialItemsPerRow?: number
  initialRows?: number
}

const ProductGrid = ({
  products,
  initialItemsPerRow = 4,
  initialRows = 5,
}: ProductGridProps) => {
  const [visibleCount, setVisibleCount] = useState(
    initialItemsPerRow * initialRows,
  )

  // Reset visible count when products change (e.g., category change)
  useEffect(() => {
    setVisibleCount(initialItemsPerRow * initialRows)
  }, [products, initialItemsPerRow, initialRows])

  const visibleProducts = products.slice(0, visibleCount)
  const hasMore = visibleCount < products.length

  const loadMore = () => {
    setVisibleCount((prev) => prev + initialItemsPerRow * initialRows)
  }

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Load More Products
          </button>
        </div>
      )}

      {/* End of Products Message */}
      {!hasMore && products.length > 0 && (
        <div className="text-center text-gray-600 py-8">
          <p className="text-lg font-medium">You've reached the end!</p>
          <p className="text-sm mt-2">
            All {products.length} products have been loaded.
          </p>
        </div>
      )}

      {/* No Products Message */}
      {products.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-24 h-24 mx-auto"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No products found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or check back later.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductGrid
