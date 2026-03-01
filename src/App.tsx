import { useState, useCallback } from 'react'
import Header from './components/Header/Header'
import ProductGrid from './components/ProductGrid/ProductGrid'
import FilterPanel from './components/FilterPanel/FilterPanel'
import type { Category, FilterState } from './types'
import { products, categories } from './data/products'

function App() {
  const [activeCategory, setActiveCategory] = useState<Category['slug']>('bags')
  const [filters, setFilters] = useState<FilterState>({
    selectedColors: [],
    priceRange: { min: 0, max: 1000 },
  })

  const handleCategoryChange = (slug: Category['slug']) => {
    setActiveCategory(slug)
  }

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  const currentCategory = categories.find((cat) => cat.slug === activeCategory)

  // Filter products by category first
  const categoryProducts = products.filter(
    (product) => product.category === activeCategory,
  )

  // Then apply color and price filters
  const filteredProducts = categoryProducts.filter((product) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {currentCategory?.name}
          </h1>
          <p className="text-gray-600">{currentCategory?.description}</p>
        </div>

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
            {/* Product Counter */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {categoryProducts.length}{' '}
                products from {currentCategory?.name} collection
              </p>
            </div>

            {/* Product Grid with Load More */}
            <ProductGrid products={filteredProducts} />
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
