import { useSearchParams } from "react-router-dom";
import { bestDeals } from "../../static/bestDeals";
import HorizontalProductCard from "./HorizentalProductCard.jsx";
import { useSelector } from "react-redux";

/**
 * @param {string} sortBy - field to sort (e.g. 'sold', 'price')
 * @param {string} order - 'asc' or 'desc'
 */
const ProductGrid = ({ sortBy = "name", order = "asc" }) => {
  const [searchParams] = useSearchParams();
  const { products } = useSelector((state) => state.products);

  const searchText = searchParams.get("q")?.toLowerCase() || "";
  const selectedCategories = searchParams.getAll("category");
  const min = parseFloat(searchParams.get("min")) || 0;
  const max = parseFloat(searchParams.get("max")) || Infinity;

  const filtered = products.filter((product) => {
    const matchesText = product.name.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const priceValue = parseFloat(product.price) || 0;
    const matchesPrice = priceValue >= min && priceValue <= max;

    return matchesText && matchesCategory && matchesPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (typeof valueA === "string") {
      return order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return order === "asc" ? valueA - valueB : valueB - valueA;
  });

  return (
    <div className="space-y-6 ">
      {sorted.length > 0 ? (
        sorted.map((product) => (
          <HorizontalProductCard key={product._id} product={product} />
        ))
      ) : (
        <div className="text-center text-muted-foreground py-10">
          No products found with the selected filters.
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
