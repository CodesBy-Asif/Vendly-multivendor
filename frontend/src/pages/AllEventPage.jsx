import { useState, useEffect } from "react";
import {
  Grid,
  List,
  Search,
  Calendar,
  Tag,
  Clock,
  Star,
  Filter,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { categories } from "../static/Categories";

const AllEventsPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { events } = useSelector((state) => state.events);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const now = new Date();

  // Filter events by search and category
  let filtered = events.filter((event) => {
    const matchesSearch =
      event.product.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      event.product.description
        .toLowerCase()
        .includes(search.trim().toLowerCase()) ||
      event.shop.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchesCategory =
      selectedCategory === "" ||
      selectedCategory === "All" ||
      event.product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort events
  filtered = filtered.sort((a, b) => {
    if (filter === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (filter === "discount") {
      return b.discountPercentage - a.discountPercentage;
    }
    if (filter === "price-low") {
      return (
        a.orignalprice * (1 - a.discountPercentage / 100) -
        b.orignalprice * (1 - b.discountPercentage / 100)
      );
    }
    if (filter === "price-high") {
      return b.product.DiscountPrice - a.product.DiscountPrice;
    }
    if (filter === "date") {
      return new Date(a.startDateTime) - new Date(b.startDateTime);
    }
    return 0;
  });

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEventSoonToEnd = (endDateTime) => {
    const end = new Date(endDateTime);
    const diffInHours = (end - now) / (1000 * 60 * 60);
    return diffInHours < 24 && diffInHours > 0;
  };

  // Mobile Filter Component remains unchanged
  const MobileFilters = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
        showMobileFilters ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-xl transition-transform ${
          showMobileFilters ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters & Sort</h3>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={""}>All</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Default</option>
              <option value="latest">Latest Added</option>
              <option value="date">By Date</option>
              <option value="discount">Highest Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* View Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  viewMode === "grid"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  viewMode === "list"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                List View
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowMobileFilters(false)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filters Overlay */}
      <MobileFilters />

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-gray-900">
            Discover Amazing Events
          </h1>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Find and book the best events happening around you. From concerts to
            workshops, we have something for everyone.
          </p>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>
        </div>

        {/* Mobile Filter & View Toggle */}
        <div className="md:hidden flex gap-2 mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700"
          >
            <Filter size={18} />
            Filters & Sort
          </button>
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700"
          >
            {viewMode === "grid" ? <List size={18} /> : <Grid size={18} />}
          </button>
        </div>

        {/* Desktop Filters and Controls */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search events, organizers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-32"
              >
                <option value={""}>All</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-40"
              >
                <option value="">Default</option>
                <option value="latest">Latest Added</option>
                <option value="date">By Date</option>
                <option value="discount">Highest Discount</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 md:mb-6">
          <p className="text-gray-600 text-sm md:text-base">
            Showing {filtered.length} events
          </p>
        </div>

        {/* Events List */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="text-gray-500 text-lg mb-2">No events found</div>
            <p className="text-gray-400">
              Try adjusting your search criteria or browse different categories
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? `grid gap-4 md:gap-6 ${
                    isMobile
                      ? "grid-cols-1"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  }`
                : "space-y-4"
            }
          >
            {filtered.map((event) => {
              const isSoonToEnd = isEventSoonToEnd(event.endDateTime);

              return (
                <div
                  key={event._id}
                  className={`bg-background border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 ${
                    viewMode === "list" ? "flex gap-4" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      viewMode === "list" ? "w-32 md:w-48 flex-shrink-0" : ""
                    }`}
                  >
                    <img
                      src={event.thumbnail?.url}
                      alt={event.product.name}
                      className={
                        viewMode === "list"
                          ? "w-full h-full object-cover"
                          : "w-full h-48 md:h-52 object-cover"
                      }
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        {isSoonToEnd && (
                          <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                            <Clock size={10} />
                            Ending Soon
                          </span>
                        )}
                      </div>

                      {event.discountPercentage > 0 && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {event.discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-2 line-clamp-2">
                      {event.product.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {event.product.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs md:text-sm text-gray-500">
                        <Calendar size={14} className="mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {formatDateTime(event.startDateTime)}
                        </span>
                      </div>
                      <div className="flex items-center text-xs md:text-sm text-gray-500">
                        <Tag size={14} className="mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {event.product.category
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}{" "}
                          • by {event.shop.shopName}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {event.product.tags
                        .slice(0, isMobile ? 2 : 3)
                        .map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-lg md:text-xl font-bold text-green-600">
                            ${event.product.DiscountPrice}
                          </span>
                          {event.discountPercentage > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                              ${event.product.price}
                            </span>
                          )}
                        </div>
                      </div>
                      <a
                        href={"/event/" + event._id}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filtered.length > 0 && filtered.length % 12 === 0 && (
          <div className="text-center mt-8">
            <button className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors font-medium">
              Load More Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEventsPage;
