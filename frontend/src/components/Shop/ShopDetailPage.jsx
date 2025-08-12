import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  MessageCircle,
  Calendar,
  Grid,
  List,
  Search,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { server } from "../../Data";
import Loader from "../Loader";

const ShopDetailPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [viewMode, setViewMode] = useState("grid");
  const [shopInfo, setShopInfo] = useState(null);
  const [Shopproducts, setShopProducts] = useState(null);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [countdowns, setCountdowns] = useState({});

  const { id } = useParams();
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);

  useEffect(() => {
    const fetchShopById = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${server}/shops/${id}`);
        setShopInfo(res.data.shop);
      } catch (error) {
        console.error(error.response?.data?.message || "Error fetching shop");
      } finally {
        setLoading(false);
      }
    };

    fetchShopById();
  }, [id]);
  useEffect(() => {
    if (products && products.length > 0 && id) {
      const filtered = products.filter(
        (product) => product?.shop?._id === id || product?.shop === id // handles both populated & non-populated cases
      );
      setShopProducts(filtered);
      setLoading(false);
    } else {
      setShopProducts([]);
      setLoading(false);
    }
  }, [products, id]);
  const shopEvents = events?.filter(
    (event) => event?.shop?._id === id || event?.shop === id
  );
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const updatedCountdowns = {};

      events?.forEach((event) => {
        const start = new Date(event.startDateTime).getTime();
        const end = new Date(event.endDateTime).getTime();

        if (now >= start && now <= end) {
          const timeLeft = end - now;
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

          updatedCountdowns[event._id] = `${String(hours).padStart(
            2,
            "0"
          )}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(
            2,
            "0"
          )}s`;
        }
      });

      setCountdowns(updatedCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);
  if (loading)
    return (
      <div className="p-4 w-full min-h-screen">
        <Loader />
      </div>
    );
  if (!shopInfo) return <p className="p-4 text-red-500">Shop not found</p>;
  let filteredProducts = [];

  if (Shopproducts) {
    filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filter === "lowToHigh") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (filter === "highToLow") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (filter === "rating") {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    }
  }

  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      rating: 5,
      date: "2 days ago",
      comment: "Amazing quality and fast shipping! Love my new dress.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 2,
      user: "Mike Chen",
      rating: 4,
      date: "1 week ago",
      comment: "Great customer service and good product variety.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 3,
      user: "Emily Davis",
      rating: 5,
      date: "2 weeks ago",
      comment: "Best shopping experience! Will definitely come back.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 4,
      user: "Alex Rodriguez",
      rating: 4,
      date: "3 weeks ago",
      comment: "Good quality products at reasonable prices.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
  ];
  const tabs = [
    { id: "products", label: "Products", count: products?.length || 0 },
    { id: "events", label: "Events", count: events?.length || 0 },
    { id: "reviews", label: "Reviews", count: reviews?.length || 0 },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < Math.floor(rating)
            ? "text-yellow-500 fill-current"
            : "text-muted-foreground"
        }
      />
    ));
  };

  const renderProducts = () => (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            <option value="">All Products</option>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
          />
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className={`bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow ${
              viewMode === "list" ? "flex space-x-4 p-4" : "overflow-hidden"
            }`}
          >
            <img
              src={product.images[0].url}
              alt={product.name.slice(0, 20)}
              className={
                viewMode === "list"
                  ? "w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  : "w-full h-48 object-cover"
              }
            />
            <div className={viewMode === "list" ? "flex-1" : "p-4"}>
              <h3 className="font-semibold text-card-foreground mb-2">
                {product.name.slice(0, 20)}
              </h3>
              <div className="flex items-center space-x-1 mb-2">
                {renderStars(product.rating)}
                <span className="text-sm text-muted-foreground">
                  ({product.reviews.length})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  ${product.price}
                </span>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEvents = () => {
    const now = new Date();
    const activeEvents = shopEvents.filter((event) => {
      const start = new Date(event.startDateTime);
      const end = new Date(event.endDateTime);
      return now >= start && now <= end;
    });

    return (
      <div className="space-y-6">
        {activeEvents.length > 0 ? (
          activeEvents.map((event) => {
            const start = new Date(event.startDateTime);
            const end = new Date(event.endDateTime);

            return (
              <div
                key={event._id}
                className="bg-card rounded-lg flex border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={event.thumbnail.url}
                  alt={event.product.name}
                  className="w-full h-48 object-contain"
                />
                <div className="p-6">
                  <div className=" mb-3">
                    <h3 className="text-xl font-semibold text-card-foreground">
                      {event.product.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                      <Calendar size={16} />
                      <span>
                        {start.toLocaleString()} – {end.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {event.product.description.slice(0, 200)}
                  </p>

                  <div className="inline-block mb-4 text-sm  mr-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    🔴 Live Now — Ends in:{" "}
                    <span className="font-semibold">
                      {countdowns[event._id] || "Loading..."}
                    </span>
                  </div>

                  <a
                    href={`/event/${event._id}`}
                    className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-muted-foreground">
            No active events right now.
          </div>
        )}
      </div>
    );
  };

  const renderReviews = () => (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-card rounded-lg border border-border shadow-sm p-6"
        >
          <div className="flex items-start space-x-4">
            <img
              src={review.avatar}
              alt={review.user}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-card-foreground">
                  {review.user}
                </h4>
                <span className="text-sm text-muted-foreground">
                  {review.date}
                </span>
              </div>
              <div className="flex items-center space-x-1 mb-3">
                {renderStars(review.rating)}
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Shop Info */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden sticky top-8">
              {/* Shop Image */}
              <img
                src={shopInfo.logo.url}
                alt={shopInfo.shopName}
                className="w-full aspect-[16/9] object-contain"
              />

              {/* Shop Details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-card-foreground">
                    {shopInfo.shopName}
                  </h1>
                </div>

                {/* Rating & Stats */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(shopInfo.rating)}
                    <span className="font-semibold text-foreground">
                      {shopInfo.rating}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    ({shopInfo.totalReviews} reviews)
                  </span>
                </div>

                <div className="flex items-center space-x-6 mb-6">
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Established:{" "}
                      {new Date(shopInfo.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6">
                  {shopInfo.description}
                </p>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {shopInfo.address}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock size={16} className="text-muted-foreground" />
                    <span
                      className={`text-sm font-medium ${
                        shopInfo.isActive ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {shopInfo.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {shopInfo.phone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {shopInfo.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Tabbed Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-card rounded-lg border border-border shadow-sm mb-6">
              <div className="flex border-b border-border">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-primary border-b-2 border-primary bg-muted/50"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        activeTab === tab.id
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-card rounded-lg border border-border shadow-sm p-6">
              {activeTab === "products" && renderProducts()}
              {activeTab === "events" && renderEvents()}
              {activeTab === "reviews" && renderReviews()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailPage;
