import { addToWishlist } from "../controller/WishlistController.js";
import { getWishlist } from "../controller/WishlistController.js";
import { removeFromWishlist } from "../controller/WishlistController.js";
import { AuthenticatedUser } from "../middleware/itemAuthenticatedUser.js";
import { totalWishlist } from "../controller/WishlistController.js";
import express from 'express';

const wishlistRouter = express.Router();
wishlistRouter.post("/add",AuthenticatedUser,addToWishlist);
wishlistRouter.delete("/remove/:itemId", AuthenticatedUser, removeFromWishlist);
wishlistRouter.get("/get-wishlist",AuthenticatedUser,getWishlist);
wishlistRouter.get("/total-wishlist",AuthenticatedUser,totalWishlist);
export default wishlistRouter;