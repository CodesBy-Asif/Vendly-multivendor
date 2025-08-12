// routes/review.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const { IsAuthenticated } = require("../middleware/Auth");
const catchAsyncError = require("../middleware/catchAsyncError");
const errorHandler = require("../util/errorHandler");

// POST /api/reviews
router.post(
  "/",
  IsAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const { orderId, productId, rating, comment } = req.body;

    if (!orderId || !productId || !rating || !comment) {
      return next(new errorHandler("All fields are required", 400));
    }

    // Find order & ensure ownership
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
      return next(new errorHandler("Order not found", 404));
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return next(new errorHandler("Not authorized to review this order", 403));
    }

    // Find matching product in the order
    const orderItem = order.items.find(
      (item) => item.product._id.toString() === productId.toString()
    );
    if (!orderItem) {
      return next(new errorHandler("Product not found in this order", 404));
    }

    // Prevent double review for this product
    if (orderItem.review) {
      return next(
        new errorHandler("You have already reviewed this product", 400)
      );
    }

    // Fetch product and add review
    const product = await Product.findById(productId);
    if (!product) {
      return next(new errorHandler("Product not found", 404));
    }

    product.reviews.push({
      user: req.user._id,
      rating,
      comment,
      sold: orderItem.quantity || 0,
    });

    // Update product rating & totalReviews
    product.totalReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.totalReviews;

    await product.save();

    // Mark this specific product as reviewed in the order
    orderItem.review = true;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Review added for this product",
      productId,
    });
  })
);

module.exports = router;
