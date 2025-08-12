// middleware/Auth.js

const jwt = require('jsonwebtoken');
const Shop = require('../models/Shop');
const errorHandler = require('../util/errorHandler');
const catchAsyncError = require('./catchAsyncError');

// Middleware for authenticating Shop (Seller)
exports.isSellerAuthenticated = catchAsyncError(async (req, res, next) => {
    const { shop_token } = req.cookies;

    if (!shop_token) {
        return next(new errorHandler("Please login to access this resource", 401));
    }

    const decoded = jwt.verify(shop_token, process.env.JWT_SECRET);
    req.shop = await Shop.findById(decoded._id);
    if (!req.shop) {
        return next(new errorHandler("Shop not found", 404));
    }

    next();
});
