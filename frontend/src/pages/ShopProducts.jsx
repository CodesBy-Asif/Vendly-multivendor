const handleEditProduct = (product) => {
  // open edit form or redirect to /edit-product/:id
};

const handleDeleteProduct = async (productId) => {
  try {
    await axios.delete(`${server}/product/${productId}`);
    // remove from local state or refetch
    setShopProducts((prev) => prev.filter((p) => p._id !== productId));
  } catch (err) {
    console.error("Failed to delete product:", err);
  }
};

// Inside renderProducts() return:
<ShopProducts
  products={filteredProducts}
  onEdit={handleEditProduct}
  onDelete={handleDeleteProduct}
/>;
