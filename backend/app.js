const express = require("express");
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const error = require("./middleware/error");
const userController = require('./controller/UserController')
const ShopContoller = require('./controller/ShopController');
const ProductController = require('./controller/ProductController')
const EventController = require('./controller/EventController')
const CouponController = require('./controller/CouponController')
const OrderController = require('./controller/OrderControler')
const PaymentController = require('./controller/PaymentController')
const ReviewController = require('./controller/ReviewController')
const RefundController = require('./controller/RefundController')
const ConversationControler = require('./controller/ConversationControler')
const Message = require('./controller/Messages')
const other = require('./controller/other')
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}
));

app.use("/api/v2/user", userController)
app.use("/api/v2/shops", ShopContoller);
app.use("/api/v2/product", ProductController);
app.use("/api/v2/event", EventController);
app.use("/api/v2/coupons", CouponController);
app.use("/api/v2/order", OrderController);
app.use("/api/v2/payments", PaymentController);
app.use("/api/v2/reviews", ReviewController);
app.use("/api/v2/refunds", RefundController);
app.use("/api/v2/conversation", ConversationControler);
app.use("/api/v2/messages", Message);
app.use("/api/v2", other);






// Example Route (you should add your routes here)
app.get("/", (req, res) => {
    res.send("API is running...");
});


// Error Handler (should be the last middleware)
app.use(error);

module.exports = app;
