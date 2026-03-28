import { useState, useCallback } from 'react'
import { useToggle } from './hooks/ui/useToggle'
import { usePriceRange } from './hooks/filters/usePriceRange'
import { useProductFiltering } from './hooks/filters/useProductFiltering'
import { useCart } from './hooks/cart/useCart'
import Header from './components/Header/Header'
import ProductGrid from './components/ProductGrid/ProductGrid'
import FilterPanel from './components/FilterPanel/FilterPanel'
import MobileFilterDrawer from './components/MobileFilterDrawer/MobileFilterDrawer'
import SortDropdown from './components/SortDropdown/SortDropdown'
import ProductCounter from './components/ProductCounter/ProductCounter'
import CategoryHeader from './components/CategoryHeader/CategoryHeader'
import EmptyState from './components/EmptyState/EmptyState'
import CartDrawer from './components/CartDrawer/CartDrawer'
import SearchBar from './components/SearchBar/SearchBar'
import Footer from './components/Footer/Footer'
import type { Category, FilterState, Product, SortOption } from './types'
import { products, categories } from './data/products'

const getCategoryPriceRange = (slug: Category['slug']) => {
  const categoryProducts = products.filter(
    (product) => product.category === slug,
  )

  if (categoryProducts.length === 0) {
    return { min: 0, max: 1000 }
  }

  const prices = categoryProducts.map(
    (product) => product.discountPrice || product.price,
  )

  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  }
}

function App() {
  const [activeCategory, setActiveCategory] = useState<Category['slug']>('bags')
  const initialPriceRange = getCategoryPriceRange('bags')

  // Filter products by category first
  const categoryProducts = products.filter(
    (product) => product.category === activeCategory,
  )

  // Calculate price range for current category
  const { minPrice, maxPrice } = usePriceRange(categoryProducts)

  const [filters, setFilters] = useState<FilterState>({
    selectedColors: [],
    selectedMaterials: [],
    priceRange: initialPriceRange,
  })
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [searchQuery, setSearchQuery] = useState('')
  const {
    cart,
    cartItemCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
  } = useCart()
  const cartDrawer = useToggle(false)
  const mobileFilter = useToggle(false)

  const handleCategoryChange = (slug: Category['slug']) => {
    const categoryPriceRange = getCategoryPriceRange(slug)
    setActiveCategory(slug)
    setFilters({
      selectedColors: [],
      selectedMaterials: [],
      priceRange: categoryPriceRange,
    })
    setSearchQuery('')
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

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product)
      cartDrawer.open()
    },
    [addToCart, cartDrawer],
  )

  const handleClearFilters = () => {
    setFilters({
      selectedColors: [],
      selectedMaterials: [],
      priceRange: { min: minPrice, max: maxPrice },
    })
    setSearchQuery('')
  }

  const currentCategory = categories.find((cat) => cat.slug === activeCategory)
  const sortedProducts = useProductFiltering(
    categoryProducts,
    filters,
    searchQuery,
    sortOption,
  )

  const hasActiveFilters =
    filters.selectedColors.length > 0 ||
    filters.selectedMaterials.length > 0 ||
    searchQuery.trim().length > 0 ||
    filters.priceRange.min > minPrice ||
    filters.priceRange.max < maxPrice

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
          {/* Desktop: Filter Sidebar with independent scroll */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <FilterPanel
                products={categoryProducts}
                onFilterChange={handleFilterChange}
                selectedColors={filters.selectedColors}
                selectedMaterials={filters.selectedMaterials}
                priceRange={filters.priceRange}
              />
            </div>
          </aside>

          {/* Right: Products Section */}
          <div className="flex-1">
            {/* Mobile: Filter Drawer Button */}

            {/* Mobile & Tablet: Filter Drawer Button */}
            <div className="block lg:hidden">
              <MobileFilterDrawer
                products={categoryProducts}
                onFilterChange={handleFilterChange}
                selectedColors={filters.selectedColors}
                selectedMaterials={filters.selectedMaterials}
                priceRange={filters.priceRange}
                isOpen={mobileFilter.isOpen}
                onClose={mobileFilter.close}
              />
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                resultsCount={sortedProducts.length}
              />
            </div>

            {/* Product Counter and Sort */}
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

            {/* Empty State */}
            {sortedProducts.length === 0 && (
              <EmptyState
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            )}

            {/* Product Grid with Load More */}
            {sortedProducts.length > 0 && (
              <ProductGrid
                key={`${activeCategory}-${sortOption}-${searchQuery}-${filters.selectedColors.join(',')}-${filters.selectedMaterials.join(',')}-${filters.priceRange.min}-${filters.priceRange.max}`}
                products={sortedProducts}
                onAddToCart={handleAddToCart}
              />
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
      <Footer />
    </div>
  )
}

export default App
