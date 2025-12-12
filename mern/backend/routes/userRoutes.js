import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controller/userController.js';
import { AuthenticatedUser } from '../middleware/itemAuthenticatedUser.js'
import { updateUser } from '../controller/userController.js';

const userRouter = express.Router();
userRouter.get('/data',AuthenticatedUser,getUserData);
userRouter.post("/update",AuthenticatedUser,updateUser);
export default userRouter;