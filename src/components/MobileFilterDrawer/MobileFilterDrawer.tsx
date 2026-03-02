import React, { useState } from 'react'
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
  const [showFloating, setShowFloating] = useState(false)

  // Morphing animation also on scroll up
  React.useEffect(() => {
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY > 120 && currentY > lastScrollY) {
        // Scrolling down
        setShowFloating(true)
      } else if (currentY <= 120 || currentY < lastScrollY) {
        // Scrolling up or near the top
        setShowFloating(false)
      }
      lastScrollY = currentY
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Morphing button/icon with animation */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-48 left-4 z-50 bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-500 lg:hidden mb-8"
        style={{
          width: showFloating ? '3.5rem' : '90vw',
          maxWidth: showFloating ? '3.5rem' : '22rem',
          height: showFloating ? '3.5rem' : '3rem',
          borderRadius: '9999px',
          paddingLeft: showFloating ? '0' : '1.5rem',
          paddingRight: showFloating ? '0' : '1.5rem',
          transition:
            'width 0.5s cubic-bezier(0.4,0,0.2,1), max-width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1), border-radius 0.5s cubic-bezier(0.4,0,0.2,1), padding 0.5s cubic-bezier(0.4,0,0.2,1), background 0.5s, color 0.5s',
          willChange: 'width, height, border-radius, padding',
        }}
        aria-label="Show filters"
      >
        <svg
          className={showFloating ? 'w-7 h-7' : 'w-5 h-5 mr-2'}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ transition: 'width 0.5s, height 0.5s, margin 0.5s' }}
        >
          <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
        </svg>
        <span
          className="font-medium"
          style={{
            opacity: showFloating ? 0 : 1,
            width: showFloating ? 0 : 'auto',
            marginLeft: showFloating ? 0 : '0.5rem',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transition:
              'opacity 0.5s cubic-bezier(0.4,0,0.2,1), width 0.5s cubic-bezier(0.4,0,0.2,1), margin 0.5s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          Filters
        </span>
      </button>

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
