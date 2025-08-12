const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        thumbnail: {
            url: String,
            public_id: String,
        },
        originalPrice: {
            type: Number,
            required: true
        },
        previousPrice: Number, // in case the product already had a discount
        discountPercentage: { type: Number, default: 0 },
        discountedPrice: Number,
        startDateTime: { type: Date, required: true },
        endDateTime: { type: Date, required: true },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
