import { addToCart } from "../controller/cartController.js";
import { AuthenticatedUser } from "../middleware/itemAuthenticatedUser.js";
import { viewCart } from "../controller/cartController.js";
import { totalCartItems } from "../controller/cartController.js";
import { updateCart } from "../controller/cartController.js";
import { removeItemFromCart } from "../controller/cartController.js";
import express from 'express';

const cartRouter = express.Router();
cartRouter.post("/add-to-cart",AuthenticatedUser,addToCart);
cartRouter.get("/view-cart",AuthenticatedUser,viewCart);
cartRouter.get("/total-cart-items",AuthenticatedUser,totalCartItems);
cartRouter.put("/update",AuthenticatedUser,updateCart);
cartRouter.delete("/remove",AuthenticatedUser,removeItemFromCart);
export default cartRouter;