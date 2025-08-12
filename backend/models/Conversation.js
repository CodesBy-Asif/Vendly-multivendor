const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        groupTitle: { type: String },
        members: [
            {
                memberId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    refPath: "members.memberModel"
                },
                memberModel: {
                    type: String,
                    required: true,
                    enum: ["User", "Shop"]
                }
            }
        ],
        lastMessage: { type: String },
        lastMessageId: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
