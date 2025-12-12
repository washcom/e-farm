import express from "express";
import { AuthenticatedUser } from "../middleware/itemAuthenticatedUser.js";
import { checkoutOrder } from "../controller/paymentController.js";
import {generateReceipt} from "../controller/paymentController.js";
const paymentRouter = express.Router();
paymentRouter.post("/checkout/:orderId",AuthenticatedUser,checkoutOrder);
paymentRouter.get("/order-payment/:orderId",AuthenticatedUser,generateReceipt);
export default paymentRouter;