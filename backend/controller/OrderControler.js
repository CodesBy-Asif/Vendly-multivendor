const express = require("express");
const catchAsyncError = require("../middleware/catchAsyncError");
const errorHandler = require("../util/errorHandler");
const Order = require("../models/Order");
const { IsAuthenticated } = require('../middleware/Auth');
const Product = require("../models/Product"); // Make sure you import the Product model
const { isSellerAuthenticated } = require("../middleware/isSellerAuthenticated");
const { IsAdmin } = require("../middleware/Isadmin");
const { path } = require("../app");
const router = express.Router();

router.post(
    "/create",
    IsAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const { shipping, payment, items, subtotal, tax, shippingCost, total } = req.body;

        if (!items || !shipping || !payment) {
            return next(new errorHandler("Missing order details", 400));
        }

        const ordersByShop = new Map();

        items.forEach((item) => {
            if (!ordersByShop.has(item.shop._id)) {
                ordersByShop.set(item.shop._id, []);
            }
            // Correct key access
            ordersByShop.get(item.shop._id).push(item);
        });

        const createdOrders = [];

        for (const [shopId, shopItems] of ordersByShop.entries()) {
            const orderSubtotal = shopItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
            const orderTax = Number((orderSubtotal * 0.08).toFixed(2));
            const orderShippingCost = orderSubtotal > 100 ? 0 : 9.99;
            const orderTotal = parseFloat((orderSubtotal + orderTax + orderShippingCost).toFixed(2));
            const orderDiscount = 0; // adjust if needed

            // ✅ Transform items to match schema
            const transformedItems = [];

            for (const item of shopItems) {
                const product = await Product.findById(item._id || item.product || item.id);

                if (!product) {
                    return next(new errorHandler(`Product not found: ${item._id || item.product || item.id}`, 404));
                }

                // Update product stock and sold count
                product.stock = Math.max(0, product.stock - item.quantity);
                product.Sold += item.quantity;
                await product.save();

                transformedItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    finalPrice: item.finalPrice,
                    coupon: item.coupon || null,
                });
            }

            const newOrder = await Order.create({
                user: req.user._id,
                items: transformedItems,
                shipping,
                payment,
                subtotal: orderSubtotal,
                tax: orderTax,
                shippingCost: orderShippingCost,
                total: orderTotal,
                discount: orderDiscount,
                shopId,
                status: "pending",
            });

            createdOrders.push(newOrder);
        }

        res.status(201).json({
            success: true,
            message: `${createdOrders.length} order(s) created successfully`,
            orders: createdOrders,
        });
    })
);

// GET orders for a specific shop by ID (admin or public)
router.get("/shop", isSellerAuthenticated, catchAsyncError(async (req, res, next) => {

    try {

        //  ✅ Query based on correct field name in your Order model
        const orders = await Order.find({ shopId: req.shop._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user", // lowercase, match your Order schema field
                select: "full_name email",
            })
            .populate({
                path: "items.product",
                select: "name price images stock",
            });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (err) {
        console.error("Failed to fetch shop orders:", err);
        return next(new errorHandler("Failed to fetch shop orders", 500));
    }
}));
router.get("/user/orders", IsAuthenticated, catchAsyncError(async (req, res, next) => {
    const id = req.user._id;

    try {
        const orders = await Order.find({ user: id })
            .sort({ createdAt: -1 })
            .populate({
                path: "shopId",
                select: "shopName", // only fetch shop name
            })
            .populate({
                path: "items.product",
                select: "name price images stock", // fetch product info
            });

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return next(new errorHandler("Failed to retrieve user orders", 500));
    }
}));
router.get("/admin/all", IsAdmin, catchAsyncError(async (req, res, next) => {

    try {
        //  ✅ Query based on correct field name in your Order model
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "user", // lowercase, match your Order schema field
                select: "full_name email",
            })
            .populate({
                path: "items.product",
                select: "name price images stock",
            })
            .populate({
                path: "shopId",
                select: "-password"
            });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (err) {
        console.error("Failed to fetch shop orders:", err);
        return next(new errorHandler("Failed to fetch shop orders", 500));
    }
}));
router.get(
    "/:orderId",
    catchAsyncError(async (req, res, next) => {
        const orderId = req.params.orderId;

        try {
            const order = await Order.findOne({ _id: orderId }) // filter by order ID and shop ID
                .populate({
                    path: "shopId",
                    select: "-password", // only fetch shop name
                })
                .populate({
                    path: "items.product",
                    select: "name price images stock",
                });

            if (!order) {
                return next(new errorHandler("Order not found", 404));
            }

            res.status(200).json({
                success: true,
                order,
            });
        } catch (error) {
            console.error("Failed to fetch order:", error);
            return next(new errorHandler("Failed to retrieve order", 500));
        }
    })
);



// UPDATE ORDER (Seller only)
router.put(
    "/update/:orderId",
    isSellerAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const { orderId } = req.params;

        let order = await Order.findById(orderId);
        if (!order) {
            return next(new errorHandler("Order not found", 404));
        }

        // Check if seller owns the shop for this order or is admin
        const isShopOwner = order.shopId?.toString() === req.shop._id.toString();

        if (!isShopOwner) {
            return next(new errorHandler("Not authorized to update this order", 403));
        }

        Object.assign(order, req.body);
        await order.save();

        // Re-fetch with populated data
        order = await Order.findById(orderId)
            .populate({ path: "user", select: "full_name email" })
            .populate({ path: "items.product", select: "name price images stock" });

        res.status(200).json({
            success: true,
            message: "Order updated successfully",
            order,
        });
    })
);


// DELETE ORDER
router.delete(
    "/delete/:orderId",
    IsAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return next(new errorHandler("Order not found", 404));
        }

        // ✅ Allow if: user owns the order OR seller owns the shop OR admin
        const isUserOwner = order.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role?.includes("admin");

        let isShopOwner = false;
        if (req.user.role?.includes("seller")) {
            isShopOwner = order.shopId?.toString() === req.user.shopId?.toString();
        }

        if (!isUserOwner && !isShopOwner && !isAdmin) {
            return next(new errorHandler("Not authorized to delete this order", 403));
        }

        await order.deleteOne();

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });
    })
);



module.exports = router;

