import { useState } from "react";
import {
  Upload,
  X,
  Save,
  Image,
  Tag,
  Package,
  DollarSign,
  Info,
} from "lucide-react";
import { categories } from "../static/Categories";
import { useDispatch } from "react-redux";
import { createProduct } from "../redux/actions/product";
import { toast } from "react-toastify";
import { LoadSeller } from "../redux/actions/seller";

const CreateProductPage = () => {
  const dispatch = useDispatch();

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "",
    brand: "",
    sku: "",
    price: "",
    DiscountPrice: "",
    stock: "",
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    status: "draft",
    featured: false,
    tags: [],
    images: [],
  });

  const [currentTag, setCurrentTag] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [dragOver, setDragOver] = useState(false);

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Info },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "media", label: "Media", icon: Image },
  ];

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setProductData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleImageUpload = (files) => {
    const selectedFiles = Array.from(files);

    setProductData((prev) => {
      const currentImages = prev.images || [];

      // Prevent exceeding 5 images
      const availableSlots = 5 - currentImages.length;
      const limitedFiles = selectedFiles.slice(0, availableSlots);

      const newImages = limitedFiles.map((file) => ({
        id: Date.now() + Math.random(),
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }));

      return {
        ...prev,
        images: [...currentImages, ...newImages],
      };
    });
  };

  const removeImage = (imageId) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !productData.tags.includes(currentTag.trim())) {
      setProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handlePublish = async () => {
    const formData = new FormData();

    const finalData = {
      ...productData,
      status: "published",
    };

    // Append all simple fields
    formData.append("name", finalData.name);
    formData.append("description", finalData.description);
    formData.append("shortDescription", finalData.shortDescription);
    formData.append("category", finalData.category);
    formData.append("brand", finalData.brand);
    formData.append("sku", finalData.sku);
    formData.append("price", finalData.price);
    formData.append("DiscountPrice", finalData.DiscountPrice);
    formData.append("stock", finalData.stock);
    formData.append("weight", finalData.weight);
    formData.append("status", finalData.status);
    formData.append("featured", finalData.featured);

    // Append nested fields
    formData.append("dimensions", JSON.stringify(finalData.dimensions));
    formData.append("tags", JSON.stringify(finalData.tags));

    // Append images
    finalData.images.forEach((imgObj) => {
      if (imgObj.file) {
        formData.append("images", imgObj.file);
      }
    });

    const success = await dispatch(createProduct(formData));
    setTimeout(() => {
      dispatch(LoadSeller());
    }, 1500);
    if (success) {
      toast.success("Product published successfully!");

      setProductData({
        name: "",
        description: "",
        shortDescription: "",
        category: "",
        brand: "",
        sku: "",
        price: "",
        DiscountPrice: "",
        stock: "",
        weight: "",
        dimensions: { length: "", width: "", height: "" },
        status: "draft",
        featured: false,
        tags: [],
        images: [],
      });
      setCurrentTag("");
      setActiveTab("basic");
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={productData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category *
          </label>
          <select
            value={productData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Brand
          </label>
          <input
            type="text"
            value={productData.brand}
            onChange={(e) => handleInputChange("brand", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="Enter brand name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            SKU
          </label>
          <input
            type="text"
            value={productData.sku}
            onChange={(e) => handleInputChange("sku", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="Enter SKU"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Price *
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
              className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            DiscountPrice
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
              className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>
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
          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
          placeholder="Brief product description"
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
          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
          placeholder="Detailed product description"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {productData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-2 hover:text-red-500"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTag())
            }
            className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="Add tag"
          />
          <button
            onClick={addTag}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80"
          >
            <Tag size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Stock Quantity
          </label>
          <input
            type="number"
            value={productData.stock}
            onChange={(e) => handleInputChange("stock", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            value={productData.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="0.0"
            step="0.1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Dimensions (cm)
        </label>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            value={productData.dimensions.length}
            onChange={(e) =>
              handleInputChange("dimensions.length", e.target.value)
            }
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="Length"
          />
          <input
            type="number"
            value={productData.dimensions.width}
            onChange={(e) =>
              handleInputChange("dimensions.width", e.target.value)
            }
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="Width"
          />
          <input
            type="number"
            value={productData.dimensions.height}
            onChange={(e) =>
              handleInputChange("dimensions.height", e.target.value)
            }
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            placeholder="Height"
          />
        </div>
      </div>
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Product Images
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-foreground">
              Drop images here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports JPG, PNG, WEBP up to 10MB each
            </p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer mt-4"
          >
            Choose Files
          </label>
        </div>
      </div>

      {/* Image Preview */}
      {productData.images.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">
            Uploaded Images ({productData.images.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {productData.images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-32 object-cover rounded-lg border border-border"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs text-white bg-black/50 px-2 py-1 rounded truncate">
                    {image.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl  bg-accent mx-auto px-8 rounded-3xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Create Product
            </h1>
            <p className="text-muted-foreground mt-1">
              Add a new product to your store
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePublish}
              className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Save size={16} />
              <span>Publish Product</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2 sticky top-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-background rounded-lg border border-border shadow-sm p-6">
              {activeTab === "basic" && renderBasicInfo()}
              {activeTab === "inventory" && renderInventory()}
              {activeTab === "media" && renderMedia()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
