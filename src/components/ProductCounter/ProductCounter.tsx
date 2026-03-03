import type { FilterState, SortOption } from '../../types'

interface ProductCounterProps {
  totalProducts: number
  filteredCount: number
  categoryName: string
  filters: FilterState
  sortOption: SortOption
}

const ProductCounter = ({
  totalProducts,
  filteredCount,
  categoryName,
  filters,
  sortOption,
}: ProductCounterProps) => {
  const hasColorFilters = filters.selectedColors.length > 0
  const hasMaterialsFilters = filters.selectedMaterials.length > 0
  const hasActiveFilters = hasColorFilters || hasMaterialsFilters
  const isNotDefaultSort = sortOption !== 'default'

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case 'a-z':
        return 'A to Z'
      case 'z-a':
        return 'Z to A'
      case 'price-low-high':
        return 'Price: Low to High'
      case 'price-high-low':
        return 'Price: High to Low'
      default:
        return 'Default'
    }
  }

  return (
    <div className="space-y-3">
      {/* Main counter */}
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-lg font-medium text-gray-900">
          {filteredCount === totalProducts ? (
            <>
              <span className="text-blue-600">{totalProducts}</span> Products
            </>
          ) : (
            <>
              Showing <span className="text-blue-600">{filteredCount}</span> of{' '}
              <span className="text-gray-600">{totalProducts}</span> Products
            </>
          )}
        </p>
        <span className="text-gray-400">•</span>
        <p className="text-sm text-gray-600">{categoryName}</p>
      </div>

      {/* Active filters and sort badges */}
      {(hasActiveFilters || isNotDefaultSort) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active:</span>

          {/* Color filter badges */}
          {hasColorFilters &&
            filters.selectedColors.map((color) => (
              <span
                key={color}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {capitalize(color)}
              </span>
            ))}

          {/* Materials filter badges */}
          {hasMaterialsFilters &&
            filters.selectedMaterials.map((material) => (
              <span
                key={material}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {capitalize(material)}
              </span>
            ))}

          {/* Sort badge */}
          {isNotDefaultSort && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Sort: {getSortLabel(sortOption)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductCounter
