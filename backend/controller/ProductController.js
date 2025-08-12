
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const upload = require("../mutler");
const uploadFromBuffer = require("../util/cloudinaryUploadBuffer");
const { isSellerAuthenticated } = require("../middleware/isSellerAuthenticated");
const catchAsyncError = require("../middleware/catchAsyncError");
const cloudinary = require('../config/cloudinary')
const extractPublicIdFromUrl = require('../util/extractPublicIdFromUrl')
const errorHandler = require('../util/errorHandler')

router.post(
    "/create",
    isSellerAuthenticated,
    upload.array("images", 10),
    catchAsyncError(async (req, res, next) => {
        const {
            name,
            description,
            shortDescription,
            category,
            brand,
            sku,
            price,
            DiscountPrice,
            stock,
            weight,
            dimensions,
            status,
            tags,

        } = req.body;

        const uploadedImages = await Promise.all(
            req.files.map((file) =>
                uploadFromBuffer(file.buffer, "products") // returns { url, public_id }
            )
        );

        // Safe parsing helpers
        const parseJSON = (value, fallback = []) => {
            try {
                return value ? JSON.parse(value) : fallback;
            } catch {
                return fallback;
            }
        };

        const product = new Product({
            name,
            description,
            shortDescription,
            category,
            brand,
            sku,
            price,
            DiscountPrice,
            stock,
            weight,
            dimensions: parseJSON(dimensions, {}),
            status,
            tags: parseJSON(tags),
            shop: req.shop._id,
            images: uploadedImages,
        });

        await product.save();

        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    })
);

router.get(
    "/products",
    catchAsyncError(async (req, res, next) => {
        const products = await Product.find().sort({ createdAt: -1 }).populate({
            path: "shop",
            select: "-password" // Exclude password field
        }).populate({
            path: "reviews.user",
            select: "full_name email avatar", // Limit to basic reviewer info
        });

        res.status(200).json({
            success: true,
            products,
        });
    })
);


router.put(
    "/update/:id", isSellerAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const productId = req.params.id;
        const shopid = req.shop._id;
        const { name, description, shortDescription, price, DiscountPrice, stock } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return next(new errorHandler("Product not found", 404));
        }
        if (shopid.toString() !== product.shop._id.toString()) return next(new errorHandler("you are not the owner", 401))

        // Update only editable fields
        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (shortDescription !== undefined) product.shortDescription = shortDescription;
        if (price !== undefined) product.price = price;
        if (DiscountPrice !== undefined) product.DiscountPrice = DiscountPrice;
        if (stock !== undefined) product.stock = stock;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    })
);
router.delete(
    "/delete/:id",
    isSellerAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const product = await Product.findById(req.params.id);
        const shopid = req.shop._id;

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (shopid.toString() !== product.shop._id.toString()) return next(new errorHandler("you are not the owner", 401))

        // Ensure product belongs to current seller
        if (product.shop.toString() !== req.shop._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this product" });
        }

        // Delete each image from Cloudinary using public_id
        const imageDeletionResults = await Promise.all(
            product.images.map(async (img) => {
                if (img.public_id) {
                    try {
                        return await cloudinary.uploader.destroy(extractPublicIdFromUrl(img.public_id));
                    } catch (err) {
                        console.error("Error deleting image:", err.message);
                    }
                }
            })
        );

        await product.deleteOne();

        res.status(200).json({
            message: "Product and images deleted successfully",
            imageDeletionResults,
        });
    })
);
module.exports = router;