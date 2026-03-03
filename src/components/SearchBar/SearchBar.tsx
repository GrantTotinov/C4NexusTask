interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  resultsCount?: number
}

const SearchBar = ({
  searchQuery,
  onSearchChange,
  resultsCount,
}: SearchBarProps) => {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-3 pl-12 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
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
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}
      </div>
      {searchQuery && resultsCount !== undefined && (
        <p className="mt-2 text-sm text-gray-600">
          Found {resultsCount} {resultsCount === 1 ? 'product' : 'products'} for
          "<span className="font-medium text-gray-900">{searchQuery}</span>"
        </p>
      )}
    </div>
  )
}

export default SearchBar
