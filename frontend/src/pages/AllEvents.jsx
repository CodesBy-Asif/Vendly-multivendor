import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, List, Search } from "lucide-react";
import { toast } from "react-toastify";
import { deleteEvent, fetchEvents } from "../redux/actions/Events";
import { LoadSeller } from "../redux/actions/seller";
import Loader from "../components/Loader";
import { useEffect } from "react";

const ShopAllEventsPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const { seller } = useSelector((state) => state.seller);
  const { events, loading } = useSelector((state) => state.events);
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmed) return;

    const success = await dispatch(deleteEvent(id));
    if (success) {
      toast.success("Event deleted");
      setTimeout(() => {
        dispatch(LoadSeller());
        dispatch(fetchEvents());
      }, 1000);
    }
  };

  const sellerEvents = events.filter((e) => e?.shop?._id === seller?._id);

  let filtered = sellerEvents.filter((event) =>
    event.product.name.toLowerCase().includes(search.trim().toLowerCase())
  );
  filtered = filtered.sort((a, b) => {
    if (filter === "latest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (filter === "discount")
      return b.discountPercentage - a.discountPercentage;
    return 0;
  });
  if (loading) <Loader />;
  return (
    <div className="max-w-7xl mx-auto px-8 py-6 rounded-3xl bg-accent">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Events - {seller?.shopName || ""}
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
            <option value="latest">Latest</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-2.5 text-muted-foreground"
            size={16}
          />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
          />
        </div>
      </div>

      {/* Event List */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No events found.</p>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filtered.map((event) => (
            <div
              key={event._id}
              className={`bg-card border border-border rounded-lg p-4 shadow-sm ${
                viewMode === "list" ? "flex gap-4 items-start" : ""
              }`}
            >
              <img
                src={event.thumbnail?.url}
                alt={event.product.name}
                className={
                  viewMode === "list"
                    ? "w-28 h-28 rounded object-cover"
                    : "w-full h-48 object-cover rounded"
                }
              />
              <div className={viewMode === "list" ? "flex-1" : "pt-3"}>
                <h3 className="font-semibold mb-1 text-card-foreground">
                  {event.product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {event.discountPercentage}% OFF
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(event.startDateTime).toLocaleString()} –{" "}
                  {new Date(event.endDateTime).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <a
                    href={`/event/${event._id}`}
                    className="text-sm bg-primary text-default px-4 py-2 rounded hover:bg-primary/90"
                  >
                    View
                  </a>
                  <a
                    href={`/shop/dashboard/events/edit/${event._id}`}
                    className="text-sm bg-primary text-default px-4 py-2 rounded hover:bg-primary/90"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="text-sm bg-red-600 text-default px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopAllEventsPage;
