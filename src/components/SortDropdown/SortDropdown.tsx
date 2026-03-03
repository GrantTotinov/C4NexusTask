import { useRef, useEffect } from 'react'
import { useToggle } from '../../hooks/ui/useToggle'
import type { SortOption, SortOptionConfig } from '../../types'

interface SortDropdownProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
}

const sortOptions: SortOptionConfig[] = [
  { value: 'default', label: 'Default' },
  { value: 'a-z', label: 'Name: A to Z' },
  { value: 'z-a', label: 'Name: Z to A' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
]

const SortDropdown = ({ currentSort, onSortChange }: SortDropdownProps) => {
  const dropdown = useToggle(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentOption = sortOptions.find((opt) => opt.value === currentSort)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dropdown.close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdown])

  const handleSortSelect = (sort: SortOption) => {
    onSortChange(sort)
    dropdown.close()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label
        htmlFor="sort-dropdown"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Sort by
      </label>
      <button
        id="sort-dropdown"
        onClick={dropdown.toggle}
        className="w-full sm:w-64 flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
      >
        <span className="text-gray-900">{currentOption?.label}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            dropdown.isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {dropdown.isOpen && (
        <div className="absolute z-10 w-full sm:w-64 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortSelect(option.value)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                currentSort === option.value
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option.label}</span>
                {currentSort === option.value && (
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SortDropdown
