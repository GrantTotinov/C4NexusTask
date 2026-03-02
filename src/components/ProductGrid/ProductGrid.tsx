import { useState, useEffect } from 'react'
import ProductCard from '../ProductCard/ProductCard'
import type { Product } from '../../types'

interface ProductGridProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
}

const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  const [itemsPerRow, setItemsPerRow] = useState(4)
  const rowsToShow = 5
  const [visibleCount, setVisibleCount] = useState(itemsPerRow * rowsToShow)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Determine items per row based on screen size
  useEffect(() => {
    const updateItemsPerRow = () => {
      const width = window.innerWidth
      if (width < 768) {
        // Mobile: 2 columns
        setItemsPerRow(2)
      } else if (width < 1024) {
        // Tablet: 2 columns
        setItemsPerRow(2)
      } else {
        // Desktop: 4 columns
        setItemsPerRow(4)
      }
    }

    updateItemsPerRow()
    window.addEventListener('resize', updateItemsPerRow)
    return () => window.removeEventListener('resize', updateItemsPerRow)
  }, [])

  // Update visible count when itemsPerRow changes
  useEffect(() => {
    setVisibleCount(itemsPerRow * rowsToShow)
  }, [itemsPerRow])

  // Reset visible count when products change (e.g., category change)
  useEffect(() => {
    setVisibleCount(itemsPerRow * rowsToShow)
    setIsLoadingMore(false)
  }, [products, itemsPerRow])

  const visibleProducts = products.slice(0, visibleCount)
  const hasMore = visibleCount < products.length

  const loadMore = () => {
    setIsLoadingMore(true)
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      setVisibleCount((prev) => prev + itemsPerRow * rowsToShow)
      setIsLoadingMore(false)
    }, 600)
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {visibleProducts.map((product, index) => (
          <div
            key={product.id}
            style={{
              animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
            }}
          >
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </div>
        ))}

        {/* Loading More Skeletons */}
        {isLoadingMore &&
          Array.from({ length: Math.min(itemsPerRow * rowsToShow, 10) }).map(
            (_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                {/* Image skeleton */}
                <div className="aspect-square bg-gray-200"></div>

                {/* Content skeleton */}
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-gray-200 rounded"
                      ></div>
                    ))}
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ),
          )}
      </div>

      {/* Load More Button */}
      {hasMore && !isLoadingMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Load More Products
          </button>
        </div>
      )}

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="flex justify-center">
          <div className="px-8 py-3 bg-gray-400 text-white font-medium rounded-lg cursor-not-allowed flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </div>
        </div>
      )}

      {/* End of Products Message */}
      {!hasMore && products.length > 0 && (
        <div
          className="text-center text-gray-600 py-8"
          style={{ animation: 'fadeIn 0.5s ease-out' }}
        >
          <p className="text-lg font-medium">You've reached the end!</p>
          <p className="text-sm mt-2">
            All {products.length} products have been loaded.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductGrid
