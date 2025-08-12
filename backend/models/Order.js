// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: { // 👈 change from `id` to `product`
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: { type: Number, required: true },
                finalPrice: { type: Number, required: true },
                coupon: String,
                review: {
                    type: Boolean,
                    default: false,
                },
            },

        ],
        shipping: {
            fullName: String,
            address: String,
            city: String,
            phone: String,
            state: String,
            zipCode: String,
            country: String,
        },
        payment: {
            method: {
                type: String,
                enum: ["card", "paypal", "cod"],
                required: true,
            },
            status: { type: String, default: "pending" },
            paymentId: String, // Stripe/PayPal/COD identifier
        },
        subtotal: Number,
        tax: Number,
        shippingCost: Number,
        total: Number,
        discount: Number,
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        paid_at: {
            type: Date,
            default: Date.now()
        },
        delivered_At: {
            type: Date,
        },
        shopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
    },

    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
