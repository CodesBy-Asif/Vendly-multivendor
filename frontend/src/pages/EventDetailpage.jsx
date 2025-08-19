import { useState, useEffect } from "react";
import { Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import { server } from "../Data";
import axios from "axios";
import { BiCart } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions/Cart";
const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`${server}/event/${id}`, {
          withCredentials: true,
        });
        setEvent(data.event);
      } catch (error) {
        console.error(
          "Failed to fetch event:",
          error.response?.data?.message || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedTab, setSelectedTab] = useState("description");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % event.product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + event.product.images.length) % event.product.images.length
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }
      />
    ));
  };
  if (loading || !event) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <span className="text-gray-500">Events</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-500 capitalize">
            {event.product.category.replace("-", " ")}
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{event.product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-xl  overflow-hidden shadow-sm">
              <img
                src={event.product.images[currentImageIndex]?.url}
                alt={event.name}
                className="w-full h-80 lg:h-[500px] p-8 object-contain "
              />

              {/* Image Navigation */}
              {event.product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {event.product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {event.discountPercentage > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {event.discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {event.product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {event.product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative rounded-lg overflow-hidden ${
                      index === currentImageIndex ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${event.name} ${index + 1}`}
                      className="w-full h-20 object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {event.product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(event.product.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    {event.product.rating} ({event.product.totalReviews}{" "}
                    reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {event.product.sold} sold
                </span>
              </div>
              <p className="text-gray-600 text-lg">
                {event.product.shortDescription}
              </p>
            </div>

            {/* Organizer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Organized by</h3>
                  <p className="text-blue-600 font-medium">
                    {event.shop.shopName}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(event.shop.rating)}
                    <span className="text-sm text-gray-600 ml-1">
                      ({event.shop.totalReviews} reviews)
                    </span>
                  </div>
                </div>
                <a
                  href={`/shop/${event.shop._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Profile
                </a>
              </div>
            </div>

            {/* Price and Booking */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-green-600">
                  ${event.product.DiscountPrice}
                </span>
                {event.discountPercentage > 0 && (
                  <span className="text-xl text-gray-500 line-through">
                    ${event.orignalprice}
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-4">
                <label className="font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">
                    ${(event.product.DiscountPrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      dispatch(addToCart(event.product));
                    }}
                    className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <BiCart className="inline mr-2" size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {event.product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "description", label: "Description" },
                {
                  id: "reviews",
                  label: `Reviews (${event.product.totalReviews})`,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 border-b-2 font-medium transition-colors ${
                    selectedTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.product.description}
                </p>
              </div>
            )}

            {selectedTab === "reviews" && (
              <div className="space-y-6">
                {/* Reviews Summary */}
                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {event.product.rating}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {renderStars(event.product.rating)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {event.product.totalReviews} reviews
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {event.product.reviews
                    .slice(0, showAllReviews ? event.product.reviews.length : 3)
                    .map((review) => (
                      <div
                        key={review._id}
                        className="border-b border-gray-200 pb-6 last:border-b-0"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={review.user.avatar}
                            alt={review.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">
                                {review.user.name}
                              </span>
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Show More/Less Reviews */}
                {event.product.reviews.length > 3 && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {showAllReviews ? "Show Less" : "Show All Reviews"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
