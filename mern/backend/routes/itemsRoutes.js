
import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { AuthenticatedUser } from "../middleware/itemAuthenticatedUser.js";
import { RegisterItem } from "../controller/itemController.js";
import { MyItems } from "../controller/itemController.js";
import { totalItems } from "../controller/itemController.js";
import { deleteItem } from "../controller/itemController.js";
import { updateItem } from "../controller/itemController.js";
import { oneItem } from "../controller/itemController.js";

const itemRouter = express.Router();
itemRouter.post("/register-item", AuthenticatedUser, upload.single("image"), RegisterItem);
itemRouter.get("/my-items", AuthenticatedUser, MyItems);
itemRouter.get("/total-items", AuthenticatedUser, totalItems);
itemRouter.delete("/delete/:itemId", AuthenticatedUser, deleteItem);
itemRouter.put("/update/:itemId", AuthenticatedUser, updateItem);
itemRouter. get("/one-item/:itemId", AuthenticatedUser, oneItem);
export default itemRouter;


