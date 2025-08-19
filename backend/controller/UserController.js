const express = require("express");
const User = require("../models/UserModel");
const errorHandler = require("../util/errorHandler");
const upload = require('../mutler');
const sendmail = require("../util/sendmail");
const jwt = require('jsonwebtoken')
const catchAsyncError = require('../middleware/catchAsyncError');
const sendToken = require("../util/sendToken");
const router = express.Router();
const { IsAuthenticated } = require('../middleware/Auth')
const { IsAdmin } = require("../middleware/Isadmin")
const uploadFromBuffer = require("../util/cloudinaryUploadBuffer");
const defultImg = "https://res.cloudinary.com/dxze1vehc/image/upload/v1752658448/60111_dfcrvf.jpg";

router.post('/register', upload.single("avatar"), catchAsyncError(async (req, res, next) => {

    try {
        const { full_name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(new errorHandler("User already exists", 409));
        }

        const user = await User.create({
            full_name,
            email,
            password,
        });

        const token = user.generateJWT();

        const activationUrl = `${process.env.ORIGIN}/user/activation/${token}`;

        try {
            const res = await sendmail({
                email: email,
                subject: "Activate Your Account - MultiVendor Shop",
                message: `
            <h2>Hello ${full_name || "name"},</h2>
            <p>Thank you for registering with MultiVendor Shop.</p>
            <p>Please click the button below to activate your account:</p>
            <a href="${activationUrl}" target="_blank" style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #F4400D;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            ">Activate Now</a>
            <p>If you didn't request this, you can ignore this email.</p>
            <br>
            <p>Thanks,<br>The MultiVendor Team</p>
        `,
            });

        } catch (err) {
            console.log("err", err.message)
            return next(new errorHandler(err.message, 400))
        }


        res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify via email.",
        });
    } catch (error) {
        return next(new errorHandler(error.message, 400));
    }
}));
router.get("/admin/all", IsAdmin, catchAsyncError(async (req, res, next) => {

    try {
        //  ✅ Query based on correct field name in your Order model
        const users = await User.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            users,
        });
    } catch (err) {
        return next(new errorHandler("Failed to fetch shop orders", 500));
    }
}));
router.post('/activate', catchAsyncError(async (req, res, next) => {

    try {
        const { token } = req.body;
        if (!token) return next(new errorHandler("No token provided", 400));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) return next(new errorHandler("Invalid activation link", 404));

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified", success: false });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "Account successfully activated", success: true });
    } catch (err) {
        return next(new errorHandler("Invalid or expired token", 400));
    }
}));
router.post("/login", catchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new errorHandler("Please provide email and password", 400));
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new errorHandler("Invalid email or password", 401));
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new errorHandler("Invalid email or password", 401));
        }
        if (!user.isVerified) {
            return next(new errorHandler("User not verified, Please verify via email.", 401));
        }
        user.password = undefined;

        sendToken(user, 200, res, "Logged In successfully");

    } catch (err) {
        next(err);
    }
}));

router.get("/getuser", IsAuthenticated, catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return next(new errorHandler("User doesn't exist"), 401)

        res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        return next(new errorHandler(error.message, 500))
    }
}))
router.patch('/update-profile', IsAuthenticated, catchAsyncError(async (req, res, next) => {
    const { full_name, phone, address1, address2, zip } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return next(new errorHandler("User not found", 404));

    user.full_name = full_name || user.full_name;
    user.phone = phone || user.phone;
    user.address1 = address1 || user.address1;
    user.address2 = address2 || user.address2;
    user.zip = zip || user.zip;

    await user.save();
    res.status(200).json({ success: true, user });
}));
router.patch('/change-password', IsAuthenticated, catchAsyncError(async (req, res, next) => {
    const { current, new: newPass, confirm } = req.body;

    if (!current || !newPass || !confirm) {
        return next(new errorHandler("Please fill all password fields", 400));
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return next(new errorHandler("User not found", 404));

    const isMatch = await user.comparePassword(current);
    if (!isMatch) return next(new errorHandler("Current password is incorrect", 400));
    if (newPass !== confirm) return next(new errorHandler("New passwords do not match", 400));

    user.password = newPass;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
}));

const cloudinary = require('../config/cloudinary'); // or use v2 directly
const defaultAvatar = "https://res.cloudinary.com/dxze1vehc/image/upload/v1752658448/60111_dfcrvf.jpg";

router.delete(
    '/remove-avatar',
    IsAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const user = await User.findById(req.user._id);
        if (!user) return next(new errorHandler("User not found", 404));

        // Only delete if current avatar is not the default
        if (user.avatar && user.avatar !== defaultAvatar) {
            const publicId = user.avatar.split('/').slice(-1)[0].split('.')[0]; // Extract public_id
            const folder = 'avatars';
            const fullPublicId = `${folder}/${publicId}`;

            try {
                await cloudinary.uploader.destroy(fullPublicId);
            } catch (err) {
                console.error("Cloudinary deletion failed:", err.message);
            }
        }

        user.avatar = defultImg;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Avatar removed successfully",
            user: {
                _id: user._id,
                full_name: user.full_name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    })
);


router.post(
    '/update-avatar',
    IsAuthenticated,
    upload.single('avatar'),
    catchAsyncError(async (req, res, next) => {
        if (!req.file) return next(new errorHandler("No file uploaded", 400));

        try {
            const imageUrl = await uploadFromBuffer(req.file.buffer);
            const user = await User.findById(req.user._id);
            if (!user) return next(new errorHandler("User not found", 404));

            user.avatar = imageUrl;
            await user.save();

            res.status(200).json({
                success: true,
                message: "Avatar uploaded successfully",
                user: user,
            });
        } catch (err) {
            return next(new errorHandler(err.message || "Cloudinary upload failed", 500));
        }
    })
);
// routes/userRoutes.js
router.post(
    '/add-address',
    IsAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const user = await User.findById(req.user._id);
        if (!user) return next(new errorHandler("User not found", 404));

        const address = req.body;

        if (!address.address || !address.city || !address.zipCode || !address.name) {
            return next(new errorHandler("Please fill all required address fields", 400));
        }

        // If isDefault is true, reset all others
        if (address.isDefault) {
            user.addresses.forEach((addr) => (addr.isDefault = false));
        }

        const index = user.addresses.findIndex((a) => a._id?.toString() === address._id);

        if (index !== -1) {
            // Update existing address
            user.addresses[index] = address;
        } else {
            // Add new address
            user.addresses.push(address);
        }

        await user.save();
        res.status(200).json({ success: true, user });
    })
);
router.patch(
    '/set-default-address/:id',
    IsAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const user = await User.findById(req.user._id);
        if (!user) return next(new errorHandler("User not found", 404));

        const addressId = req.params.id;
        const exists = user.addresses.some(addr => addr._id.toString() === addressId);
        if (!exists) return next(new errorHandler("Address not found", 404));

        user.addresses.forEach(addr => {
            addr.isDefault = addr._id.toString() === addressId;
        });

        await user.save();
        res.status(200).json({ success: true, user });
    })
);

router.delete(
    '/delete-address/:id',
    IsAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const user = await User.findById(req.user._id);
        if (!user) return next(new errorHandler("User not found", 404));

        const addressId = req.params.id;
        const addressExists = user.addresses.some((a) => a._id.toString() === addressId);

        if (!addressExists) {
            return next(new errorHandler("Address not found", 404));
        }

        user.addresses = user.addresses.filter((a) => a._id.toString() !== addressId);
        await user.save();

        res.status(200).json({ success: true, user });
    })
);

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        secure: true,
        httpOnly: false,       // Prevent JS access // or true if using HTTPS
        sameSite: "none",
    });
    res.json({ success: true, message: "Logged out successfully" });
});


module.exports = router;
