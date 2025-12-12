import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    items:[
        {
            itemId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"item",
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
                default:1,
            },
            price:{
                type:Number,
                required:true,
            },
        },
    ],
    totalPrice:{
        type:Number,
        required:true,
        default:0,
    },
},{timestamps:true});

const cartModel = mongoose.models.cart||mongoose.model('cart',cartSchema);
export default cartModel;