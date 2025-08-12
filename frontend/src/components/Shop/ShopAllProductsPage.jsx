import { useState } from "react";

import { Grid, List, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../redux/actions/product";
import { toast } from "react-toastify";
import { LoadSeller } from "../../redux/actions/seller";

const ShopAllProductsPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  console.log(seller);
  const filtered = [...seller.products]
    .filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => {
      if (filter === "lowToHigh") return a.price - b.price;
      if (filter === "highToLow") return b.price - a.price;
      if (filter === "rating") return b.rating - a.rating;
      return 0;
    });
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    const success = await dispatch(deleteProduct(id));
    if (success) {
      setTimeout(() => {
        dispatch(LoadSeller());
      }, 1500);
      toast.success("Product deleted");
    }
  };
  if (!seller) return <div className="p-6 text-red-500">Shop not found</div>;
  console.log(filtered[0]);
  return (
    <div className="max-w-7xl mx-auto px-8  py-8 bg-accent rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        All Products - {seller.shopName}
      </h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-card shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-card shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List size={16} />
            </button>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-border p-2 rounded-lg bg-white text-foreground"
          >
            <option value="">Default</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-2.5 text-muted-foreground"
            size={16}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
          />
        </div>
      </div>

      {/* Product List */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filtered.map((product) => (
            <div
              key={product._id}
              className={`bg-card border border-border rounded-lg p-4 shadow-sm ${
                viewMode === "list" ? "flex gap-4 items-start" : ""
              }`}
            >
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className={
                  viewMode === "list"
                    ? "w-28 h-28 rounded object-cover"
                    : "w-full h-48 object-cover rounded"
                }
              />
              <div className={viewMode === "list" ? "flex-1" : "pt-3"}>
                <h3 className="font-semibold mb-1 text-card-foreground">
                  {product.name}
                </h3>
                <div className="flex gap-4">
                  <p className="text-sm line-through text-destructive mb-2">
                    ${product.price}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    ${product.DiscountPrice}
                  </p>
                </div>
                <div className="flex gap-4 text-muted-foreground">
                  <h2>Sold: {product.Sold}</h2>
                  <h2>Stock: {product.stock}</h2>
                </div>
              </div>
              <div
                className={
                  viewMode === "list"
                    ? "flex flex-col gap-2 items-end justify-center"
                    : "flex flex-row gap-2"
                }
              >
                <a
                  href={`/products/${product._id}`}
                  className="mt-auto text-nowrap w-full text-center text-sm bg-primary text-white px-3 py-2 rounded hover:bg-primary/90"
                >
                  View Product
                </a>
                <a
                  href={`/shop/dashboard/products/edit/${product._id}`}
                  className="mt-auto text-nowrap w-full text-center text-sm bg-primary text-white px-3 py-2 rounded hover:bg-primary/90"
                >
                  Edit
                </a>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-sm text-nowrap w-full text-center bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopAllProductsPage;
