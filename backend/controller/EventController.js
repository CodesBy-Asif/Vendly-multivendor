const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const upload = require("../mutler");
const uploadFromBuffer = require("../util/cloudinaryUploadBuffer");
const { isSellerAuthenticated } = require("../middleware/isSellerAuthenticated");
const catchAsyncError = require("../middleware/catchAsyncError");
const errorHandler = require("../util/errorHandler");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product")

// CREATE EVENT
router.post(
  "/create",
  isSellerAuthenticated,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
  ]),
  catchAsyncError(async (req, res, next) => {
    const {
      productId, // must come from frontend
      discountPercentage,
      startDateTime,
      endDateTime,
    } = req.body;

    // Validate dates
    if (!startDateTime || !endDateTime) {
      return next(new errorHandler("Start and end date/time are required", 400));
    }
    const existingEvent = await Event.findOne({
      product: productId,
      endDateTime: { $gte: new Date() }, // still active
    });

    if (existingEvent) {
      return next(new errorHandler("An active event already exists for this product", 400));
    }
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    if (isNaN(start) || isNaN(end)) {
      return next(new errorHandler("Invalid date format", 400));
    }
    if (end - start < 24 * 60 * 60 * 1000) {
      return next(new errorHandler("End date must be at least 1 day after start date", 400));
    }

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      return next(new errorHandler("Product not found", 404));
    }

    // Price calculations
    const originalPrice = product.price;
    const previousPrice = product.DiscountPrice || undefined;
    const discountedPrice = Number(
      (product.price - (product.price * discountPercentage) / 100).toFixed(2)
    );


    product.DiscountPrice = discountedPrice;
    await product.save();

    let thumbnail = {};
    console.log(req.files["thumbnail"])
    if (req.files && req.files["thumbnail"]) {
      const thumbUpload = await uploadFromBuffer(
        req.files["thumbnail"][0].buffer,
        "events/thumbnail"
      );
      thumbnail = thumbUpload;
    }



    // Create event
    const event = await Event.create({
      product: product._id,
      thumbnail,
      originalPrice,
      previousPrice,
      discountPercentage,
      discountedPrice,
      startDateTime: start,
      endDateTime: end,
      shop: req.shop._id,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  })
);


// GET EVENTS
router.get(
  "/",
  catchAsyncError(async (req, res) => {
    const now = new Date();

    // Find all events and populate productId + shop
    let events = await Event.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "shop",
        select: "-password",
      })
      .populate({
        path: "product",
      });

    // Check for expired events
    for (const event of events) {
      if (
        event.endDateTime &&
        new Date(event.endDateTime) < new Date() // compares to current date/time
      ) {
        // Restore product's discount price
        if (event.product) {
          await Product.findByIdAndUpdate(event.product._id, {
            discountPrice: event.product.prePrice,
          });
        }

        // Delete expired event
        await Event.findByIdAndDelete(event._id);
      }
    }

    // Refetch events after removing expired ones
    events = await Event.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "shop",
        select: "-password",
      })
      .populate({
        path: "product",
      });

    res.status(200).json({
      success: true,
      events,
    });
  })
);

router.get(
  "/:id",
  catchAsyncError(async (req, res, next) => {
    const event = await Event.findOne({ _id: req.params.id })
      .populate("shop", "-password")
      .populate("product")// optional

    if (!event) {
      return next(new errorHandler("Event not found", 404));
    }

    res.status(200).json({
      success: true,
      event,
    });
  })
);

// UPDATE EVENT
// UPDATE EVENT
router.put(
  "/update/:id",
  isSellerAuthenticated,
  upload.fields([{ name: "thumbnail", maxCount: 1 }]), // still multer memoryStorage
  catchAsyncError(async (req, res, next) => {
    const event = await Event.findById(req.params.id).populate("product");
    if (!event) return next(new errorHandler("Event not found", 404));
    if (event.shop.toString() !== req.shop._id.toString())
      return next(new errorHandler("Unauthorized", 403));

    const {
      productId,
      discountPercentage,
      startDateTime,
      endDateTime,
    } = req.body;

    // If productId changes, fetch the new product
    let product = event.product;
    if (productId && productId !== String(event.product?._id)) {
      product = await Product.findById(productId);
      if (!product) {
        return next(new errorHandler("Product not found", 404));
      }
      event.product = product._id;
    }

    // Validate and update dates
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      if (isNaN(start) || isNaN(end)) {
        return next(new errorHandler("Invalid date format", 400));
      }
      if (end - start < 24 * 60 * 60 * 1000) {
        return next(new errorHandler("End date must be at least 1 day after start date", 400));
      }
      event.startDateTime = start;
      event.endDateTime = end;
    }

    // Update discount & product price
    if (discountPercentage !== undefined) {
      event.discountPercentage = discountPercentage;
      const originalPrice = product.price;
      const previousPrice = product.DiscountPrice || undefined;
      const discountedPrice = Number(
        (product.price - (product.price * discountPercentage) / 100).toFixed(2)
      );
      product.DiscountPrice = discountedPrice;
      await product.save();

      event.originalPrice = originalPrice;
      event.previousPrice = previousPrice;
      event.discountedPrice = discountedPrice;
    }

    // Handle thumbnail upload if provided (memory buffer → Cloudinary)
    if (req.files && req.files["thumbnail"]) {
      const thumbUpload = await uploadFromBuffer(
        req.files["thumbnail"][0].buffer,
        "events/thumbnail"
      );
      event.thumbnail = thumbUpload;
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  })
);


// DELETE EVENT
router.delete(
  "/delete/:id",
  isSellerAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const event = await Event.findById(req.params.id);
    if (!event) return next(new errorHandler("Event not found", 404));
    if (event.shop.toString() !== req.shop._id.toString())
      return next(new errorHandler("Unauthorized", 403));

    // Delete images from Cloudinary
    if (event.thumbnail?.public_id) {
      await cloudinary.uploader.destroy(event.thumbnail.public_id);
    }


    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event and images deleted successfully",
    });
  })
);

module.exports = router;
