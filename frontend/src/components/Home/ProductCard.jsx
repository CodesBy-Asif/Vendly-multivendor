import React from "react";
import Tilt from "react-parallax-tilt";
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
  isFavorite as isFavoriteFn,
} from "../../redux/actions/Favirotes";
import { addToCart } from "../../redux/actions/Cart";
import { toast } from "react-toastify";

const ProductCard = ({ product, onViewDetails }) => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.favorites);

  const isFav = isFavoriteFn(favorites, product._id);
  const handleToggle = (product) => {
    if (isFav) {
      dispatch(removeFavorite(product._id));
    } else {
      dispatch(addFavorite(product));
    }
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
    : 0;

  return (
    <Tilt
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      perspective={1000}
      className="bg-default rounded-2xl shadow-lg p-4 w-full max-w-sm transition-transform duration-300 hover:shadow-xl relative"
    >
      {/* Favorite Icon */}
      <button
        className="absolute top-4 right-4 text-muted hover:text-primary transition"
        aria-label="Toggle Favorite"
        onClick={() => handleToggle(product)}
      >
        {isFav ? (
          <AiFillHeart size={22} color="var(--color-primary)" />
        ) : (
          <AiOutlineHeart size={22} />
        )}
      </button>

      {/* Discount Badge */}
      {hasDiscount && (
        <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
          {discountPercentage}% OFF
        </span>
      )}

      {/* Product Image */}
      <img
        src={mainImage}
        alt={product.name || "Product Image"}
        className="w-full h-52 object-contain mb-4"
      />

      {/* Title */}
      <h3
        className="text-lg font-semibold text-primary-dark mb-1"
        title={product.name}
      >
        {product.name?.length > 25
          ? `${product.name.slice(0, 25)}...`
          : product.name}
      </h3>

      {/* Sold Count */}
      <p className="text-sm text-muted-foreground mb-2">
        {product.Sold || 0} Sold
      </p>

      {/* Price */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-primary font-bold">
          ${parseFloat(product.DiscountPrice || product.price).toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="line-through text-gray-400 text-sm">
            ${parseFloat(product.price).toFixed(2)}
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <button
          className="w-full flex gap-2 justify-center items-center bg-primary hover:bg-primary-dark text-primary-foreground py-2 px-4 rounded-xl transition"
          onClick={() => {
            dispatch(addToCart(product));
          }}
        >
          <AiOutlineShoppingCart className="text-lg" />
          Add to Cart
        </button>

        <button
          onClick={() => onViewDetails(product)}
          className="w-full text-center py-2 px-4 rounded-xl border border-gray-300 hover:border-primary text-foreground hover:text-primary font-medium transition"
        >
          View Details
        </button>
      </div>
    </Tilt>
  );
};

export default ProductCard;
