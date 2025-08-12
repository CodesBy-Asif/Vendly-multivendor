import { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

// Stripe styling options
const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      "::placeholder": {
        color: "#a0aec0",
      },
    },
    invalid: {
      color: "#fa755a",
    },
  },
};

export default function PaymentForm({ onSubmit, totalAmount, clientSecret }) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const stripe = useStripe();
  const elements = useElements();

  const handleCardPayment = (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);

    stripe
      .createPaymentMethod({
        type: "card",
        card: cardNumberElement,
      })
      .then(({ paymentMethod, error: methodError }) => {
        if (methodError) {
          toast.error(methodError.message);
          return Promise.reject(methodError);
        }

        return stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });
      })
      .then((result) => {
        if (result.error) {
          toast.error(result.error.message);
        } else if (
          result.paymentIntent &&
          result.paymentIntent.status === "succeeded"
        ) {
          onSubmit({ method: "card", result });
        }
      })
      .catch((err) => {
        console.error("Payment processing error:", err);
      });
  };

  const handleCOD = (e) => {
    e.preventDefault();
    onSubmit({ method: "cod" });
  };

  return (
    <form onSubmit={paymentMethod === "cod" ? handleCOD : handleCardPayment}>
      <label className="block mb-2 font-medium">Select Payment Method</label>
      <div className="space-y-2 flex gap-5 mb-4">
        <label>
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="px-2">Cash on Delivery</span>
        </label>
        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="px-2">Credit/Debit Card</span>
        </label>
        <label>
          <input
            type="radio"
            value="paypal"
            checked={paymentMethod === "paypal"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          PayPal
        </label>
      </div>

      <>
        {/* Stripe Card Form */}
        {paymentMethod === "card" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Card Number
              </label>
              <div className="border rounded p-2">
                <CardNumberElement options={ELEMENT_OPTIONS} />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">
                  Expiry Date
                </label>
                <div className="border rounded p-2">
                  <CardExpiryElement options={ELEMENT_OPTIONS} />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">CVC</label>
                <div className="border rounded p-2">
                  <CardCvcElement options={ELEMENT_OPTIONS} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md mt-4"
              disabled={!stripe}
            >
              Pay with Card
            </button>
          </div>
        )}

        {/* PayPal Button */}
        {paymentMethod === "paypal" && (
          <div className="mt-4">
            <PayPalScriptProvider
              options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: totalAmount.toFixed(2),
                        },
                      },
                    ],
                  })
                }
                onApprove={(data, actions) =>
                  actions.order.capture().then((details) => {
                    console.log("PayPal Payment Approved:", details);
                    onSubmit({ method: "paypal", details });
                  })
                }
                onError={(err) => console.error("PayPal Error:", err)}
              />
            </PayPalScriptProvider>
          </div>
        )}

        {/* COD Button */}
        {paymentMethod === "cod" && (
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md mt-4"
          >
            Place Order (COD)
          </button>
        )}
      </>
    </form>
  );
}
