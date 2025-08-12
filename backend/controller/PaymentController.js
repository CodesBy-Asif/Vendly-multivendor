// routes/payment.js
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const { IsAuthenticated } = require("../middleware/Auth");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const catchAsyncError = require("../middleware/catchAsyncError");
const errorHandler = require("../util/errorHandler");
router.post("/refund", IsAuthenticated, async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
        });

        res.status(200).json({ success: true, refund });
    } catch (error) {
        console.error("Refund error:", error);
        res
            .status(500)
            .json({ success: false, message: "Failed to process refund." });
    }
});
router.post(
    "/create-intent",
    catchAsyncError(async (req, res, next) => {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return next(new errorHandler("Invalid amount", 400));
        }

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Stripe requires amount in cents
                currency: "usd",
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            res.status(200).json({
                success: true,
                clientSecret: paymentIntent.client_secret,
            });
        } catch (err) {
            return next(new errorHandler("Stripe error: " + err.message, 500));
        }
    })
);
module.exports = router;
