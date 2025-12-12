import mongoose from "mongoose";
import OrderModel from "../models/OrderModel.js";
import itemModel from "../models/itemsModel.js";
import userModel from "../models/usersModel.js";
import Transporter from "../config/nodeMailer.js";
import orderModel from "../models/OrderModel.js";
import cartModel from "../models/CartModel.js";
import paymentModel from "../models/payment.js";

export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, totalPrice } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }
        const newOrder = new OrderModel({
            userId,
            items,
            totalPrice,
        });

        await newOrder.save();
        console.log(`Order Created`);

        for (const orderedItem of items) {
            console.log(`Processing item ID: ${orderedItem.itemId}`);

            const item = await itemModel.findById(orderedItem.itemId).populate("userId");
            if (!item) {
                console.warn(`Item not found: ${orderedItem.itemId}`);
                continue;
            }

            const seller = await userModel.findById(item.userId);
            if (!seller || !seller.email) {
                console.log(`Seller not found or missing email for item: ${item.name}`);
            }

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: seller.email,
                subject: "Your item has been ordered!",
                html: `
                    <h3>Hello ${seller.name},</h3>
                    <p>Your item <strong>${item.name}</strong> has been ordered.</p>
                    <p><strong>Order Details:</strong></p>
                    <ul>
                        <li><strong>Item:</strong> ${item.name}</li>
                        <li><strong>Quantity:</strong> ${orderedItem.quantity}</li>
                        <li><strong>Price:</strong> Ksh ${(parseFloat(orderedItem.price) || 0).toFixed(2)}</li>
                        <li><strong>Total Amount:</strong> Ksh ${(orderedItem.quantity * (parseFloat(orderedItem.price) || 0)).toFixed(2)}</li>
                    </ul>
                    <p>Thank you for using our platform.</p>
                `,
            };

            try {
                await Transporter.sendMail(mailOptions);
                console.log(`Email sent to seller: ${seller.email}`);
            } catch (error) {
                console.error(`Failed to send email to ${seller.email}:`, error);
            }
        }

        const orderingUser = await userModel.findById(userId);
        if (!orderingUser || !orderingUser.email) {
            console.log("Ordering user not found or missing email.");
            return res.status(400).json({ error: "User not found" });
        }

        const userMailOptions = {
            from: process.env.SENDER_EMAIL,
            to: orderingUser.email,
            subject: "Order Confirmation",
            text: `Hello ${orderingUser.name},\n\nYour order has been placed successfully.\n\nOrder Details:\n${items
                .map((item) => `- Item: ${item.name}\n  Quantity: ${item.quantity}\n  Price: Ksh ${(parseFloat(item.price) || 0).toFixed(2)}`)
                .join("\n\n")}\n\nTotal Price: Ksh ${(parseFloat(totalPrice) || 0).toFixed(2)}\n\nThank you for shopping with us!\n\nBest Regards,\nE-Farm`,
        };
        try {
            await Transporter.sendMail(userMailOptions);
            console.log(`Order confirmation email sent to user: ${orderingUser.email}`);
        } catch (error) {
            console.error(`Failed to send order confirmation email:`, error);
        }
        // the cart model after placing the order
        await cartModel.deleteMany({ userId });
        return res.status(201).json({ message: "Your order has been placed successfully!" });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await orderModel.find({ userId })
            .populate("items.itemId")
            .sort({ createdAt: -1 });

        if (!orders) {
            return res.status(404).json({ message: "No orders found" });
        }
        return res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const authenticatedUserTotalOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const totalOrders = await orderModel.countDocuments({ userId });
        return res.status(201).json({ totalOrders });
    } catch (error) {
        console.log("Error fetching total orders for the user", error);
        return res.status(500).json({ error: "internal server error" });
    }
}

//getoneUserorder

export const oneOrder = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "order not found" });
        }
        return res.status(201).json(order);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server Error" });
    }
}
//check if order is paid for
export const isPaid = async (req, res) => {
    try {
        const { orderId } = req.params;
        const payment = await paymentModel.findOne(orderId);
        if (!payment) {
            return res.status(404).json({ message: "No payment record found for the order" });
        }
        return res.status(201).json(payment);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error " });
    }
}

export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ message: "no order found" });
        }
        return res.status(201).json({ message: "order cancelled" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error failed to cancel order" });
    }
}
export const paidOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const paidOrders = await orderModel.countDocuments({ userId, isPaid: true });
        return res.status(201).json(paidOrders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const unpaidOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const unpaidCount = await orderModel.countDocuments({ userId, isPaid: false });
        return res.status(200).json(unpaidCount);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const revenue = async (req, res) => {
    const userId = req.user.id;
    try{
        const paidOrders = await orderModel.find({userId,isPaid:true});
        const totalRevenue = paidOrders.reduce((sum,order)=>sum+order.totalPrice,0);
        return res.status(200).json(totalRevenue);
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
}


