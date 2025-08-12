import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../Data";
import { ShoppingCart } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import OrderSummary from "../components/Checkout/OrderSummary";
import ShippingForm from "../components/Checkout/ShippingForm";
import PaymentForm from "../components/Checkout/PaymentForm";
import OrderSummaryDialog from "../components/Checkout/OrderSummaryDialog";
import { useDispatch } from "react-redux";
import { createOrder } from "../redux/actions/order"; // update the path as needed
import { clearCart } from "../redux/actions/Cart";

const stripePromise = loadStripe(
  "pk_test_51Rk0gKDHBlWnfeRMZuoIE1nQlQtJGCCTjtEePTAJMFllidPCR9uFP5Pe1rLCTsPOerLycua0NaB8VRcZfmZhAHpZ00cEvXv0fR"
);

function CheckoutPage() {
  const navigate = useNavigate();

  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [mobileOrderSummaryOpen, setMobileOrderSummaryOpen] = useState(false);

  // Coupon states
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponCode, setCouponCode] = useState("");

  // Order data state
  const [orderData, setOrderData] = useState({
    shipping: {},
    payment: { method: "" },
    items: cart,
  });

  const [clientSecret, setClientSecret] = useState("");

  // Helper: Calculate final items with applied coupon discount
  const getFinalItemsWithPrice = useCallback(() => {
    return orderData.items.map((item) => {
      const price = item.DiscountPrice ?? item.price ?? 0;
      const isEligible =
        appliedCoupon?.applicableProducts?.includes(item._id) ?? false;

      let finalPrice = price;
      if (appliedCoupon && isEligible) {
        finalPrice = price - (price * appliedCoupon.discountPercentage) / 100;
      }

      return {
        ...item,
        finalPrice: parseFloat(finalPrice.toFixed(2)),
        coupon: couponCode,
      };
    });
  }, [orderData.items, appliedCoupon]);

  // Calculations using memoized final items
  const calculateSubtotal = useCallback(() => {
    return getFinalItemsWithPrice().reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0
    );
  }, [getFinalItemsWithPrice]);

  const calculateTax = useCallback(
    () => calculateSubtotal() * 0.08,
    [calculateSubtotal]
  );
  const calculateShipping = useCallback(
    () => (calculateSubtotal() > 100 ? 0 : 9.99),
    [calculateSubtotal]
  );
  const calculateTotal = useCallback(
    () => calculateSubtotal() + calculateTax() + calculateShipping(),
    [calculateSubtotal, calculateTax, calculateShipping]
  );

  // Fetch client secret when order data or total changes
  useEffect(() => {
    if (!cart.length) return;

    const fetchClientSecret = async () => {
      try {
        const finalItems = getFinalItemsWithPrice();
        const amount = calculateTotal();

        const { data } = await axios.post(`${server}/payments/create-intent`, {
          amount,
          cartItems: finalItems,
        });

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Failed to fetch client secret:", error);
      }
    };

    fetchClientSecret();
  }, [cart.length, getFinalItemsWithPrice, calculateTotal]);

  // Handle shipping form submission, move to payment step
  const handleShippingSubmit = (shippingData) => {
    setOrderData((prev) => ({ ...prev, shipping: shippingData }));
    setCurrentStep(2);
  };

  // Handle payment form submission, finalize order
  const handlePaymentSubmit = async (paymentData) => {
    const finalItems = getFinalItemsWithPrice();

    const completeOrder = {
      ...orderData,
      payment: paymentData,
      items: finalItems,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      shippingCost: calculateShipping(),
      total: calculateTotal(),
    };

    try {
      const result = await dispatch(createOrder(completeOrder));

      if (result?.error) {
        // If payment used card, refund
        if (
          paymentData.method === "card" &&
          paymentData.result?.paymentIntent?.id
        ) {
          const paymentIntentId = paymentData.result.paymentIntent.id;

          try {
            await axios.post(
              `${server}/payments/refund`,
              { paymentIntentId },
              { withCredentials: true }
            );
            toast.info("Payment refunded due to order failure.");
          } catch (refundError) {
            console.error("Refund failed:", refundError);
            toast.error("Refund failed. Please contact support.");
          }
        }

        return;
      }

      // ✅ Order success flow
      navigate(
        `/payment-success?method=${paymentData.method}&payment_intent=${
          paymentData.method === "card"
            ? paymentData.result.paymentIntent.id
            : ""
        }&redirect_status=${
          paymentData.method === "card"
            ? paymentData.result.paymentIntent.status
            : "succeeded"
        }`
      );

      // Clear cart
      dispatch(clearCart());

      // TODO: Reset cart or navigate
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Failed to place the order";
      console.log(error);
      toast.error(errorMsg);

      // 🔁 If payment is card & succeeded, try refund
      if (
        paymentData.method === "card" &&
        paymentData.result?.paymentIntent?.id
      ) {
        const paymentIntentId = paymentData.result.paymentIntent.id;

        try {
          await axios.post(
            `${server}/payments/refund`,
            { paymentIntentId },
            { withCredentials: true }
          );
          toast.info("Payment refunded due to order failure.");
        } catch (refundError) {
          console.error("Refund failed:", refundError);
          toast.error("Refund failed. Please contact support.");
        }
      }
    }
  };

  // Apply coupon code
  const applyCoupon = async (code) => {
    try {
      const cartTotal = calculateSubtotal();

      const { data } = await axios.post(`${server}/coupons/apply`, {
        code,
        cartTotal,
      });

      setAppliedCoupon({
        code,
        discountAmount: data.coupon.discountAmount,
        discountPercentage: data.coupon.discountPercentage,
        applicableProducts: data.coupon.selectedProducts || [],
      });

      setCouponError("");
    } catch (error) {
      setAppliedCoupon(null);
      setCouponError(
        error?.response?.data?.message || "Failed to apply coupon"
      );
    }
  };

  if (!cart.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4">
        <ShoppingCart size={80} className="text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Looks like you haven’t added anything to your cart yet. Start browsing
          and add items you love!
        </p>
        <Link
          to="/"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-md shadow hover:bg-primary/90 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-8 gap-6">
      {/* Mobile Order Summary Button */}
      <div className="lg:hidden flex justify-between items-center">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <button
          onClick={() => setMobileOrderSummaryOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Order Summary (${calculateTotal().toFixed(2)})
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center space-x-4">
          {[1, 2].map((step) => (
            <React.Fragment key={step}>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-primary text-default"
                      : "bg-accent text-muted-background"
                  }`}
                >
                  {step}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {step === 1 ? "Shipping" : "Payment"}
                </span>
              </div>
              {step === 1 && (
                <div
                  className={`w-16 h-1 ${
                    currentStep >= 2 ? "bg-primary" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Forms */}
        {currentStep === 1 && (
          <div className="bg-accent rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
            <ShippingForm onSubmit={handleShippingSubmit} />
          </div>
        )}

        {currentStep === 2 && (
          <>
            {/* Shipping Summary */}
            <div className="bg-accent rounded-lg shadow-sm border border-border p-6 mb-6 flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">Shipping Address</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    {orderData.shipping.firstName} {orderData.shipping.lastName}
                  </p>
                  <p>{orderData.shipping.address}</p>
                  <p>
                    {orderData.shipping.city}, {orderData.shipping.state}{" "}
                    {orderData.shipping.zipCode}
                  </p>
                  <p>{orderData.shipping.country}</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-primary text-sm hover:underline"
                type="button"
              >
                Edit
              </button>
            </div>

            {/* Payment Form */}
            <div className="bg-accent rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-xl font-semibold mb-6">
                Payment Information
              </h2>
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm
                    totalAmount={calculateTotal()}
                    onSubmit={handlePaymentSubmit}
                    clientSecret={clientSecret}
                  />
                </Elements>
              ) : (
                <p>Loading payment form...</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Order Summary - Desktop */}
      <aside className="hidden lg:block w-80 rounded-md h-fit">
        <OrderSummary
          items={getFinalItemsWithPrice()}
          subtotal={calculateSubtotal()}
          tax={calculateTax()}
          shipping={calculateShipping()}
          total={calculateTotal()}
          applyCoupon={applyCoupon}
          setCouponCode={setCouponCode}
          couponCode={couponCode}
          couponError={couponError}
          appliedCoupon={appliedCoupon}
        />
      </aside>

      {/* Mobile Order Summary Dialog */}
      <OrderSummaryDialog
        isOpen={mobileOrderSummaryOpen}
        onClose={() => setMobileOrderSummaryOpen(false)}
      >
        <OrderSummary
          items={getFinalItemsWithPrice()}
          subtotal={calculateSubtotal()}
          tax={calculateTax()}
          shipping={calculateShipping()}
          total={calculateTotal()}
        />
      </OrderSummaryDialog>
    </div>
  );
}

export default CheckoutPage;
