interface EmptyStateProps {
  onClearFilters?: () => void
  hasActiveFilters: boolean
}

const EmptyState = ({ onClearFilters, hasActiveFilters }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fadeIn">
      {/* Icon */}
      <div className="mb-6">
        <svg
          className="w-24 h-24 text-gray-300 mx-auto"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      {/* Message */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No Products Found
      </h3>
      <p className="text-gray-600 max-w-md mb-6">
        {hasActiveFilters
          ? "We couldn't find any products matching your filters. Try adjusting your search criteria."
          : 'No products available in this category at the moment.'}
      </p>

      {/* Clear Filters Button */}
      {hasActiveFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}

export default EmptyState
