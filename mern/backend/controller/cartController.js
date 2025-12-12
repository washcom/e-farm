import itemModel from "../models/itemsModel.js";
import cartModel from "../models/CartModel.js";

// Add Item to Cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, quantity } = req.body;

        if (!itemId || quantity <= 0) {
            return res.status(400).json({ message: "Invalid item or quantity" });
        }

        const item = await itemModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Ensure sufficient stock is available
        if (item.stock < quantity) {
            return res.status(400).json({ message: `Only ${item.stock} items in stock` });
        }

        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            cart = new cartModel({ userId, items: [], totalPrice: 0 });
        }

        const existingItemIndex = cart.items.findIndex(cartItem => cartItem.itemId.toString() === itemId);
        if (existingItemIndex !== -1) {
            cart.items[existingItemIndex].quantity += quantity;
            cart.items[existingItemIndex].price = item.price;
        } else {
            cart.items.push({ itemId, quantity, price: item.price });
        }

        // Recalculate total price
        cart.totalPrice = cart.items.reduce((total, cartItem) => total + cartItem.quantity * cartItem.price, 0);

        // Update stock
        item.stock -= quantity;
        await item.save();

        // Save updated cart
        await cart.save();

        return res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update Cart (Change Item Quantity)
export const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity cannot be less than 1" });
        }

        const cartUser = await cartModel.findOne({ userId });
        if (!cartUser) {
            return res.status(400).json({ message: "User cart not found" });
        }

        const cartItem = cartUser.items.find(item => item.itemId.toString() === itemId);
        if (!cartItem) {
            return res.status(404).json({ message: "Item not in cart" });
        }

        const item = await itemModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Calculate stock difference
        const stockDifference = quantity - cartItem.quantity;

        // Check if sufficient stock is available
        if (stockDifference > 0 && item.stock < stockDifference) {
            return res.status(400).json({ message: `Only ${item.stock} items in stock` });
        }

        // Update item stock
        item.stock -= stockDifference;
        await item.save();

        // Update cart item quantity
        cartItem.quantity = quantity;

        // Recalculate total price
        cartUser.totalPrice = cartUser.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        await cartUser.save();
        return res.status(200).json({ message: "Cart updated successfully" });

    } catch (error) {
        console.error("Update Cart Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Remove Item from Cart
export const removeItemFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.body;

        if (!itemId) {
            return res.status(400).json({ message: "Item ID is required" });
        }

        const cartUser = await cartModel.findOne({ userId });
        if (!cartUser) {
            return res.status(404).json({ message: "User cart not found" });
        }

        const cartItem = cartUser.items.find(item => item.itemId.toString() === itemId);
        if (!cartItem) {
            return res.status(404).json({ message: "Item not in cart" });
        }

        // Update stock (restore quantity to inventory)
        const item = await itemModel.findById(itemId);
        if (item) {
            item.stock += cartItem.quantity;
            await item.save();
        }

        // Remove item from cart
        cartUser.items = cartUser.items.filter(item => item.itemId.toString() !== itemId);

        // Recalculate total price
        cartUser.totalPrice = cartUser.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        await cartUser.save();
        return res.status(200).json({ message: "Item removed successfully" });

    } catch (error) {
        console.error("Error removing item:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// View Cart
export const viewCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await cartModel.findOne({ userId }).populate("items.itemId");

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({ message: "Your cart is empty.", cart: [] });
        }

        return res.status(200).json({ cart });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get Total Cart Items
export const totalCartItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const userCart = await cartModel.findOne({ userId });
        const totalCartItems = userCart ? userCart.items.length : 0;

        return res.status(200).json({ totalCartItems });
    } catch (error) {
        console.error("Error fetching total cart items:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
