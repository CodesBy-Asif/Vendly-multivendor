import React, { useState } from "react";
import ProductCard from "./ProductCard";
import ProductDetailsDialog from "./ProductDetailsDialog.jsx";
import { useSelector } from "react-redux";

const FeaturedProducts = () => {
  const { products } = useSelector((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sort products by 'Sold' count (descending)
  const sortedBySold = [...products].sort((a, b) => b.Sold - a.Sold);

  return (
    <>
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">
            Featured Products
          </h2>

          <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8">
            {sortedBySold.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

export default FeaturedProducts;
