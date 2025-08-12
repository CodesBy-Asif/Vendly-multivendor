import { useEffect, useState } from "react";
import {
  AiOutlineClose,
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillDelete,
} from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateCartQuantity, removeFromCart } from "../../redux/actions/Cart";

function CartSidebar({ isOpen, onClose }) {
  const { cart } = useSelector((state) => state.cart);
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

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[50] bg-black/60" onClick={onClose}></div>

      {/* Sidebar */}
      <div className="fixed top-0 right-0 z-[50] h-full w-[90vw] sm:w-[400px] bg-default shadow-lg border-l border-border p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-600">
            <AiOutlineClose size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className={"flex flex-col min-h-[90%] justify-between"}>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 border-b border-border pb-3"
                >
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-xs text-gray-500">
                      ${(item.DiscountPrice * item.quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className="px-1 rounded bg-muted text-muted-foreground"
                        onClick={() =>
                          dispatch(updateCartQuantity(item._id, -1))
                        }
                      >
                        <AiOutlineMinus size={14} />
                      </button>
                      <span className="px-2 text-sm">{item.quantity}</span>
                      <button
                        className="px-1 rounded bg-muted text-muted-foreground"
                        onClick={() =>
                          dispatch(updateCartQuantity(item._id, 1))
                        }
                      >
                        <AiOutlinePlus size={14} />
                      </button>
                      <button
                        className="ml-auto text-destructive hover:text-red-700"
                        onClick={() => removeItem(item._id)}
                      >
                        <AiFillDelete size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4">
              <div className="flex justify-between font-medium mb-4">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-primary text-white text-center py-2 rounded-md hover:bg-primary/90"
                onClick={onClose}
              >
                Go to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartSidebar;
