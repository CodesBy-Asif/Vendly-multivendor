const express = require("express");
const Shop = require("../models/Shop");
const errorHandler = require("../util/errorHandler");
const upload = require('../mutler'); // multer middleware
const sendmail = require("../util/sendmail");
const jwt = require('jsonwebtoken');
const catchAsyncError = require('../middleware/catchAsyncError');
const uploadFromBuffer = require("../util/cloudinaryUploadBuffer");
const { isSellerAuthenticated } = require("../middleware/isSellerAuthenticated");
const Product = require('../models/Product');

const router = express.Router();

const defaultLogo = "https://res.cloudinary.com/dxze1vehc/image/upload/v1752658448/60111_dfcrvf.jpg";
router.post('/register', upload.single("logo"), catchAsyncError(async (req, res, next) => {
    const {
        shopName,
        ownerName,
        email,
        password,
        confirmPassword,
        phone,
        address,
        city,
        state,
        zipCode,
        description
    } = req.body;

    if (password !== confirmPassword) {
        return next(new errorHandler("Passwords do not match", 400));
    }

    const existing = await Shop.findOne({ email });
    if (existing) {
        return next(new errorHandler("Shop already exists with this email", 409));
    }

    let logoUrl = defaultLogo;

    if (req.file) {
        try {
            logoUrl = await uploadFromBuffer(req.file.buffer);
        } catch (err) {
            return next(new errorHandler("Logo upload failed: " + err.message, 500));
        }
    }

    const shop = await Shop.create({
        shopName,
        ownerName,
        email,
        password,
        phone,
        address,
        city,
        state,
        zipCode,
        description,
        logo: logoUrl,
        isVerified: false
    });

    const token = jwt.sign({ _id: shop._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const activationUrl = `${process.env.ORIGIN}/shop/activation/${token}`;

    try {
        await sendmail({
            email,
            subject: "Activate Your Shop - MultiVendor Marketplace",
            message: `
                <h2>Hello ${ownerName || "Shop Owner"},</h2>
                <p>Welcome to our marketplace. Please activate your shop:</p>
                <a href="${activationUrl}" style="padding: 10px 20px; background: #F4400D; color: #fff; border-radius: 5px; text-decoration: none;">Activate Now</a>
                <p>Ignore if not requested.</p>
            `,
        });
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        res.status(201).json({
            message: "Shop registered successfully. Please verify via email.",
        });
    } catch (err) {
        return next(new errorHandler("Email failed: " + err.message, 500));
    }
}));

router.post('/login', catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new errorHandler("Please provide email and password", 400));
    }

    const shop = await Shop.findOne({ email }).select("+password");
    if (!shop) {
        return next(new errorHandler("Invalid email or password", 401));
    }

    const isMatch = await shop.comparePassword(password);
    if (!isMatch) {
        return next(new errorHandler("Invalid email or password", 401));
    }

    if (!shop.isVerified) {
        return next(new errorHandler("Shop email is not verified. Please check your inbox.", 403));
    }
    shop.password = undefined;

    const token = jwt.sign({ _id: shop._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    const cookieOptions = {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie("shop_token", token, cookieOptions);
    res.status(200).json({
        message: "Login successful",
        token,
        shop: shop,
    });
}));
router.post('/activate', catchAsyncError(async (req, res, next) => {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const shop = await Shop.findById(decoded._id);
    if (!shop) return next(new errorHandler("Invalid token or shop not found", 400));
    shop.isVerified = true;
    await shop.save();

    res.status(200).json({ message: "Shop activated successfully!" });
}));
router.get("/getshop", isSellerAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const shop = await Shop.findById(req.shop._id).select("-password");

        if (!shop) {
            return next(new errorHandler("Shop not found", 404));
        }

        const products = await Product.find({ shop: shop._id });

        res.status(200).json({ shop: { ...shop.toObject(), products } });
    })
);

router.put(
    "/update",
    isSellerAuthenticated,
    upload.none(), // parse only text fields from multipart/form-data
    async (req, res) => {
        try {
            const sellerId = req.shop._id; // authenticated seller's ID
            const updateFields = req.body;

            // Validate required fields here if needed

            // Find and update the shop
            const updatedShop = await Shop.findByIdAndUpdate(
                sellerId,
                { $set: updateFields },
                { new: true, runValidators: true }
            );

            if (!updatedShop) {
                return res.status(404).json({ success: false, message: "Shop not found" });
            }

            res.json({ success: true, shop: updatedShop });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    }
);



router.get("/:id", catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const shop = await Shop.findById(id).select("-password");
    if (!shop) {
        return next(new errorHandler("Shop not found", 404));
    }

    res.status(200).json({
        success: true,
        shop,
    });
})
);
router.get("/products/:id", catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const products = await Product.find({ shop: id }).sort({ createdAt: -1 });
    if (!products || products.length === 0) {
        return next(new errorHandler("No products found for this shop", 404));
    }

    res.status(200).json({
        success: true,
        products,
    });
})
);




module.exports = router;
