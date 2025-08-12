const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const addressSchema = new mongoose.Schema({
    type: { type: String, enum: ['home', 'work', 'other'], required: true },
    label: String,
    name: { type: String, required: true },
    phone: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    zipCode: { type: String, required: true },
    country: { type: String, default: 'United States' },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: [true, "Please provide your name"],
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        phone: {
            type: String,
            default: "",
        },
        zip: {
            type: String,
            default: "",
        },
        address1: {
            type: String,
            default: "",
        },
        address2: {
            type: String,
            default: "",
        },
        avatar: {
            type: String,
            required: true,
            default: "https://res.cloudinary.com/dxze1vehc/image/upload/v1752658448/60111_dfcrvf.jpg"
        },
        role: {
            type: String,
            enum: ["user", "vendor", "admin"],
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        addresses: [addressSchema],
        resetPasswordToken: String,
        resetPasswordTime: Date,
    },
    {
        timestamps: true,
    }
);

// 🔐 Pre-save hook to hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// 🔑 Compare entered password with hash
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 🔒 Generate JWT token
userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { _id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );
};

module.exports = mongoose.model("User", userSchema);
