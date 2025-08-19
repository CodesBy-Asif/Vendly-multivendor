import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BiUpload } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { addToCart } from "../redux/actions/Cart";

function ProductDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const { seller } = useSelector((state) => state.seller);
  const { products, loading } = useSelector((state) => state.products);
  useEffect(() => {
    if (!loading) {
      if (products.length > 0) {
        const prod = products.find((product) => product._id === id);

        if (prod) {
          setData(prod);

          if (prod.images?.length > 0 && prod.images[0].url) {
            setMainImage(prod.images[0].url);
          } else if (prod.image) {
            setMainImage(prod.image);
          } else {
            setMainImage("");
          }
        } else {
          setData(null);
          setMainImage("");
        }
      } else {
        // loading is false, and no products
        setData(null);
        setMainImage("");
      }
    }
  }, [id, loading, products]);

  let shopProducts;
  if (data) {
    shopProducts = products.filter(
      (product) =>
        product.shop?._id === data.shop._id || product.shop === data.shop._id
    );
  }
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link.");
      });
  };
  if (loading) {
    return (
      <div className="p-4 text-center text-lg">Loading product details...</div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-center text-red-500">Product not found.</div>
    );
  }

  const extraImages = data.images?.map((img) => img.url) || [data.image];
  return (
    <>
      {/* Breadcrumb + Share */}
      <div className="flex justify-between items-center mx-auto bg-muted px-6 py-5 text-md font-medium text-muted-foreground">
        <div className="max-w-7xl">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span>{" > "}</span>
          <Link to="/products" className="hover:underline">
            Products
          </Link>
          <span>{" > "}</span>
          {data.name.slice(0, 50)}
        </div>
        {data?.shop?._id === seller?._id ? (
          <a
            href="/shop/dashboard"
            className="ml-4 bg-accent px-4 py-2 rounded-md flex gap-2 items-center text-md text-primary"
          >
            <BiUpload /> Go To Dashboard
          </a>
        ) : (
          <button
            onClick={handleShare}
            className="ml-4 bg-accent px-4 py-2 rounded-md flex gap-2 items-center text-md text-primary"
          >
            <BiUpload /> Share
          </button>
        )}
      </div>

      {/* Product Detail */}
      <div className="p-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 bg-[#f9fafb]">
        {/* Left: Images */}
        <div className="w-full md:w-1/2">
          <div className="sticky top-30">
            <div className="w-full max-w-md mx-auto rounded-xl px-8 py-4 bg-white shadow">
              <img
                src={mainImage}
                alt={data.name}
                className="object-cover w-full"
              />
            </div>
            <div className="mt-4 overflow-x-scroll scrollable flex gap-2 justify-center">
              {extraImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumb ${index}`}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    mainImage === img ? "border-primary" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 space-y-4 bg-white p-6 rounded-xl shadow">
          <h1 className="text-3xl font-bold">{data.name}</h1>
          <p className="text-sm text-gray-500">
            Category: {data.category || "Uncategorized"}
          </p>
          <p className="text-gray-700">{data.shortDescription}</p>

          <div className="text-xl font-semibold text-primary">
            ${data.price}
            <span className="ml-2 text-gray-500 line-through text-base">
              {data.oldPrice || `$${(parseFloat(data.price) + 50).toFixed(2)}`}
            </span>
            <span className="ml-2 text-green-600 text-sm">
              {data.discount || "10% OFF"}
            </span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mt-4">
            <label htmlFor="quantity" className="font-medium">
              Quantity:
            </label>
            <div className="flex items-center border border-border rounded overflow-hidden">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1 hover:text-primary text-lg"
              >
                −
              </button>
              <input
                type="number"
                id="quantity"
                min={1}
                max={data.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-12 text-center border-l border-r"
              />
              <button
                onClick={() =>
                  setQuantity((prev) => Math.min(prev + 1, data.stock))
                }
                className="px-3 py-1 hover:text-primary text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart & Favorite */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mt-6">
            <button
              className="bg-primary w-full md:w-1/2 text-white px-6 py-2 rounded hover:bg-primary-dark transition"
              onClick={() => {
                dispatch(addToCart(data));
              }}
            >
              Add to Cart
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex w-full md:w-1/2 items-center gap-2 px-4 py-2 border rounded ${
                isFavorite
                  ? "text-red-600 border-red-300 bg-red-50"
                  : "text-gray-600 border-gray-300"
              } hover:bg-gray-100`}
            >
              <AiOutlineHeart className="text-xl" />
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </button>
          </div>

          {/* Shop Info */}
          <div className="flex items-center flex-wrap gap-5 justify-between border rounded-lg p-3 bg-gray-50">
            <div className="flex items-center gap-3">
              <img
                src={data.shop.logo.url}
                alt={data.shop.shopName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-secondary">Sold by</p>
                <a
                  href={`/shop/${data.shop._id}`}
                  className="text-md hover:underline font-semibold text-muted-foreground"
                >
                  {data.shop.shopName}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto mt-10 px-4">
        <div className="flex text-sm font-medium">
          {["details", "reviews", "seller"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`sm:px-4 sm:py-2 px-2 py-1 text-sm capitalize ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              {tab === "details"
                ? "Product Details"
                : tab === "reviews"
                ? "Reviews"
                : "Seller Info"}
            </button>
          ))}
        </div>

        <div className="mt-4 bg-white p-6 rounded-lg shadow text-sm leading-relaxed">
          {activeTab === "details" && (
            <div>
              <p>{data.description}</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 className="font-semibold text-lg mb-2">User Reviews:</h3>
              <p className="text-gray-600">
                ⭐{data.rating} based on {data.totalReviews} reviews
              </p>
              <div className="mt-2 space-y-2">
                {data.reviews?.length > 0 ? (
                  data.reviews.slice(0, 10).map((review, index) => (
                    <div key={index} className="border p-3 rounded">
                      <p className="font-medium">{review.user.full_name}</p>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "seller" && (
            <div className="flex justify-between flex-col-reverse md:flex-row-reverse gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">About Seller:</h3>
                <p className="mb-2 text-gray-700">{data.shop.description}</p>
              </div>
              <div className="border p-3 min-w-max border-border shadow-md rounded bg-accent">
                <div className="flex gap-5 items-start mb-4">
                  <img
                    src={data.shop.logo.url}
                    alt={data.shop.shopName}
                    className="rounded-full w-16"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-nowrap">
                      {data.shop.shopName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Joined on:{" "}
                      {new Date(data.shop.createdAt).toLocaleDateString(
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
                <ul className="list-disc pl-6 space-y-1">
                  <li>Total Products: {shopProducts.length || 0}</li>
                  <li>Total Reviews: {data.shop.totalReviews || 0}</li>
                  <li>Average Seller Rating: ⭐{data.shop.rating || 0} / 5</li>
                </ul>
                <div className="flex gap-4">
                  <a
                    href={`/shop/${data.shop._id}`}
                    className="mt-4 bg-primary w-full text-default px-4 py-2 rounded hover:bg-primary-dark"
                  >
                    Visit Shop
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;
