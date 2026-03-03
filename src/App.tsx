import { useState, useCallback, useMemo, useEffect } from 'react'
import { useToggle } from './hooks/ui/useToggle'
import { usePriceRange } from './hooks/filters/usePriceRange'
import Header from './components/Header/Header'
import ProductGrid from './components/ProductGrid/ProductGrid'
import FilterPanel from './components/FilterPanel/FilterPanel'
import MobileFilterDrawer from './components/MobileFilterDrawer/MobileFilterDrawer'
import SortDropdown from './components/SortDropdown/SortDropdown'
import ProductCounter from './components/ProductCounter/ProductCounter'
import CategoryHeader from './components/CategoryHeader/CategoryHeader'
import LoadingSkeleton from './components/LoadingSkeleton/LoadingSkeleton'
import EmptyState from './components/EmptyState/EmptyState'
import CartDrawer from './components/CartDrawer/CartDrawer'
import SearchBar from './components/SearchBar/SearchBar'
import type {
  Category,
  FilterState,
  SortOption,
  Product,
  CartItem,
} from './types'
import { products, categories } from './data/products'

function App() {
  const [activeCategory, setActiveCategory] = useState<Category['slug']>('bags')

  // Filter products by category first
  const categoryProducts = products.filter(
    (product) => product.category === activeCategory,
  )

  // Calculate price range for current category
  const { minPrice, maxPrice } = usePriceRange(categoryProducts)

  const [filters, setFilters] = useState<FilterState>({
    selectedColors: [],
    priceRange: { min: minPrice, max: maxPrice },
  })
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const cartDrawer = useToggle(false)
  const mobileFilter = useToggle(false)

  // Cart functions
  const addToCart = useCallback((product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id,
      )
      if (existingItem) {
        // Increase quantity if already in cart
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      } else {
        // Add new item to cart
        return [...prevCart, { product, quantity: 1 }]
      }
    })
    cartDrawer.open() // Open cart drawer when item is added
  }, [cartDrawer])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId),
    )
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId)
        return
      }
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      )
    },
    [removeFromCart],
  )

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price
      return total + price * item.quantity
    }, 0)
  }, [cart])

  // Reset filters and search when category changes
  useEffect(() => {
    setFilters({
      selectedColors: [],
      priceRange: { min: minPrice, max: maxPrice },
    })
    setSearchQuery('')
  }, [activeCategory, minPrice, maxPrice])

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

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort)
  }

  const handleClearFilters = () => {
    setFilters({
      selectedColors: [],
      priceRange: { min: minPrice, max: maxPrice },
    })
    setSearchQuery('')
  }

  const currentCategory = categories.find((cat) => cat.slug === activeCategory)

  // Then apply color, price, and search filters
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
      // Search filter (by name and description)
      const searchMatch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Color filter
      const colorMatch =
        filters.selectedColors.length === 0 ||
        product.color.some((color) => filters.selectedColors.includes(color))

      // Price filter
      const productPrice = product.discountPrice || product.price
      const priceMatch =
        productPrice >= filters.priceRange.min &&
        productPrice <= filters.priceRange.max

      return searchMatch && colorMatch && priceMatch
    })
  }, [categoryProducts, filters, searchQuery])

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
        cartItemCount={cartItemCount}
        onCartClick={cartDrawer.open}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Category Header */}
        {currentCategory && (
          <CategoryHeader
            category={currentCategory}
            onFilterClick={mobileFilter.open}
          />
        )}

        {/* Main Content Area with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop: Filter Sidebar (hidden on mobile) */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <FilterPanel
              products={categoryProducts}
              onFilterChange={handleFilterChange}
              selectedColors={filters.selectedColors}
              priceRange={filters.priceRange}
            />
          </aside>

          {/* Right: Products Section */}
          <div className="flex-1">
            {/* Mobile: Filter Drawer Button */}

            {/* Mobile: Filter Drawer Button (само за мобилно) */}
            <div className="block md:hidden">
              <MobileFilterDrawer
                products={categoryProducts}
                onFilterChange={handleFilterChange}
                selectedColors={filters.selectedColors}
                priceRange={filters.priceRange}
                isOpen={mobileFilter.isOpen}
                onClose={mobileFilter.close}
              />
            </div>

            {/* Search Bar */}
            {!isLoading && (
              <div className="mb-6">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  resultsCount={filteredProducts.length}
                />
              </div>
            )}

            {/* Product Counter and Sort */}
            {!isLoading && (
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <ProductCounter
                  totalProducts={categoryProducts.length}
                  filteredCount={sortedProducts.length}
                  categoryName={currentCategory?.name || ''}
                  filters={filters}
                  sortOption={sortOption}
                />
                <div className="sm:ml-auto">
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
              <ProductGrid products={sortedProducts} onAddToCart={addToCart} />
            )}
          </div>
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawer.isOpen}
        onClose={cartDrawer.close}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        cartTotal={cartTotal}
      />

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

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col items-center gap-4">
              {/* Social Media Links */}
              <div className="flex items-center gap-6">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* Twitter */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </a>
              </div>

              {/* Copyright */}
              <p className="text-center text-sm text-gray-400">
                &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
