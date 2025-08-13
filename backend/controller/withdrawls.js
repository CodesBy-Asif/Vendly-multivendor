const express = require("express");
const errorHandler = require("../util/errorHandler");
const Withdrawal = require("../models/withdraws");
const { isSellerAuthenticated } = require("../middleware/isSellerAuthenticated");
const { IsAdmin } = require("../middleware/Isadmin");
const catchAsyncError = require('../middleware/catchAsyncError');

const router = express.Router();

// Create a withdrawal
router.post("/", isSellerAuthenticated, async (req, res) => {
    try {
        const { amount, iban } = req.body;
        const sellerId = req.shop._id
        if (!sellerId || !amount || !iban) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const withdrawal = await Withdrawal.create({
            sellerId,
            amount,
            iban,
        });

        res.status(201).json({
            message: "Withdrawal request created successfully",
            withdrawal,
        });
    } catch (error) {
        console.error("Error creating withdrawal:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all withdrawals by seller ID
router.get("/", isSellerAuthenticated, async (req, res) => {
    try {
        const sellerId = req.shop._id
        const withdrawals = await Withdrawal.find({ sellerId }).sort({
            createdAt: -1,
        });

        res.status(200).json({ withdrawals });
    } catch (error) {
        console.error("Error fetching withdrawals:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/admin/all", IsAdmin, catchAsyncError(async (req, res, next) => {

    try {
        //  ✅ Query based on correct field name in your Order model
        const withdrawal = await Withdrawal.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "sellerId", // lowercase, match your Order schema field
                select: "-password",
            });

        res.status(200).json({
            success: true,
            withdrawal
        });
    } catch (err) {
        console.error("Failed to fetch shop orders:", err);
        return next(new errorHandler("withdrawal errors", 500));
    }
}));
router.put(
    "/:id/status",
    IsAdmin,
    catchAsyncError(async (req, res, next) => {
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return next(new errorHandler("Invalid status", 400));
        }

        const withdrawal = await Withdrawal.findById(req.params.id);
        if (!withdrawal) {
            return next(new errorHandler("Withdrawal request not found", 404));
        }

        withdrawal.status = status;
        await withdrawal.save();

        res.status(200).json({
            success: true,
            message: `Withdrawal ${status} successfully`,
            withdrawal,
        });
    })
);
module.exports = router;
