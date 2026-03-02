import type { Category } from '../../types'

interface CategoryHeaderProps {
  category: Category
}

const CategoryHeader = ({ category }: CategoryHeaderProps) => {
  return (
    <div className="mb-8" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Breadcrumbs */}
      <nav className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <a href="/" className="hover:text-blue-600 transition-colors">
              Home
            </a>
          </li>
          <li>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7"></path>
            </svg>
          </li>
          <li className="text-gray-900 font-medium">{category.name}</li>
        </ol>
      </nav>

      {/* Main Header Content */}
      <div className="relative">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl transform -rotate-1"></div>

        {/* Content */}
        <div className="relative bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-100">
          {/* Category Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-3 tracking-tight">
            {category.name}
          </h1>

          {/* Category Description */}
          <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CategoryHeader
