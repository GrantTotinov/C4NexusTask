import { categories } from '../../data/products'
import type { Category } from '../../types'

interface HeaderProps {
  activeCategory?: string
  onCategoryChange?: (slug: Category['slug']) => void
  cartItemCount?: number
  onCartClick?: () => void
}

const Header = ({
  activeCategory = 'bags',
  onCategoryChange,
  cartItemCount = 0,
  onCartClick,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-neutral-950 shadow-2xl border-b border-amber-700/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            {/* Crown SVG */}
            <svg
              className="w-8 h-8 text-amber-400 flex-shrink-0"
              viewBox="0 0 40 36"
              fill="currentColor"
            >
              <path d="M20 2 L5 13 L10 28 L30 28 L35 13 Z" fillOpacity="0.15" />
              <path d="M2 28 L6 11 L14 20 L20 5 L26 20 L34 11 L38 28 Z" />
              <rect x="2" y="29" width="36" height="5" rx="1.5" />
              <circle cx="20" cy="5" r="2.5" className="text-amber-300" />
              <circle cx="6.5" cy="11.5" r="1.8" className="text-amber-300" />
              <circle cx="33.5" cy="11.5" r="1.8" className="text-amber-300" />
            </svg>

            {/* Brand name */}
            <div className="leading-tight">
              <h1 className="text-lg font-light tracking-[0.25em] text-white uppercase">
                ShopHub
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-px w-4 bg-amber-500/70" />
                <span className="text-amber-500 text-[9px] tracking-[0.2em] uppercase font-medium">
                  Luxury
                </span>
                <div className="h-px w-4 bg-amber-500/70" />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange?.(category.slug)}
                className={`text-xs font-medium tracking-widest uppercase transition-colors duration-200 py-2 ${
                  activeCategory === category.slug
                    ? 'text-amber-400 border-b border-amber-400'
                    : 'text-neutral-400 hover:text-amber-400'
                }`}
              >
                {category.name}
              </button>
            ))}
          </nav>

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="relative p-2 hover:bg-white/10 rounded-lg transition-colors group"
          >
            <svg
              className="w-6 h-6 text-neutral-300 group-hover:text-amber-400 transition-colors"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-neutral-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange?.(category.slug)}
                className={`px-4 py-1.5 text-xs tracking-widest uppercase font-medium transition-all duration-200 border ${
                  activeCategory === category.slug
                    ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                    : 'border-neutral-700 text-neutral-400 hover:border-amber-700 hover:text-amber-500'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
