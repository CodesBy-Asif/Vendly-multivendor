import React from "react";

function OrderSummary({
  items,
  subtotal,
  tax,
  shipping,
  total,
  applyCoupon,
  setCouponCode,
  couponCode,
  couponError,
  appliedCoupon,
}) {
  const getFinalItemPrice = (item) => {
    const price = item.DiscountPrice || item.price || 0;
    const isEligible =
      appliedCoupon?.applicableProducts?.includes(item._id) ?? false;

    if (isEligible) {
      const discounted =
        price - (price * appliedCoupon.discountPercentage) / 100;
      return {
        final: discounted,
        original: price,
        discounted,
        isEligible,
      };
    }

    return {
      final: price,
      original: price,
      discounted: 0,
      isEligible: false,
    };
  };

  return (
    <div className="bg-accent rounded-lg shadow-sm border border-border p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => {
          const { final, original, isEligible } = getFinalItemPrice(item);
          const quantity = item.quantity;

          return (
            <div key={item._id} className="flex items-center space-x-4">
              <img
                src={item.images[0]?.url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500">Qty: {quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${(final * quantity).toFixed(2)}
                </p>
                {isEligible && (
                  <p className="text-xs text-gray-400 line-through">
                    ${(original * quantity).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupon applied */}
      {appliedCoupon && (
        <div className="mb-4 p-3 bg-green-50 text-green-800 text-sm rounded-md">
          Coupon <strong>{appliedCoupon.code}</strong> applied —{" "}
          {appliedCoupon.discountPercentage}% off
        </div>
      )}

      {/* Order Totals */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-base font-semibold pt-2 border-t">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Promo Code
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          <button
            onClick={() => {
              applyCoupon(couponCode, subtotal);
            }}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
          >
            Apply
          </button>
        </div>
        {couponError && (
          <p className="text-red-500 text-sm mt-2">{couponError}</p>
        )}
      </div>
    </div>
  );
}

export default OrderSummary;
