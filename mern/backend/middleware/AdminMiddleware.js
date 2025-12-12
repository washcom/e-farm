import jwt from 'jsonwebtoken';
import User from '../models/usersModel.js';

const isAdmin = async (res, req, next) => {
    const token = req.header('Authorization')?.replace('Bearer', '');
    if (!token) {
        return res.status(501).json({ success: false, message: 'Authorization token is missing' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userid);
        if (!user) {
            return res.status(401).json({ success: false, message: 'user not found' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied . Admins only allowed' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'invalid token' });
    }
}
export default isAdmin;