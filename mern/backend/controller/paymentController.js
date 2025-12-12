import mongoose from "mongoose";
import walletModel from "../models/WalletModel.js";
import PaymentModel from "../models/payment.js";
import { v4 as uuidv4 } from "uuid";
import orderModel from "../models/OrderModel.js";
import moment from "moment";
import fs from "fs";
import paymentModel from "../models/payment.js";

export const checkoutOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        console.log("Checking out order:", orderId, "for user:", userId);

        // Find the order and populate necessary fields
        const order = await orderModel.findById(orderId)
            .populate("userId")
            .populate("items.itemId")
            .session(session);
        console.log("Fetched Order:", JSON.stringify(order, null, 2));

        if (!order) {
            console.error("Error: Order not found!");
            await session.abortTransaction();
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.isPaid) {
            console.error("Error: Order already paid!");
            await session.abortTransaction();
            return res.status(400).json({ message: "Order already paid" });
        }

        // Get the buyer's wallet
        const buyerWallet = await walletModel.findOne({ userId }).session(session);
        console.log("Buyer Wallet:", buyerWallet);

        if (!buyerWallet || buyerWallet.balance < order.totalPrice) {
            console.error("Error: Insufficient balance!");
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Deduct amount from buyer's wallet
        console.log(`Deducting ${order.totalPrice} from buyer's wallet.`);
        await walletModel.findOneAndUpdate(
            { userId },
            { $inc: { balance: -order.totalPrice } },
            { session }
        );

        // Process payments to sellers
        for (const item of order.items) {
            console.log("Processing item:", item);

            const sellerId = item.itemId.userId;
            const earnings = item.itemId.price * item.quantity;

            if (!sellerId) {
                console.error("Error: Missing sellerId for item:", item);
                await session.abortTransaction();
                return res.status(400).json({ message: "Seller ID is missing for an item." });
            }

            console.log(`Crediting Seller ${sellerId} with ${earnings}`);

            // Credit seller's wallet
            await walletModel.findOneAndUpdate(
                { userId: sellerId },
                { $inc: { balance: earnings } },
                { session }
            );

            // Create payment record
            const paymentData = {
                order: orderId,
                user: sellerId,
                transactionId: uuidv4(),
                amount: earnings,
                status: "success"
            };
            console.log("Creating payment record:", paymentData);
            await PaymentModel.create([paymentData], { session });
        }

        // Mark order as paid
        console.log("Marking order as paid.");
        order.isPaid = true;
        order.status = 'paid';
        await order.save({ session });

        // Commit transaction
        console.log("Committing transaction.");
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Payment successful", order });

    } catch (error) {
        console.error("Transaction Failed:", error.message);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
};

export const generateReceipt = async (req, res) => {
    try {
        console.log("Generating receipt...");

        const userId = req.user.id;
        const { orderId } = req.params;

        console.log("User ID:", userId);
        console.log("Order ID:", orderId);

        const order = await orderModel
            .findById(orderId)
            .populate("userId")
            .populate("items.itemId")
            .populate({
                path: "items.itemId",
                populate: {
                    path: "userId",
                    select: "name email"
                }
            });

        if (!order) {
            
            return res.status(404).json({ message: "Order not found" });
        }

        

        if (!order.isPaid) {
            
            return res.status(400).json({ message: "Order not yet paid" });
        }

        const payment = await paymentModel.findOne({ order: orderId });

        if (!payment) {
           
            return res.status(404).json({ message: "No payment for the order found" });
        }

        console.log("Payment details:", payment);

        let receiptContent = `
        ========== E-FARM RECEIPT ==========
        Date: ${moment().format("YYYY-MM-DD HH:mm:ss")}
        Order ID: ${order._id}
        Buyer Name: ${order.userId.name}
        Buyer Email: ${order.userId.email}
        -----------------------------------------------
`;

        order.items.forEach((item, index) => {
            receiptContent += `
        ${index + 1}. ${item.itemId.name} x ${item.quantity} = ${item.itemId.price * item.quantity}
        Seller Name: ${item.itemId.userId.name}
        Seller Email: ${item.itemId.userId.email}
        -----------------------------------------------
    `;
        });

        receiptContent += `
        Total Price: ${order.totalPrice}
        Transaction ID: ${payment.transactionId}
        Payment Status: ${payment.status.toUpperCase()}
        ===============================================
`;


        return res.status(200).json({ receipt: receiptContent });

    } catch (error) {
        console.error("Error generating receipt:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
