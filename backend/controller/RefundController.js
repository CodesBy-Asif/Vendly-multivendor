const express = require("express");
const Refund = require("../models/Refund");
const Order = require("../models/Order");
const { IsAuthenticated } = require("../middleware/Auth");
const { isSellerAuthenticated } = require("../middleware/isSellerAuthenticated");
const router = express.Router();
router.get("/my-refunds", IsAuthenticated, async (req, res) => {
    try {
        const refunds = await Refund.find({ userId: req.user._id }).sort({ createdAt: -1 }).populate({ path: "userId", select: "-password" })
            .populate({ path: "orderId" });

        res.json({
            success: true,
            refunds,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// POST Refund request
router.post("/:orderId", IsAuthenticated, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;

        const order = await Order.findOne({ _id: orderId, user: req.user._id });
        if (!order) {
            return res.status(403).json({ message: "You are not authorized to request a refund for this order." });
        }

        // Case 1: COD orders
        if (order.payment.method === "cod") {
            order.status = "cancelled";
            await order.save();
            return res.json({ message: "COD order canceled successfully" });
        }

        // Case 2: Card payments
        if (order.payment.method === "card") {
            order.status = "cancelled";
            await order.save();

            const refund = new Refund({
                orderId: order._id,
                userId: req.user._id,
                paymentMethod: "card",
                amount: order.subtotal,
                reason,
                status: "pending"
            });

            await refund.save();

            return res.json({ message: "Card order canceled & refund initiated", refund });
        }

        res.status(400).json({ message: "Invalid payment method" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});// Get all refunds for the logged-in user
router.get("/shop-refunds", isSellerAuthenticated, async (req, res) => {
    try {
        // Find refunds, populate order and user, then filter by shop ownership
        const refunds = await Refund.find()
            .sort({ createdAt: -1 })
            .populate({ path: "userId", select: "-password" })
            .populate({
                path: "orderId",
            });
        // Filter refunds where the order's shop matches the logged-in seller's shop
        const shopRefunds = refunds.filter(
            (refund) => refund.orderId && refund.orderId.shopId.toString() === req.shop._id.toString()
        );

        res.json({
            success: true,
            refunds: shopRefunds,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
router.put('/update/:refundId', isSellerAuthenticated, async (req, res) => {
    const { refundId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "processing", "pending"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        // Find refund and populate the order to check ownership
        const refund = await Refund.findById(refundId).populate('orderId');

        if (!refund) {
            return res.status(404).json({ message: "Refund not found" });
        }

        const order = refund.orderId;

        // Check if order.shop matches current seller's shop ID
        if (!order.shopId.equals(req.shop._id)) {
            return res.status(403).json({ message: "Unauthorized to update this refund" });
        }

        // Update refund status
        refund.status = status;
        await refund.save();

        // Optionally: if refund is approved, set order status to cancelled
        if (status === "approved") {
            order.status = "cancelled";
            await order.save();
        }

        res.json({
            success: true,
            message: "Refund status updated successfully",
            refund,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;
