import { useState, useEffect } from 'react'
import type { Product, FilterState } from '../../types'

interface FilterPanelProps {
  products: Product[]
  onFilterChange: (filters: FilterState) => void
}

const FilterPanel = ({ products, onFilterChange }: FilterPanelProps) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000)
  const [absoluteMin, setAbsoluteMin] = useState(0)
  const [absoluteMax, setAbsoluteMax] = useState(1000)

  // Extract all unique colors from products
  const availableColors = Array.from(
    new Set(products.flatMap((product) => product.color)),
  ).sort()

  // Calculate min and max prices from products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p) => p.discountPrice || p.price)
      const min = Math.floor(Math.min(...prices))
      const max = Math.ceil(Math.max(...prices))
      setAbsoluteMin(min)
      setAbsoluteMax(max)
      setMinPrice(min)
      setMaxPrice(max)
    }
  }, [products])

  // Notify parent component when filters change
  useEffect(() => {
    onFilterChange({
      selectedColors,
      priceRange: { min: minPrice, max: maxPrice },
    })
  }, [selectedColors, minPrice, maxPrice, onFilterChange])

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    )
  }

  const clearFilters = () => {
    setSelectedColors([])
    setMinPrice(absoluteMin)
    setMaxPrice(absoluteMax)
  }

  const hasActiveFilters = selectedColors.length > 0

  // Capitalize first letter helper
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  // Color mapping for visual representation
  const colorMap: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    brown: '#8B4513',
    gray: '#808080',
    grey: '#808080',
    blue: '#0000FF',
    navy: '#000080',
    red: '#DC143C',
    burgundy: '#800020',
    green: '#228B22',
    olive: '#808000',
    beige: '#F5F5DC',
    tan: '#D2B48C',
    pink: '#FFC0CB',
    purple: '#800080',
    yellow: '#FFD700',
    orange: '#FF8C00',
    gold: '#FFD700',
    silver: '#C0C0C0',
  }

  const getColorStyle = (color: string) => {
    const bgColor = colorMap[color.toLowerCase()] || '#CCCCCC'
    const isLight = [
      'white',
      'beige',
      'tan',
      'yellow',
      'gold',
      'silver',
    ].includes(color.toLowerCase())
    return {
      backgroundColor: bgColor,
      border: isLight ? '2px solid #D1D5DB' : 'none',
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Color Filter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Color</h3>
        <div className="grid grid-cols-3 gap-3">
          {availableColors.map((color) => {
            const isSelected = selectedColors.includes(color)
            const colorStyle = getColorStyle(color)
            const isLight = [
              'white',
              'beige',
              'tan',
              'yellow',
              'gold',
              'silver',
            ].includes(color.toLowerCase())

            return (
              <button
                key={color}
                onClick={() => handleColorToggle(color)}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-50 ring-2 ring-blue-600'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                title={capitalize(color)}
              >
                <div
                  className={`w-10 h-10 rounded-full ${
                    isSelected ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                  }`}
                  style={colorStyle}
                />
                <span className="text-xs font-medium text-gray-700 text-center">
                  {capitalize(color)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Price Range Filter with Dual Slider */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Price Range
        </h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
            <span>${minPrice}</span>
            <span>${maxPrice}</span>
          </div>
          <div className="relative h-12">
            {/* Track */}
            <div className="absolute top-5 left-0 right-0 h-2 bg-gray-200 rounded" />
            {/* Active range */}
            <div
              className="absolute top-5 h-2 bg-blue-600 rounded"
              style={{
                left: `${((minPrice - absoluteMin) / (absoluteMax - absoluteMin)) * 100}%`,
                right: `${100 - ((maxPrice - absoluteMin) / (absoluteMax - absoluteMin)) * 100}%`,
              }}
            />
            {/* Min slider */}
            <input
              type="range"
              min={absoluteMin}
              max={absoluteMax}
              value={minPrice}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                if (value <= maxPrice) {
                  setMinPrice(value)
                }
              }}
              className="absolute w-full h-2 top-5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
            />
            {/* Max slider */}
            <input
              type="range"
              min={absoluteMin}
              max={absoluteMax}
              value={maxPrice}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                if (value >= minPrice) {
                  setMaxPrice(value)
                }
              }}
              className="absolute w-full h-2 top-5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel
