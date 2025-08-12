const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { isSellerAuthenticated } = require('../middleware/isSellerAuthenticated');
const catchAsyncError = require("../middleware/catchAsyncError");
const errorHandler = require("../util/errorHandler");

// GET /dashboard/stats
router.get(
    "/dashboard/stats", isSellerAuthenticated,
    catchAsyncError(async (req, res) => {
        const shopId = req.shop._id
        // Make sure to use the correct field name here: 'total' or 'subtotal' instead of 'amount'
        const stats = await Order.aggregate([
            { $match: { shopId: shopId } }, {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$total" },  // Change this if your schema uses a different field
                    totalOrders: { $sum: 1 },
                },
            },
        ]);

        res.json({
            stats: {
                revenue: stats[0]?.totalRevenue || 0,
                orders: stats[0]?.totalOrders || 0,
            },
        });
    })
);
router.get(
    "/dashboard/stats/delivered",
    isSellerAuthenticated,
    catchAsyncError(async (req, res) => {
        const shopId = req.shop._id;

        const deliveredStats = await Order.aggregate([
            { $match: { shopId: shopId, status: "delivered" } }, // Only delivered orders
            {
                $group: {
                    _id: null,
                    totalDeliveredRevenue: { $sum: "$total" },
                    deliveredOrdersCount: { $sum: 1 },
                },
            },
        ]);

        res.json({
            success: true,
            stats: {
                totalDeliveredRevenue: deliveredStats[0]?.totalDeliveredRevenue || 0,
                deliveredOrdersCount: deliveredStats[0]?.deliveredOrdersCount || 0,
            },
        });
    })
);

// GET /orders/recent
router.get(
    "/orders/recent",
    isSellerAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const recentOrders = await Order.find({ shopId: req.shop._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate({
                path: "user",
                select: "full_name email",
            })
            .populate({
                path: "items.product",
                select: "name price images stock",
            })
            .lean();

        res.status(200).json({
            success: true,
            orders: recentOrders,
        });
    })
);

module.exports = router;
