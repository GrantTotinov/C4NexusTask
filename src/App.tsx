import { useState } from 'react'
import Header from './components/Header/Header'
import type { Category } from './types'
import { products, categories } from './data/products'

function App() {
  const [activeCategory, setActiveCategory] = useState<Category['slug']>('bags')

  const handleCategoryChange = (slug: Category['slug']) => {
    setActiveCategory(slug)
  }

  const currentCategory = categories.find((cat) => cat.slug === activeCategory)
  const categoryProducts = products.filter(
    (product) => product.category === activeCategory,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {currentCategory?.name}
          </h1>
          <p className="text-gray-600">{currentCategory?.description}</p>
        </div>

        {/* Temporary Content for Testing Scroll */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">
              Products in {currentCategory?.name}
            </h2>
            <p className="text-gray-600">
              Total products: {categoryProducts.length}
            </p>
          </div>

          {/* Dummy content to enable scrolling and test sticky header */}
          {Array.from({ length: 20 }).map((_, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Section {idx + 1}</h3>
              <p className="text-gray-600">
                This is temporary content to test the sticky header behavior.
                Scroll down to see the header stick to the top of the page.
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ShopHub</h3>
              <p className="text-gray-400 text-sm">
                Your one-stop destination for quality products.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: info@shophub.com</li>
                <li>Phone: +1 234 567 890</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
