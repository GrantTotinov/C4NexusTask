import { useState, useCallback, useMemo } from 'react'
import Header from './components/Header/Header'
import ProductGrid from './components/ProductGrid/ProductGrid'
import FilterPanel from './components/FilterPanel/FilterPanel'
import SortDropdown from './components/SortDropdown/SortDropdown'
import ProductCounter from './components/ProductCounter/ProductCounter'
import CategoryHeader from './components/CategoryHeader/CategoryHeader'
import LoadingSkeleton from './components/LoadingSkeleton/LoadingSkeleton'
import EmptyState from './components/EmptyState/EmptyState'
import type { Category, FilterState, SortOption } from './types'
import { products, categories } from './data/products'

function App() {
  const [activeCategory, setActiveCategory] = useState<Category['slug']>('bags')
  const [filters, setFilters] = useState<FilterState>({
    selectedColors: [],
    priceRange: { min: 0, max: 1000 },
  })
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [isLoading, setIsLoading] = useState(false)

  const handleCategoryChange = (slug: Category['slug']) => {
    setIsLoading(true)
    setActiveCategory(slug)
    // Simulate loading for smooth UX
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort)
  }

  const handleClearFilters = () => {
    setFilters({
      selectedColors: [],
      priceRange: {
        min: Math.floor(
          Math.min(...categoryProducts.map((p) => p.discountPrice || p.price)),
        ),
        max: Math.ceil(
          Math.max(...categoryProducts.map((p) => p.discountPrice || p.price)),
        ),
      },
    })
  }

  const currentCategory = categories.find((cat) => cat.slug === activeCategory)

  // Filter products by category first
  const categoryProducts = products.filter(
    (product) => product.category === activeCategory,
  )

  // Then apply color and price filters
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
      // Color filter
      const colorMatch =
        filters.selectedColors.length === 0 ||
        product.color.some((color) => filters.selectedColors.includes(color))

      // Price filter
      const productPrice = product.discountPrice || product.price
      const priceMatch =
        productPrice >= filters.priceRange.min &&
        productPrice <= filters.priceRange.max

      return colorMatch && priceMatch
    })
  }, [categoryProducts, filters])

  // Apply sorting to filtered products
  const sortedProducts = useMemo(() => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Category Header */}
        {currentCategory && (
          <CategoryHeader category={currentCategory} />
        )}

        {/* Main Content Area with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Filter Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <FilterPanel
              products={categoryProducts}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Right: Products Section */}
          <div className="flex-1">
            {/* Product Counter and Sort */}
            {!isLoading && (
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <ProductCounter
                  totalProducts={categoryProducts.length}
                  filteredCount={sortedProducts.length}
                  categoryName={currentCategory?.name || ''}
                  filters={filters}
                  sortOption={sortOption}
                />
                <div className="lg:ml-auto">
                  <SortDropdown
                    currentSort={sortOption}
                    onSortChange={handleSortChange}
                  />
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && <LoadingSkeleton />}

            {/* Empty State */}
            {!isLoading && sortedProducts.length === 0 && (
              <EmptyState
                onClearFilters={handleClearFilters}
                hasActiveFilters={filters.selectedColors.length > 0}
              />
            )}

            {/* Product Grid with Load More */}
            {!isLoading && sortedProducts.length > 0 && (
              <ProductGrid products={sortedProducts} />
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ShopHub</h3>
              <p className="text-gray-400 text-sm">
                Your one-stop destination for quality products.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: info@shophub.com</li>
                <li>Phone: +1 234 567 890</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
