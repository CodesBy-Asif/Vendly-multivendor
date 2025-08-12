const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        sold: {
            type: Number,
            required: true,
            default: 0,
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: String,
        shortDescription: String,
        category: {
            type: String,
            required: true,
        },
        brand: String,
        sku: {
            type: String,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
        DiscountPrice: Number,
        stock: {
            type: Number,
            default: 0,
            required: true,
        },
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
        },
        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft",
        },
        featured: {
            type: Boolean,
            default: false,
        },
        tags: [String],
        images: [
            {
                url: String,
                public_id: String,
            },
        ],
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
        reviews: [reviewSchema],
        rating: {
            type: Number,
            default: 0,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        Sold: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);
