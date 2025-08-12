import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Upload,
  X,
  Package,
  Percent,
  DollarSign,
  Clock,
  ArrowLeft,
  Save,
  Loader,
} from "lucide-react";
import { updateEvent } from "../redux/actions/Events";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const { events, loading: eventsLoading } = useSelector(
    (state) => state.events
  );

  const sellerProducts = products.filter(
    (product) => product.shop._id === seller._id
  );

  // Find current event
  const currentEvent = events.find((event) => event._id === id);

  // Initial State
  const [formData, setFormData] = useState({
    product: "",
    thumbnailFile: null,
    thumbnailPreview: "",
    originalPrice: "",
    discountPercentage: 0,
    discountedPrice: "",
    startDateTime: "",
    endDateTime: "",
    existingThumbnail: null, // Store existing thumbnail URL
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load event data on component mount
  useEffect(() => {
    const loadEventData = async () => {
      if (currentEvent) {
        setFormData({
          product: currentEvent.product._id || currentEvent.product,
          thumbnailFile: null,
          thumbnailPreview: "",
          originalPrice: currentEvent.originalPrice?.toString() || "",
          discountPercentage: currentEvent.discountPercentage || 0,
          discountedPrice: currentEvent.discountedPrice?.toString() || "",
          startDateTime: currentEvent.startDateTime
            ? new Date(currentEvent.startDateTime).toISOString().slice(0, 16)
            : "",
          endDateTime: currentEvent.endDateTime
            ? new Date(currentEvent.endDateTime).toISOString().slice(0, 16)
            : "",
          existingThumbnail: currentEvent.thumbnail?.url || null,
        });
      }

      setLoading(false);
    };

    loadEventData();
  }, [currentEvent, id, dispatch]);

  // Calculate discounted price when original price or discount percentage changes
  useEffect(() => {
    if (formData.originalPrice && formData.discountPercentage) {
      const original = parseFloat(formData.originalPrice);
      const discount = parseFloat(formData.discountPercentage);
      const discounted = original - (original * discount) / 100;
      setFormData((prev) => ({
        ...prev,
        discountedPrice: discounted.toFixed(2),
      }));
    }
  }, [formData.originalPrice, formData.discountPercentage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleProductChange = (e) => {
    const selectedProduct = products.find((p) => p._id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      product: e.target.value,
      originalPrice: selectedProduct ? selectedProduct.price.toString() : "",
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnailFile: file,
        thumbnailPreview: URL.createObjectURL(file),
        existingThumbnail: null, // Clear existing thumbnail when new one is selected
      }));
    }
  };

  const removeThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnailFile: null,
      thumbnailPreview: "",
      existingThumbnail: null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.product) newErrors.product = "Product is required";
    if (!formData.originalPrice)
      newErrors.originalPrice = "Original price is required";
    if (!formData.startDateTime)
      newErrors.startDateTime = "Start date/time is required";
    if (!formData.endDateTime)
      newErrors.endDateTime = "End date/time is required";

    if (formData.startDateTime && formData.endDateTime) {
      if (new Date(formData.startDateTime) >= new Date(formData.endDateTime)) {
        newErrors.endDateTime = "End date must be after start date";
      }
    }

    if (
      formData.discountPercentage &&
      (formData.discountPercentage < 0 || formData.discountPercentage > 100)
    ) {
      newErrors.discountPercentage = "Discount must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare FormData for multipart/form-data request
      const fd = new FormData();
      fd.append("productId", formData.product);
      fd.append("originalPrice", formData.originalPrice);
      fd.append("discountPercentage", formData.discountPercentage);
      fd.append("discountedPrice", formData.discountedPrice);
      fd.append("startDateTime", formData.startDateTime);
      fd.append("endDateTime", formData.endDateTime);

      // If you have shop info from seller state
      if (seller?._id) {
        fd.append("shop", seller._id);
      }

      // Thumbnail file (only if a new one was selected)
      if (formData.thumbnailFile) {
        fd.append("thumbnail", formData.thumbnailFile);
      }

      // Dispatch Redux action
      const success = await dispatch(updateEvent(id, fd));

      if (success) {
        navigate("/shop/dashboard/events"); // Redirect to events list
      } else {
      }
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || eventsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading event data...</p>
        </div>
      </div>
    );
  }

  if (!currentEvent && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Event Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The event you're looking for doesn't exist or has been deleted.
            </p>
            <button
              onClick={() => navigate("/seller/events")}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/seller/events")}
                className="text-primary-foreground hover:text-blue-100 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-primary-foreground flex items-center gap-3">
                  <Calendar className="w-8 h-8" />
                  Edit Event
                </h1>
                <p className="text-blue-100 mt-2">
                  Update your promotional event details
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Product Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4" />
                  Product *
                </label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleProductChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.product ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a product</option>
                  {sellerProducts.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </select>
                {errors.product && (
                  <p className="text-red-500 text-sm mt-1">{errors.product}</p>
                )}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Original Price *
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.originalPrice
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.originalPrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.originalPrice}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Percent className="w-4 h-4" />
                    Discount %
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.discountPercentage
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="0"
                  />
                  {errors.discountPercentage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.discountPercentage}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Discounted Price
                  </label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-100"
                    placeholder="Auto-calculated"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.startDateTime ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.startDateTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDateTime}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  min={
                    formData.startDateTime
                      ? new Date(
                          new Date(formData.startDateTime).getTime() +
                            24 * 60 * 60 * 1000
                        )
                          .toISOString()
                          .slice(0, 16)
                      : new Date().toISOString().slice(0, 16)
                  }
                  value={formData.endDateTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.endDateTime ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.endDateTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.endDateTime}
                  </p>
                )}
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
                <Upload className="w-4 h-4" />
                Event Thumbnail
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                {formData.thumbnailPreview || formData.existingThumbnail ? (
                  <div className="relative inline-block">
                    <img
                      src={
                        formData.thumbnailPreview || formData.existingThumbnail
                      }
                      alt="Thumbnail"
                      className="max-w-xs max-h-48 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute -top-2 -right-2 bg-red-500 text-primary-foreground rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {formData.thumbnailPreview && (
                      <p className="text-sm text-green-600 mt-2">
                        New image selected
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload event thumbnail</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="bg-blue-500 text-primary-foreground px-4 py-2 rounded-lg cursor-pointer hover:bg-primary transition-colors inline-block"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/seller/events")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground font-semibold rounded-lg shadow-lg hover:from-primary-dark hover:to-primary-dark/80 focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "transform hover:scale-105"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating Event...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Update Event
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;
