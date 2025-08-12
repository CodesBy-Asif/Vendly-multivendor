import React, { useEffect, useState } from "react";
import {
  AiOutlineClose,
  AiOutlineShoppingCart,
  AiOutlineDelete,
} from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFavorite } from "../../redux/actions/Favirotes";
import { addToCart } from "../../redux/actions/Cart";

const WishlistSidebar = ({ isOpen, onClose }) => {
  const { favorites } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose}></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-default shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between favorites-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Wishlist</h2>
          <button onClick={onClose}>
            <AiOutlineClose className="text-xl" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-60px)] p-4 space-y-4">
          {favorites.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Your wishlist is empty.
            </p>
          ) : (
            favorites.map((item) => (
              <div
                key={item._id}
                className="flex favorites-center justify-between border-b border-border pb-3"
              >
                <Link
                  to={`/product/${item._id}`}
                  onClick={onClose}
                  className="flex favorites-center gap-3 w-[70%]"
                >
                  <img
                    src={item.images[0].url}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium hover:underline">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ${item.DiscountPrice}
                    </p>
                  </div>
                </Link>

                <div className="flex gap-2 favorites-center">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="text-primary hover:text-primary/80"
                    title="Add to Cart"
                  >
                    <AiOutlineShoppingCart size={20} />
                  </button>

                  <button
                    onClick={() => dispatch(removeFavorite(item._id))}
                    className="text-red-500 hover:text-red-600"
                    title="Remove"
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistSidebar;
