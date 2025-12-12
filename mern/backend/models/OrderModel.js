import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "item",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        price: {
            type: Number,
            required: true,
        },              
    },
    ],
    totalPrice:{
        type:Number,
        required:true,
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:["pending","paid","cancelled"],
        default:"pending",
    },
},{timestamps:true});

const orderModel = mongoose.models.order||mongoose.model("order",orderSchema);
export default orderModel;