import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpiresAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpiresAt: { type: Number, default: 0 },
    //for update 
    phone: { type: String, unique: true, sparse: true }, // Allows empty but must be unique if present
    profileImage: { type: String, default: "" },
    dateOfBirth: { type: Date, default: null },
    sex: { type: String, enum: ["male", "female", "other"], required: true, default: "other" },
    country: { type: String,  default: "" },
    county: { type: String,  default: "" },
    postalCode: { type: String, default: "" },
}, {
    timestamps: true
});
const userModel = mongoose.models.user || mongoose.model('user',userSchema);
export default userModel;

