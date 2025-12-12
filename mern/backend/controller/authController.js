import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../models/usersModel.js';
import Transporter from '../config/nodeMailer.js';
import walletModel from '../models/WalletModel.js';
//for user registration
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "please provide all the fields" });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }
        const hashedpassword = await bcrypt.hash(password, 12);
        const user = new userModel({ name, email, password: hashedpassword });
        await user.save();
        // create user wallet
        const userWallet = new walletModel({userId:user._id})
        await userWallet.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to E-Farm Application",
            text: `Hello ${name},\n\nWelcome to E-Farm Application.  Account created successfully and We are glad to have you on board.\n\nRegards,\nE-Farm Team`
        };
        await Transporter.sendMail(mailOptions);
        return res.status(201).json({ success: true, message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//for user login
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "please provide all the fields" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid user email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect user password" });
        }
        const token = jwt.sign({ id: user._id ,role:user.role}, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // false for localhost
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        // **Send the token in the response**
        return res.status(200).json({ success: true, message: "User logged in successfully", token:token,role:user.role });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//for user logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//send verification opt to user email
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.verifyOtp = otp;
        user.verifyOtpExpiresAt = Date.now() + 10 * 60 * 1000;
        await user.save();
        //sending otp to user email
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "E-farm Account Verification OTP",
            text: `Hello ${user.name},\n\nYour Account verification OTP is ${otp}.\n\nRegards,\nE-Farm Team`
        };
        await Transporter.sendMail(mailOption);
        return res.status(200).json({ success: true, message: "Account verification Otp sent successfully to your Email" });
    } catch (error) {
        return res.status(501).json({ success: false, message: error.message });
    }
};
//verify user account
export const verifyAccount = async (req, res) => {
    const { otp } = req.body;
    const userId = req.user.id;
    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "please provide all the fields" });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" });
        }
        if (user.verifyOtp !== otp || user.verifyOtp === "") {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        if (user.verifyOtpExpiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpiresAt = 0;
        await user.save();
        return res.status(200).json({ success: true, message: "Account verified successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//check if user is authenticated
export const isauthenicated = async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "User authenticated" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//for user  sending password reset otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.resetOtp = otp;
        user.resetOtpExpiresAt = Date.now() + 10 * 60 * 1000;
        await user.save();
        
        // Sending OTP to user email
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "E-farm Password Reset OTP",
            text: `Hello ${user.name},\n\nYour Password reset OTP is ${otp}.\n\nRegards,\nE-Farm Team`
        };
        await Transporter.sendMail(mailOption);

        return res.status(200).json({ success: true, message: "Password reset OTP sent successfully to your Email" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//for user resetting password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "Please provide all the fields to reset your password" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }  
        if (user.resetOtp !== otp || user.resetOtp === "") {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }   
        if (user.resetOtpExpiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }
        user.password = await bcrypt.hash(newPassword, 12);
        user.resetOtp = ""; 
        user.resetOtpExpiresAt = 0;
        await user.save();
        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"E-Farm Password reset",
            text:`Hello ${user.name} your password reset was Successful.Thanks regards E-farm team `,
        };
        await Transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
