import FilterPanel from '../FilterPanel/FilterPanel'
import type { Product, FilterState } from '../../types'

interface MobileFilterDrawerProps {
  products: Product[]
  onFilterChange: (filters: FilterState) => void
  selectedColors: string[]
  priceRange: { min: number; max: number }
  isOpen: boolean
  onClose: () => void
}

const MobileFilterDrawer = ({
  products,
  onFilterChange,
  selectedColors,
  priceRange,
  isOpen,
  onClose,
}: MobileFilterDrawerProps) => {
  return (
    <>
      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden" // Overlay remains clickable, no background color
          onClick={onClose}
        />
      )}

      {/* Drawer - covers full screen on mobile */}
      <div
        className={`fixed top-0 left-0 h-screen w-screen bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div className="[&>div]:shadow-none [&>div]:rounded-none">
          <FilterPanel
            products={products}
            onFilterChange={onFilterChange}
            selectedColors={selectedColors}
            priceRange={priceRange}
          />
        </div>
      </div>
    </>
  )
}

export default MobileFilterDrawer
