const Conversation = require("../models/Conversation");
const ErrorHandler = require("../util/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const express = require("express");
const { IsAuthenticated } = require("../middleware/Auth");
const { isSellerAuthenticated } = require("../middleware/isSellerAuthenticated");
const User = require("../models/UserModel");
const Seller = require("../models/Shop");
const router = express.Router();

// create a new conversation
router.post(
    "/create-new-conversation",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { userId, sellerId } = req.body;

            // Fetch user and seller documents
            const user = await User.findById(userId);
            const seller = await Seller.findById(sellerId);

            if (!user || !seller) {
                return res.status(404).json({ success: false, message: "User or Seller not found" });
            }

            // Generate groupTitle based on their names
            const groupTitle = `chat-${user.full_name.toLowerCase().replace(/\s+/g, '-')}-${seller.ownerName.toLowerCase().replace(/\s+/g, '-')}`;

            // Check if conversation exists with this groupTitle
            let conversation = await Conversation.findOne({ groupTitle });

            if (conversation) {
                // Already exists
                return res.status(200).json({
                    success: true,
                    conversation,
                });
            }

            // Create new conversation with memberId and memberModel
            conversation = await Conversation.create({
                groupTitle,
                members: [
                    { memberId: userId, memberModel: "User" },
                    { memberId: sellerId, memberModel: "Shop" }
                ],
            });

            res.status(201).json({
                success: true,
                conversation,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message || "Server error"), 500);
        }
    })
);

// get seller conversations
router.get(
    "/get-all-conversation-seller/:id",
    isSellerAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const conversations = await Conversation.find({
                "members.memberId": req.shop._id,
            }).sort({ updatedAt: -1, createdAt: -1 })
                .populate('members.memberId', 'full_name email ownerName shopName')


            res.status(200).json({ success: true, conversations });
        } catch (error) {
            return next(new ErrorHandler(error), 500);
        }
    })
);

// get user conversations
router.get(
    "/get-all-conversation-user/:id",
    IsAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const conversations = await Conversation.find({
                "members.memberId": req.params.id,
            }).sort({ updatedAt: -1, createdAt: -1 })
                .populate('members.memberId', 'full_name email ownerName shopName')


            res.status(200).json({ success: true, conversations });
        } catch (error) {
            return next(new ErrorHandler(error), 500);
        }
    })
);

// update the last message
router.put(
    "/update-last-message/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { lastMessage, lastMessageId } = req.body;

            const conversation = await Conversation.findByIdAndUpdate(
                req.params.id,
                {
                    lastMessage,
                    lastMessageId,
                },
                { new: true }
            );

            res.status(201).json({
                success: true,
                conversation,
            });
        } catch (error) {
            return next(new ErrorHandler(error), 500);
        }
    })
);

module.exports = router;
