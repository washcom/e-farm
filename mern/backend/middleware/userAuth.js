import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {
      const token = req.cookies.token; // Changed from destructuring
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: "Unauthorized, please log in again" 
        });
      }  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user.id = decoded.id;
      console.log("Authenticated user ID:", decoded.id);
      next();
    } catch (error) {
      console.error("JWT Error:", error.message);
      return res.status(401).json({ 
        success: false, 
        message: "Session expired. Please login again" 
      });
    }
  };
  export default userAuth;
