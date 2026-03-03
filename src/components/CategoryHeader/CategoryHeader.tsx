import React, { useEffect } from 'react'
import { useToggle } from '../../hooks/ui/useToggle'
import type { Category } from '../../types'

interface CategoryHeaderProps {
  category: Category
  onFilterClick?: () => void
}

const CategoryHeader = ({ category, onFilterClick }: CategoryHeaderProps) => {
  const floating = useToggle(false)
  const breadcrumbsRef = React.useRef<HTMLDivElement>(null)

  // Morphing animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!breadcrumbsRef.current) return

      const breadcrumbsRect = breadcrumbsRef.current.getBoundingClientRect()

      // If breadcrumbs is out of viewport (scrolled past it), show floating button
      if (breadcrumbsRect.bottom < 0) {
        floating.open()
      } else {
        // If breadcrumbs is visible, show button in its place
        floating.close()
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position
    return () => window.removeEventListener('scroll', handleScroll)
  }, [floating])
  return (
    <div className="mb-8" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Breadcrumbs */}
      <nav className="mb-4" ref={breadcrumbsRef}>
        <div className="flex items-center justify-between">
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

          {/* Morphing filter button - visible for mobile and tablet */}
          <button
            onClick={onFilterClick}
            className="lg:hidden bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-500"
            style={{
              position: floating.isOpen ? 'fixed' : 'relative',
              left: floating.isOpen ? '0' : 'auto',
              top: floating.isOpen ? '12rem' : 'auto',
              zIndex: floating.isOpen ? 50 : 'auto',
              width: floating.isOpen ? '3.5rem' : '5rem',
              height: floating.isOpen ? '3.5rem' : '2.5rem',
              borderRadius: '9999px',
              paddingLeft: floating.isOpen ? '0' : '0.75rem',
              paddingRight: floating.isOpen ? '0' : '0.75rem',
              transition:
                'width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1), border-radius 0.5s cubic-bezier(0.4,0,0.2,1), padding 0.5s cubic-bezier(0.4,0,0.2,1), background 0.5s, color 0.5s, left 0.5s, top 0.5s',
              willChange: 'width, height, border-radius, padding, position',
            }}
            aria-label="Show filters"
          >
            <svg
              className={floating.isOpen ? 'w-6 h-6' : 'w-4 h-4'}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                transition: 'width 0.5s, height 0.5s, margin 0.5s',
                marginRight: floating.isOpen ? 0 : '0.25rem',
              }}
            >
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            <span
              className="text-xs font-medium"
              style={{
                opacity: floating.isOpen ? 0 : 1,
                width: floating.isOpen ? 0 : 'auto',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition:
                  'opacity 0.5s cubic-bezier(0.4,0,0.2,1), width 0.5s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              Filters
            </span>
          </button>
        </div>
      </nav>

      {/* Main Header Content */}
      <div className="relative">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl transform -rotate-1"></div>

        {/* Content - hidden on mobile */}
        <div className="hidden md:block relative bg-white rounded-2xl shadow-md p-4 md:p-5 border border-gray-100">
          {/* Category Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2 tracking-tight">
            {category.name}
          </h1>

          {/* Category Description */}
          <p className="text-sm md:text-base text-gray-600 max-w-2xl leading-snug">
            {category.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CategoryHeader
