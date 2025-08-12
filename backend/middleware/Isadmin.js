const errorHandler = require('../util/errorHandler');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken')

const User = require('../models/UserModel');

exports.IsAdmin = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies
    if (!token) return next(new errorHandler("Please login to continue this page", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    if (req.user.email !== "asifr.official9@gmail.com") return next(new errorHandler("unauthorized person not allowed", 401));

    next();
});
