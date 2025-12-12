import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }, // Links wishlist to the user
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "item",
      required: true,
    }, // Links wishlist item to an actual product
  },
  { timestamps: true }
);

const WishlistModel =  mongoose.model("wishlist", wishlistSchema);
export default WishlistModel;
