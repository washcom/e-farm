import { request } from "express";
import itemModel from "../models/itemsModel.js";
export const RegisterItem = async (req, res) => {
    try {
        const { name, description, price, category, stock, image } = req.body;

        if (!name || !description || !price || !category || !stock || !image) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newItem = new itemModel({
            userId: req.user.id,
            name,
            description,
            price: parseFloat(price),
            category,
            stock: parseInt(stock),
            image,
        });

        await newItem.save();
        res.status(201).json({ message: "Item registered successfully", item: newItem });

    } catch (error) {
        console.error("❌ Error registering item:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const MyItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const items = await itemModel.find({ userId });
        res.status(201).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
export const totalItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const totalItems = await itemModel.countDocuments({ userId });
        return res.status(201).json({ totalItems });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const deletedItem = await itemModel.findByIdAndDelete(itemId);
        if (!deletedItem) {
            return res.status(404).json({ message: "item not found" });
        }
        return res.status(201).json({ message: "item deleted" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "internal server error deleting the item" });
    }
}

export const updateItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const updatedItem = await itemModel.findByIdAndUpdate(itemId, req.body, { new: true });
        if(!updatedItem){
            return res.status(404).json({message:"Item not found"});
        }
        return res.status(201).json(updatedItem);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal server error while updating the Item"});
    }
}
export const oneItem = async(req,res)=>{
    try {
        const {itemId} = req.params;
        const item = await itemModel.findById(itemId);
        if(!item){
            return res.status(404).json({message:"Item not Found"});
        }
        return res.status(201).json(item);
    } catch (error) {
        console.error(error)        ;
        return res.status(500).json({message:"Internal server Error"});
    }
}