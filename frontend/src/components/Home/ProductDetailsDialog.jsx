import { useState, useEffect } from "react";
import {
  AiOutlineClose,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addFavorite,
  removeFavorite,
  isFavorite as isFavoriteFn,
} from "../../redux/actions/Favirotes";
import { addToCart } from "../../redux/actions/Cart";
import axios from "axios";
import { server } from "../../Data";
const ProductDetailsDialog = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { favorites } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const handle = async (sellerId) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/conversation/create-new-conversation`,
        {
          userId: user._id,
          sellerId,
          groupTitle: `chat-${user._id}-${sellerId}`, // or any unique title you want
        },
        { withCredentials: true }
      );

      if (data.success) {
        // For example, navigate to conversation detail page with conversation._id
        navigate(`/dashbaord/inbox`);
      }
    } catch (error) {
      console.error(
        "Failed to create conversation:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => document.body.classList.remove("no-scroll");
  }, [isOpen]);

  if (!isOpen || !product) return null;
  const isFavorite = isFavoriteFn(favorites, product._id);
  const handleToggle = (product) => {
    if (isFavorite) {
      dispatch(removeFavorite(product._id));
    } else {
      dispatch(addFavorite(product));
    }
  };

  const handleIncrement = () =>
    setQuantity((q) => Math.min(q + 1, product.stock));
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));
  const goToProductPage = () => {
    onClose();
    navigate(`/products/${product._id || product.id}`);
  };

  const mainImage =
    product.images?.[0]?.url || product.image || "/placeholder.png";

  const hasDiscount =
    product.DiscountPrice &&
    product.price &&
    parseFloat(product.DiscountPrice) < parseFloat(product.price);

  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(product.price) - parseFloat(product.DiscountPrice)) /
          parseFloat(product.price)) *
          100
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative bg-background max-w-5xl w-full p-6 shadow-lg border border-border text-foreground max-h-[90vh] overflow-y-scroll show-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-primary hover:text-primary-dark hover:animate-pulse hover:scale-110 text-2xl transition"
        >
          <AiOutlineClose size={22} />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* 🖼️ Left Side */}
          <div className="md:w-1/3 w-full md:sticky top-0 self-start flex flex-col gap-4">
            <div className="bg-white rounded-lg p-4 flex items-center justify-center">
              <img
                src={mainImage}
                alt={product.name || "Product Image"}
                className="object-contain max-h-60"
              />
            </div>

            {/* 🏪 Shop Info */}
            {product.shop && (
              <div className="mt-2">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={product.shop.logo.url || "/shop-placeholder.png"}
                    alt={product.shop.shopName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <a
                      href={`/shop/${product.shop._id}`}
                      className="text-md font-medium"
                    >
                      {product.shop.shopName}
                    </a>
                    <p className="text-sm text-muted-foreground">
                      Rating: {product.shop.rating || 0}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handle(product.shop._id)}
                  disabled={loading}
                  className="w-full border border-border hover:border-primary text-foreground hover:text-primary py-2 px-4 rounded-md font-medium transition flex items-center justify-center gap-2"
                >
                  <AiOutlineMessage />
                  {loading ? "Loading..." : "Message Shop"}
                </button>
              </div>
            )}
          </div>

          {/* 📋 Right Side */}
          <div className="md:w-2/3 w-full overflow-y-auto pr-1">
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-2xl font-bold">{product.name}</h2>

              {discountPercentage && (
                <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  {discountPercentage}% OFF
                </span>
              )}

              <p className="text-muted-foreground text-sm">
                {product.sold || 0} sold
              </p>

              <div className="flex items-center gap-2">
                <p className="text-lg text-primary font-bold">
                  $
                  {parseFloat(product.DiscountPrice || product.price).toFixed(
                    2
                  )}
                </p>
                {hasDiscount && (
                  <p className="text-sm text-muted-foreground line-through">
                    ${parseFloat(product.price).toFixed(2)}
                  </p>
                )}
              </div>

              {product.shortDescription && (
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed whitespace-pre-wrap">
                  {product.shortDescription}
                </p>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-3 mt-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border border-border rounded-md overflow-hidden">
                  <button
                    onClick={handleDecrement}
                    className="px-3 py-1 text-lg font-semibold bg-muted hover:bg-muted-foreground text-foreground"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    max={product.stock}
                    className="w-12 text-center border-l border-r border-border text-foreground bg-background"
                  />
                  <button
                    onClick={handleIncrement}
                    className="px-3 py-1 text-lg font-semibold bg-muted hover:bg-muted-foreground text-foreground"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3 w-full">
                <button
                  className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground py-2 px-4 rounded-md font-medium transition flex items-center justify-center gap-2"
                  onClick={() => {
                    dispatch(addToCart(product));
                  }}
                >
                  <AiOutlineShoppingCart />
                  Add to Cart
                </button>

                <button
                  className="flex-1 border border-border hover:border-primary text-foreground hover:text-primary py-2 px-4 rounded-md font-medium transition flex items-center justify-center gap-2"
                  onClick={() => handleToggle(product)}
                >
                  {isFavorite ? (
                    <>
                      {" "}
                      <AiFillHeart
                        color="var(--color-primary)"
                        size={22}
                      />{" "}
                      Favorite
                    </>
                  ) : (
                    <>
                      <AiOutlineHeart size={22} /> add to Favorite
                    </>
                  )}
                </button>

                <button
                  onClick={goToProductPage}
                  className="flex-1 border border-border hover:border-primary text-foreground hover:text-primary py-2 px-4 rounded-md font-medium transition flex items-center justify-center gap-2"
                >
                  View Product Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsDialog;
