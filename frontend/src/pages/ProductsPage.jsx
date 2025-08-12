// ProductsPage.jsx
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "../components/product/Filters.jsx";
import ProductGrid from "../components/product/ProductGrid";
import FilterDialog from "../components/product/FilterDialog";

function ProductsPage() {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (filters) => {
    const params = searchParams;

    if (filters.search) params.search = filters.search;
    if (filters.categories.length > 0)
      params.category = filters.categories.join(",");
    if (filters.brands.length > 0) params.brand = filters.brands.join(",");
    if (filters.minPrice) params.min = filters.minPrice;
    if (filters.maxPrice) params.max = filters.maxPrice;

    setSearchParams(params);
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-8 gap-6">
      {/* Mobile Filter Button */}
      <div className="lg:hidden flex justify-end">
        <button
          onClick={() => {
            setMobileFilterOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Filters
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-64 rounded-md h-fit">
        <FilterSidebar onChange={handleFilterChange} />
      </aside>

      {/* Mobile Dialog */}
      <FilterDialog
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      >
        <FilterSidebar onChange={handleFilterChange} />
      </FilterDialog>

      {/* Product Grid */}
      <div className="flex-1">
        <ProductGrid />
      </div>
    </div>
  );
}

export default ProductsPage;
