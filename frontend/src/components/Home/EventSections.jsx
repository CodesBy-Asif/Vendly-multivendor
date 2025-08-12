import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/actions/Cart";
import { BiCart } from "react-icons/bi";

const formatTime = (ms) => {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

const EventSections = () => {
  const { events } = useSelector((state) => state.events);
  const now = new Date();
  const dispatch = useDispatch();

  const validDeals = events.filter((event) => {
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);

    const hasStarted = start <= now;
    const endsIn24Hours = end - now > 0 && end - now <= 24 * 60 * 60 * 1000;

    return hasStarted && endsIn24Hours;
  });
  let highestDiscountProduct = null;
  if (validDeals.length > 0) {
    highestDiscountProduct = validDeals.reduce((max, product) =>
      product.discountPercentage > max.discountPercentage ? product : max
    );
  } else {
    const futureDeals = events.filter(
      (product) => new Date(product.endDateTime) - now > 0
    );
    highestDiscountProduct = futureDeals.reduce(
      (soonest, product) =>
        new Date(product.endDateTime) < new Date(soonest.endDateTime)
          ? product
          : soonest,
      futureDeals[0] || null
    );
  }

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!highestDiscountProduct) return;

    const endTime = new Date(highestDiscountProduct.endDateTime);

    const updateTimer = () => {
      const now = new Date();
      const difference = endTime - now;
      setTimeLeft(formatTime(difference));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [highestDiscountProduct]);

  if (!highestDiscountProduct) return null;
  const discountedPrice = (
    highestDiscountProduct.orignalprice *
    (1 - highestDiscountProduct.discountPercentage / 100)
  ).toFixed(2); // rounds to 2 decimal places
  return (
    <section className="my-12 bg-background">
      <h2 className="text-4xl font-bold text-center mb-6 text-foreground">
        {validDeals.length > 0
          ? "Countdown to Savings"
          : "Hot Deal Coming Soon"}
      </h2>

      <div className="max-w-7xl bg-default rounded-xl px-8 py-6 mx-auto w-[95%] flex flex-col md:flex-row items-center gap-8">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <img
            src={highestDiscountProduct.thumbnail.url}
            alt={highestDiscountProduct.product.name}
            onError={(e) => {
              e.target.src = "/placeholder.jpg";
            }}
            className="w-full max-h-96 object-contain"
          />
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 space-y-4">
          <h3 className="text-2xl font-semibold text-foreground">
            {highestDiscountProduct.product.name}
          </h3>

          <p className="text-sm text-muted-foreground">
            Ends in:{" "}
            <span className="text-foreground font-medium">{timeLeft}</span>
          </p>

          <p className="text-muted-foreground text-sm">
            {highestDiscountProduct.product.description.slice(0, 600)}...
          </p>

          <div className="flex gap-4 items-baseline">
            <span className="text-xl font-bold text-primary">
              {highestDiscountProduct.product.DiscountPrice}
            </span>
            <span className="line-through text-muted-foreground text-sm">
              {highestDiscountProduct.product.price}
            </span>
            <span className="bg-destructive text-white text-xs px-2 py-1 rounded">
              {highestDiscountProduct.discountPercentage} % OFF
            </span>
          </div>

          <a
            href={`/event/${highestDiscountProduct._id}`}
            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-md transition"
          >
            view Details
          </a>
          <button
            onClick={() => {
              dispatch(addToCart(highestDiscountProduct.product));
            }}
            className="flex-1 ml-2 py-2  px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <BiCart className="inline mr-2" size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventSections;
