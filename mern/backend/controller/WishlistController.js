import WishlistModel from "../models/wishlist.js";
import itemModel from "../models/itemsModel.js";
import mongoose from "mongoose";

//add item to wishlist
export const addToWishlist = async (req, res) => {
    try {

        const { itemId } = req.body;
        const userId = req.user.id; //from auth middleware
        console.log(` itemId:${itemId}`);

        //find the item
        const itemExist = await itemModel.findById(itemId);
        if (!itemExist) {
            return res.status(404).json({ message: "item not found" });
        }
        //find if it already in system
        const alreadyInWishlist = await WishlistModel.findOne({ userId, itemId });
        if (alreadyInWishlist) {
            return res.status(400).json({ message: "item already in wishlist" });
        }
        const wishlistItem = new WishlistModel({ userId, itemId });
        await wishlistItem.save();
        return res.status(201).json({ message: "item added to wishlist" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

//remove from wishList
// Updated removeFromWishlist with enhanced logging and validation
export const removeFromWishlist = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user.id;

        console.log(`Attempting to remove item ${itemId} from user ${userId}'s wishlist`); // Debug log

        // Validate itemId format
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: "Invalid item ID format" });
        }

        const wishlistItem = await WishlistModel.findOneAndDelete({ userId, itemId });

        if (!wishlistItem) {
            console.log(`Item ${itemId} not found in user ${userId}'s wishlist`); // Debug log
            return res.status(404).json({ message: "Item not found in wishlist" });
        }

        return res.status(200).json({ message: "Item removed from wishlist" });
    } catch (error) {
        console.error("Error removing item:", error); // Detailed error log
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
//get user wishList
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const wishlistItem = await WishlistModel.find({ userId }).populate("itemId");
        res.status(200).json(wishlistItem);
    } catch (error) {
        return res.status(500).json({ message: "server error", error: error.message });
    }
}

//total wishlist items
export const totalWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const totalWishlist = await WishlistModel.countDocuments({userId});
        return res.status(201).json({totalWishlist});
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" });
    }
}