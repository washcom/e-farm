import userModel from '../models/usersModel.js';
import itemModel from '../models/itemsModel.js';
import orderModel from '../models/OrderModel.js';
import { isPaid, unpaidOrders } from './orderController.js';
export const getUserData = async (req, res) => {
    try {
        const users = await userModel.find({}, "_id name email role isAccountVerified ");
        return res.status(201).json(users);
        console.log(users);
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

export const getItems = async (req, res) => {
    try {
        const items = await itemModel.find({}, "_id name description category price stock image");
        return res.status(201).json(items);
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
}
export const displayOrders = async (req, res) => {
    try{
        const orders = await orderModel.find()
        res.status(201).json(orders);
    }
    catch(error){
        return res.status(501).json({message:"Internal server Error"});
    }
}
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(201).json({ message: "user deleted!!!!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server Error " });
    }
}
export const totalUsers = async (req, res) => {
    try {
        const allUsers = await userModel.countDocuments();
        return res.status(201).json(allUsers);
    } catch (error) {
        return res.status(501).json({ message: "Internal server Error " });
    }
}
export const totalItems = async (req, res) => {
    try {
        const allItems = await itemModel.countDocuments();
        return res.status(201).json(allItems);
    } catch (error) {
        return res.status(501).json({ message: "Internal server Error " });
    }
}
export const totalCategories = async (req, res) => {
    try {
        const allCategories = await itemModel.distinct("category");
        return res.status(201).json(allCategories);
    } catch (error) {
        return res.status(501).json({ message: "Internal server Error " });
    }
}
export const paidOrders = async (req, res) => {
    try{
        const allPaidOrders = await orderModel.countDocuments({isPaid:true});
        return res.status(201).json(allPaidOrders);
    }
    catch(error){
        return res.status(501).json({message:"Internal server Error"});
    }
 }
 export const notpaidOrders = async (req, res) => {
    try{
        const allUnpaidOrders = await orderModel.countDocuments({isPaid:false});
        return res.status(201).json(allUnpaidOrders);
    }
    catch(error){
        return res.status(501).json({message:"Internal server Error"});
    }
 }
 export const todaySignups = async (req, res) => {
    try{
        const todaySignups = await userModel.countDocuments({createdAt:{$gte:Date.now()-24*60*60*1000}});
        return res.status(201).json(todaySignups);
    }
    catch(error){
        return res.status(501).json({message:"Internal server Error"});
    }
 }
 export const totalSales = async (req, res) => {
    try {
        const allPaidOrders = await orderModel.find({isPaid:true});
        const totalsales = allPaidOrders.reduce((sum , order) => sum + order.totalPrice, 0);
        return res.status(201).json(totalsales);
    } catch (error) {
        return res.status(501).json({ message: "Internal server Error " });       
    }
 }


