import userModel from "../models/usersModel.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.user.id; // Get userId from req (set in middleware)
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized request" });
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                phone:user.phone,
                role:user.role,
                country:user.country,
                county:user.county,
                sex:user.sex,                             
            },
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
export const updateUser = async (req, res) => {
    try {
        const userId = req.user.id; // Ensure authenticated user ID is available
        const { phone, dateOfBirth, sex, country, county, postalCode } = req.body;

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ success: false, message: "Phone number must be exactly 10 digits" });
        }
        const existingUser = await userModel.findOne({ phone });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(409).json({ success: false, message: "Phone number already in use" });
        }

        // 🔹 Check if required fields are present
        if (!phone || !sex || !country || !county) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }
        // 🔹 Find the user in the database
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(405).json({ success: false, message: "User not found" });
        }
        // 🔹 Update fields only if provided
        user.phone = phone;
        user.sex = sex;
        user.country = country;
        user.county = county;
        if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
        if (postalCode) user.postalCode = postalCode;
        // 🔹 Save the updated user
        await user.save();

        return res.status(200).json({ success: true, message: "User profile updated successfully", data: user });
    } catch (error) {
        console.error(`Error updating user profile: ${error.message}`);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};