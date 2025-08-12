const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const Shop = require('../models/Shop');
const errorHandler = require('../util/errorHandler');
const catchAsyncError = require('./catchAsyncError');

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token, shop_token } = req.cookies;

    if (!token && !shop_token) {
        return next(new errorHandler("Please login to continue this page", 401));
    }

    if (token) {
        // User authentication
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return next(new errorHandler("User not found", 404));
        }
        req.user = user;
        req.userType = "user";
    } else if (shop_token) {
        // Shop (seller) authentication
        const decoded = jwt.verify(shop_token, process.env.JWT_SECRET);
        const shop = await Shop.findById(decoded._id);
        if (!shop) {
            return next(new errorHandler("Shop not found", 404));
        }
        req.user = shop;
        req.userType = "shop";
    }

    next();
});
