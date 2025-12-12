import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db.js";
import ProductRoutes from "./routes/routes.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import AdminRoutes from "./routes/admin.js";
import itemRouter from "./routes/itemsRoutes.js";
import wishlistRouter from "./routes/wishListRouter.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import walletRouter from "./routes/wallet.js";
import paymentRouter from "./routes/paymentRoutes.js";
import path from "path";
import darajaRouter from "./routes/darajaRoutes.js";
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
const PORT = process.env.PORT;
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/products",ProductRoutes);
app.use("/api/admin",AdminRoutes);
app.use("/api/items",itemRouter);
app.use("/api/wishlist",wishlistRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.use("/api/wallet",walletRouter );
app.use("/api/payment",paymentRouter);
app.use("/api/daraja",darajaRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.listen(PORT, () => {
    connectDb();
    console.log("server started at 127.0.0.1:",PORT||5001);
});



