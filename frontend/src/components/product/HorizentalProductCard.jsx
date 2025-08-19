import React from "react";
import {
  AiOutlineShoppingCart,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import {
  addFavorite,
  removeFavorite,
  isFavorite as isFavoriteFn,
} from "../../redux/actions/Favirotes";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../redux/actions/Cart";

const HorizontalProductCard = ({ product }) => {
  const { favorites } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  const isFavorite = isFavoriteFn(favorites, product._id);
  const handleToggle = (product) => {
    if (isFavorite) {
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
    : null;

  return (
    <div className="bg-default flex flex-col sm:flex-row justify-between rounded-2xl shadow-md p-4 w-full max-w-5xl transition hover:shadow-lg relative">
      {/* 🖼️ Image */}
      <div className="w-full sm:w-44 flex-shrink-0 flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
        <img
          src={mainImage}
          alt={product.name || "Product Image"}
          className="w-full h-40 object-contain"
        />
      </div>

      {/* ℹ️ Details */}
      <div className="flex-1 flex flex-col justify-center gap-2 pr-4">
        <h3
          className="text-xl font-semibold text-primary-dark"
          title={product.name}
        >
          {product.name?.length > 60
            ? `${product.name.slice(0, 60)}...`
            : product.name}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {product.description?.slice(0, 200) || "No description available."}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-lg font-bold text-primary">
            $
            {parseFloat(product.DiscountPrice || product.price || 0).toFixed(2)}
          </span>
          {hasDiscount && (
            <>
              <span className="line-through text-sm text-muted-foreground">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                {discountPercentage}% OFF
              </span>
            </>
          )}
        </div>
      </div>

      {/* 🎯 Action Buttons */}
      <div className="flex flex-col gap-2 justify-center w-full sm:w-40 mt-4 sm:mt-0">
        <button
          className="border text-nowrap border-border hover:border-primary text-foreground hover:text-primary py-2 px-4 rounded-md  transition flex items-center justify-center gap-2"
          onClick={() => handleToggle(product)}
        >
          {isFavorite ? (
            <>
              {" "}
              <AiFillHeart color="var(--color-primary)" size={22} /> Favorited
            </>
          ) : (
            <>
              <AiOutlineHeart size={22} /> Favorite
            </>
          )}
        </button>

        <button
          className="w-full flex gap-2 justify-center items-center bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl py-2 transition"
          onClick={() => dispatch(addToCart(product))}
        >
          <AiOutlineShoppingCart className="text-lg" />
          Add to Cart
        </button>

        <a
          href={`/products/${product._id}`}
          className="w-full flex gap-2 justify-center items-center border border-gray-300 hover:border-primary text-foreground hover:text-primary rounded-xl py-2 transition"
        >
          <BsEye className="text-lg" />
          View Details
        </a>
      </div>
    </div>
  );
};

export default HorizontalProductCard;
