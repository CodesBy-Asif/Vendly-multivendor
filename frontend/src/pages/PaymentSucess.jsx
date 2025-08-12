import { CheckCircle, Home, Copy } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function PaymentSuccess() {
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  // Common params
  const paymentIntent = params.get("payment_intent");
  const method = params.get("method"); // "card" or "cod"
  const status = params.get("redirect_status"); // "succeeded" or "failed" or something else
  console.log(method, status);
  const handleGoHome = () => {
    navigate("/");
  };

  const handleCopy = async () => {
    if (paymentIntent) {
      await navigator.clipboard.writeText(paymentIntent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Success UI for Stripe card payment
  const StripeSuccess = () => (
    <>
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Payment Successful! 🎉
      </h1>
      <p className="text-gray-600 mb-8">
        Your payment has been processed successfully. Thank you for your
        purchase!
      </p>

      {paymentIntent && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">Payment Intent ID</p>
          <div className="flex items-center justify-between bg-white rounded-md p-3 border border-gray-200">
            <code className="text-sm text-gray-800 font-mono break-all mr-2">
              {paymentIntent}
            </code>
            <button
              onClick={handleCopy}
              className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 mt-2">Copied to clipboard!</p>
          )}
        </div>
      )}
    </>
  );

  // Success UI for COD payment
  const CODSuccess = () => (
    <>
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Order Placed Successfully! 🎉
      </h1>
      <p className="text-gray-600 mb-8">
        Your order has been received and will be processed for cash on delivery.
        Thank you for shopping with us!
      </p>
    </>
  );

  // Failure UI (common)
  const FailureUI = () => (
    <>
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <div className="w-8 h-8 text-red-600 text-2xl">❌</div>
      </div>

      <h1 className="text-2xl font-bold text-red-600 mb-2">
        {method === "cod" ? "Order Placement Failed" : "Payment Failed"}
      </h1>
      <p className="text-red-500 mb-8">
        {method === "cod"
          ? "There was a problem placing your order. Please try again."
          : "Your payment could not be processed or was canceled. Please try again."}
      </p>

      <div className="space-y-3">
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
        <button
          onClick={handleGoHome}
          className="w-full border border-red-200 hover:bg-red-50 text-red-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Return to Homepage
        </button>
      </div>
    </>
  );

  // Determine which UI to show
  if (method === "cod") {
    // For COD, just check status === "succeeded"
    if (status === "succeeded") {
      return (
        <Wrapper>
          <CODSuccess />
          <ReturnHomeButton />
        </Wrapper>
      );
    } else {
      return (
        <Wrapper>
          <FailureUI />
        </Wrapper>
      );
    }
  } else if (method === "card") {
    // For card, check redirectStatus OR status for success
    if (status === "succeeded") {
      return (
        <Wrapper>
          <StripeSuccess />
          <ReturnHomeButton />
        </Wrapper>
      );
    } else {
      return (
        <Wrapper>
          <FailureUI />
        </Wrapper>
      );
    }
  } else {
    // Unknown or missing method, show failure
    return (
      <Wrapper>
        <FailureUI />
      </Wrapper>
    );
  }
}

// Small wrapper component for consistent styling
const Wrapper = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
      {children}
    </div>
  </div>
);

const ReturnHomeButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/")}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-6"
    >
      <Home className="w-4 h-4" />
      Return to Homepage
    </button>
  );
};
