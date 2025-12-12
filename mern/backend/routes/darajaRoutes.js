import express from 'express';
import { AuthenticatedUser } from '../middleware/itemAuthenticatedUser.js';
import { getAccessToken } from '../controller/darajaController.js';
import { stkPush } from '../controller/darajaController.js';

const darajaRouter = express.Router();
darajaRouter.get("/access-Token",AuthenticatedUser,getAccessToken);
darajaRouter.post("/deposit",AuthenticatedUser,stkPush);
export default darajaRouter;