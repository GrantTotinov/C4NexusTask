# ShopHub — Product Listing Page

C4 Nexus Junior Developer Technical Task

---

## What's Been Built

A fully functional Product Listing Page (PLP) built with React,TypeScript and Tailwind css v4. The app simulates a real e-commerce experience with four product categories, filters, sorting, a cart, and responsive layout across all screen sizes.

## Demo
<p align="center">
  <img src="https://i.imgur.com/bgAQOAW.gif" width="800"/>
</p>
### Features

**Navigation & Layout**

- Sticky header with logo and category navigation
- Four categories: Bags, Shoes, Accessories, Suits — each with 40 products
- Category title and description section on page load
- Breadcrumb navigation
- Responsive mobile navigation (pill-style buttons below the header)

**Product Grid**

- 4-column grid on desktop, 2-column on mobile/tablet
- Initial load capped at 5 rows — further products revealed via Load More
- Load More loads the next batch of rows with a loading animation
- "You've reached the end" message when all products are displayed
- Animated skeleton loaders on category switch and load more

**Product Cards**

- Product image with hover zoom effect
- Name, short description, star rating, price
- Discounted price with original shown crossed out + SALE badge
- Add to Cart button with inline feedback (loading → success state)

**Filtering (left sidebar)**

- Color filter with visual color swatches
- Materials filter with checkboxes
- Price range with a dual-handle slider
- Filters reset automatically when switching categories
- Active filters shown as badges above the product grid
- Clear All button

**Sorting**

- Dropdown above the grid: Default, A–Z, Z–A, Price Low–High, Price High–Low
- Active sort shown as a badge alongside filter badges

**Search**

- Search bar filters by product name and description in real time
- Result count displayed below the input

**Product Counter**

- Shows "x of y products" based on current filters/search

**Cart**

- Slide-in cart drawer from the right
- Add, remove, update quantity
- Calculates total price including discounts
- Cart icon in header with live item count badge

**Mobile Filters**

- Full-screen filter drawer on mobile/tablet
- Floating filter button that morphs into a pill when scrolled past the breadcrumb

**Other**

- Empty state UI when no products match the filters
- Footer with Terms & Conditions, Privacy Policy, Contact Us, social links

---

## Tech Stack

- **React 19** with **TypeScript**
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — utility-first styling
- **Custom hooks** — `useToggle`, `usePriceRange`, `useLocalStorage`
- **Sample data** — static JSON-style TypeScript file (`src/data/products.ts`) with 160 products across 4 categories
- No UI libraries, no pre-built templates, no e-commerce frameworks

---

## Project Structure

```
src/
├── components/
│   ├── CartDrawer/
│   ├── CategoryHeader/
│   ├── EmptyState/
│   ├── FilterPanel/
│   ├── Header/
│   ├── LoadingSkeleton/
│   ├── MobileFilterDrawer/
│   ├── ProductCard/
│   ├── ProductCounter/
│   ├── ProductGrid/
│   ├── SearchBar/
│   └── SortDropdown/
├── data/
│   └── products.ts        # All sample data
├── hooks/
│   ├── filters/
│   ├── storage/
│   └── ui/
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How the Solution Works

All state lives in `App.tsx` and flows down as props. When a category is selected, the product list is filtered to that category first. The filters, sort, and search are then applied on top of that filtered list using `useMemo` to avoid unnecessary recalculations. Switching categories resets all filters and search.

The Load More logic in `ProductGrid` tracks how many products are currently visible and reveals the next batch on each click. The initial visible count is calculated based on the current number of columns × 5 rows, and updates dynamically when the screen is resized.

The filter panel and mobile drawer share the same `FilterPanel` component — the drawer just wraps it in a full-screen overlay with a close button.

---

## Challenges

**Dual-range price slider** — HTML doesn't have a native dual-handle range input, so two overlapping `<input type="range">` elements are layered on top of each other with different z-indices. The active track between the two handles is drawn using a styled div that calculates its position from the current min/max values as percentages.

**Morphing filter button** — On mobile, the filter button sits inline in the breadcrumb row. When the user scrolls past it, it transitions into a floating circular button on the left edge of the screen. This is handled with a scroll listener and inline style transitions rather than CSS classes to allow smooth interpolation between the two states.

**Filter reset on category change** — Price range bounds change per category since each category has different product prices. The `usePriceRange` hook calculates the min/max from the current category's products, and a `useEffect` watches for category changes to reset the filter state with the new bounds.

---

## Sample Data

160 products across 4 categories (40 per category). Products include a mix of discounted and full-price items, multiple colors and materials per product, and varied ratings to properly demonstrate all filtering, sorting, and display features.
