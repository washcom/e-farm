import userModel from "../models/usersModel.js";
import jwt from 'jsonwebtoken';
import  {fileURLToPath} from "url";

export const AuthenticatedUser = async (req, res, next) => {

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(501).json({ success: false, message: "Authorized Access please log in" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded.id).select("-password");
        console.log(req.user.id);
        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }       
        next();

    } catch (error) {
        return res.status(401).json({success:false,message:'invalid token'});
    }
}