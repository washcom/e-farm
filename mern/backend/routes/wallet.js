import express from "express";
import { AuthenticatedUser } from "../middleware/itemAuthenticatedUser.js";
import { walletInfo } from "../controller/wallet.js";

const walletRouter = express.Router();
walletRouter.get("/my-wallet",AuthenticatedUser,walletInfo);
export default walletRouter;