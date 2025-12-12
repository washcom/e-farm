import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user", 
      required: true 
    }, // Associates item with the logged-in user
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String }, 
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const itemModel =  mongoose.model("item", itemSchema);
export default itemModel;
