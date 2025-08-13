const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 1,
        },
        iban: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
