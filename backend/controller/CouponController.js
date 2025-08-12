const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupons");
const Product = require("../models/Product");
const { isSellerAuthenticated } = require("../middleware/isSellerAuthenticated");
const catchAsyncError = require("../middleware/catchAsyncError");
const errorHandler = require("../util/errorHandler");

// CREATE COUPON
router.post(
    "/create",
    isSellerAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const {
            code,
            discountPercentage,
            minPrice,
            maxPrice,
            quantity,
            expiryDate,
            selectedProducts = [],
        } = req.body;

        const existing = await Coupon.findOne({
            code: code.toUpperCase(),
            seller: req.shop._id,
        });
        if (existing) {
            return next(new errorHandler("You already have this coupon code", 400));
        }

        let productIds = selectedProducts;

        if (selectedProducts.length === 0) {
            const products = await Product.find({ seller: req.shop._id }, "_id");
            productIds = products.map((p) => p._id);
        }

        const coupon = new Coupon({
            code: code.toUpperCase(),
            discountPercentage,
            minPrice,
            maxPrice,
            quantity,
            expiryDate,
            selectedProducts: productIds,
            seller: req.shop._id,
        });

        await coupon.save();

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon,
        });
    })
);
// TOGGLE COUPON STATUS (PATCH)
router.patch(
    "/:id/status",
    isSellerAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const coupon = await Coupon.findOne({
            _id: req.params.id,
            seller: req.shop._id,
        });

        if (!coupon) {
            return next(new errorHandler("Coupon not found or unauthorized", 404));
        }

        coupon.status = coupon.status === "active" ? "inactive" : "active";
        await coupon.save();

        res.status(200).json({
            success: true,
            message: `Coupon ${coupon.status === "active" ? "activated" : "deactivated"} successfully`,
            coupon,
        });
    })
);

// UPDATE COUPON
router.put(
    "/:id",
    isSellerAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const coupon = await Coupon.findOne({
            _id: req.params.id,
            seller: req.shop._id,
        });

        if (!coupon) {
            return next(new errorHandler("Coupon not found or unauthorized", 404));
        }

        const updates = { ...req.body };
        if (updates.code) updates.code = updates.code.toUpperCase();

        Object.assign(coupon, updates);
        await coupon.save();

        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            coupon,
        });
    })
);

// DELETE COUPON
router.delete(
    "/delete/:id",
    isSellerAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const coupon = await Coupon.findOne({
            _id: req.params.id,
            seller: req.shop._id,
        });

        if (!coupon) {
            return next(new errorHandler("Coupon not found or unauthorized", 404));
        }

        await coupon.deleteOne();

        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully",
        });
    })
);

// GET ALL COUPONS FOR A SHOP
router.get(
    "/",
    isSellerAuthenticated,
    catchAsyncError(async (req, res) => {
        const coupons = await Coupon.find({ seller: req.shop._id }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            coupons,
        });
    })
);
router.get(
    "/:id",
    isSellerAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const coupon = await Coupon.findOne({
            _id: req.params.id,
            seller: req.shop._id,
        });

        if (!coupon) {
            return next(new errorHandler("Coupon not found or unauthorized", 404));
        }

        res.status(200).json({
            success: true,
            coupon,
        });
    })
);


// APPLY COUPON (PUBLIC)
router.post(
    "/apply",
    catchAsyncError(async (req, res, next) => {

        const { code, cartTotal } = req.body;
        if (!code || !cartTotal) {
            return next(
                new errorHandler("Code and cart total are required", 400)
            );
        }

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            status: "active",
        });

        if (!coupon) {
            return next(new errorHandler("Invalid or inactive coupon", 404));
        }

        if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
            coupon.status = "inactive";
            await coupon.save();
            return next(new errorHandler("Coupon has expired", 400));
        }

        if (coupon.usedQuantity >= coupon.quantity) {
            return next(new errorHandler("Coupon usage limit reached", 400));
        }

        if (cartTotal < coupon.minPrice || cartTotal > coupon.maxPrice) {
            return next(
                new errorHandler(
                    `Coupon is valid for orders between ${coupon.minPrice} and ${coupon.maxPrice}`,
                    400
                )
            );
        }


        res.status(200).json({
            success: true,
            message: "Coupon applied successfully",
            coupon
        });
    })
);

module.exports = router;
