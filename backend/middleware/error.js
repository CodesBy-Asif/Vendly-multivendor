const errorHandler = require('../util/errorHandler');

module.exports = (err, req, res, next) => {
    err.statuscode = err.statuscode || 500;
    err.message = err.message || "Internal Server Error";

    // Invalid MongoDB ID (e.g. /user/12345)
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new errorHandler(message, 400);
    }

    // Duplicate field (e.g. unique email)
    if (err.code === 11000) {
        const message = `Duplicate field value: ${Object.keys(err.keyValue).join(", ")}`;
        err = new errorHandler(message, 400);
    }

    // Invalid JWT
    if (err.name === "JsonWebTokenError") {
        const message = "Your Url is  Invalid Please try again.";
        err = new errorHandler(message, 400);
    }

    // Expired JWT
    if (err.name === "TokenExpiredError") {
        const message = "Your token has expired. Please try again.";
        err = new errorHandler(message, 400);
    }

    res.status(err.statuscode).json({
        message: err.message,
        success: false,
    });
};
