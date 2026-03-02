import { useState } from 'react'
import FilterPanel from '../FilterPanel/FilterPanel'
import type { Product, FilterState } from '../../types'

interface MobileFilterDrawerProps {
  products: Product[]
  onFilterChange: (filters: FilterState) => void
  selectedColors: string[]
  priceRange: { min: number; max: number }
}

const MobileFilterDrawer = ({
  products,
  onFilterChange,
  selectedColors,
  priceRange,
}: MobileFilterDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Filter Button - Mobile Only */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium text-gray-900 min-h-[44px]"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          Filters
        </button>
      </div>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button
            onClick={() => setIsOpen(false)}
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
