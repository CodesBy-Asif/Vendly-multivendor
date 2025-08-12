import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "../redux/actions/product";
import { toast } from "react-toastify";
import { Save, DollarSign } from "lucide-react";

const EditProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products } = useSelector((state) => state.products);
  const product = products.find((prod) => prod._id === id);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: 0,
    DiscountPrice: 0,
    stock: "",
  });

  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        price: product.price || "",
        DiscountPrice: product.DiscountPrice || "",
        stock: product.stock || "",
      });
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    const updatedFields = {
      ...productData,
    };
    const result = await dispatch(updateProduct(id, updatedFields));
    if (result?.success) {
      toast.success("Product updated successfully!");
      navigate("/dashboard/products");
    } else {
      toast.error(result?.error || "Failed to update product.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
            <p className="text-muted-foreground">
              Update basic product details
            </p>
          </div>
          <button
            onClick={handleUpdate}
            className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Save size={16} />
            <span>Update</span>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={productData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Short Description
            </label>
            <textarea
              value={productData.shortDescription}
              onChange={(e) =>
                handleInputChange("shortDescription", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Description
            </label>
            <textarea
              value={productData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-2.5 text-muted-foreground"
                  size={16}
                />
                <input
                  type="number"
                  value={productData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Discount Price
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-2.5 text-muted-foreground"
                  size={16}
                />
                <input
                  type="number"
                  value={productData.DiscountPrice}
                  onChange={(e) =>
                    handleInputChange("DiscountPrice", e.target.value)
                  }
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                value={productData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
