import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductDetailsDialog from "./ProductDetailsDialog.jsx";
import { useSelector } from "react-redux";
// Helper to extract numeric discount
const extractDiscount = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

const BestDeals = () => {
  const [dproducts, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { products } = useSelector((state) => state.products);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Filter products with a valid discount and sort
        const discounted = products
          .filter((p) => p.DiscountPrice && p.DiscountPrice < p.price)
          .map((p) => ({
            ...p,
            discount: extractDiscount(p.price, p.DiscountPrice),
          }))
          .sort((a, b) => b.discount - a.discount);

        setProducts(discounted);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [products]);

  return (
    <>
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">
            Best Deals of the Week
          </h2>

          <div className="grid lg:grid-cols-4 justify-items-center sm:grid-cols-2 grid-cols-1 gap-8">
            {dproducts.slice(0, 4).map((product) => (
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

export default BestDeals;
