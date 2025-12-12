import express from "express";
import { getproducts,createProduct,updateProduct,deleteProduct } from "../controller/ProductController.js";
import { login, logout, register } from "../controller/authController.js";
const router = express.Router();
//product routes
router.get("/",getproducts);
router.post("/",createProduct);
router.put("/:id",updateProduct);
router.delete("/:id",deleteProduct );
export default router;