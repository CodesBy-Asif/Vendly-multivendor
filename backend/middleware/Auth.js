const errorHandler = require('../util/errorHandler');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken')

const User = require('../models/UserModel');

exports.IsAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies
    if (!token) return next(new errorHandler("Please login to continue this page", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);

    next();
});
