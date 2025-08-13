const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { isSellerAuthenticated } = require('../middleware/isSellerAuthenticated');
const catchAsyncError = require("../middleware/catchAsyncError");

const Withdrawal = require("../models/withdraws");
const Product = require("../models/Product");
const Event = require("../models/Event");

// GET /dashboard/stats
// server/routes/dashboard.js
router.get(
    "/dashboard/stats",
    isSellerAuthenticated,
    catchAsyncError(async (req, res) => {
        const shopId = req.shop._id;

        const revenueStats = await Order.aggregate([
            { $match: { shopId, status: "delivered" } },
            { $group: { _id: null, totalRevenue: { $sum: "$total" }, ordersCount: { $sum: 1 } } }
        ]);

        const totalProducts = await Product.countDocuments({ shop: shopId });
        const totalRunningEvents = await Event.countDocuments({
            shop: shopId,
            endDateTime: { $gte: new Date() } // only future or ongoing events
        });

        res.json({
            success: true,
            stats: {
                revenue: revenueStats[0]?.totalRevenue || 0,
                orders: revenueStats[0]?.ordersCount || 0,
                totalProducts,
                totalRunningEvents
            }
        });
    })
);

router.get(
    "/dashboard/stats/delivered",
    isSellerAuthenticated,
    catchAsyncError(async (req, res) => {
        const shopId = req.shop._id;

        // Step 1: Get total delivered revenue
        const deliveredStats = await Order.aggregate([
            { $match: { shopId: shopId, status: "delivered" } },
            {
                $group: {
                    _id: null,
                    totalDeliveredRevenue: { $sum: "$total" },
                    deliveredOrdersCount: { $sum: 1 },
                },
            },
        ]);

        const totalDeliveredRevenue = deliveredStats[0]?.totalDeliveredRevenue || 0;
        const deliveredOrdersCount = deliveredStats[0]?.deliveredOrdersCount || 0;

        // Step 2: Get total pending or approved withdrawals
        const withdrawalStats = await Withdrawal.aggregate([
            {
                $match: {
                    sellerId: shopId,
                    status: { $in: ["pending", "approved"] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRequested: { $sum: "$amount" }
                }
            }
        ]);
        const totalRequestedWithdrawals = withdrawalStats[0]?.totalRequested || 0;
        console.log()

        // Step 3: Calculate available balance
        const availableBalance = totalDeliveredRevenue - totalRequestedWithdrawals;

        res.json({
            success: true,
            stats: {
                totalDeliveredRevenue,
                deliveredOrdersCount,
                totalRequestedWithdrawals,
                availableBalance
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
