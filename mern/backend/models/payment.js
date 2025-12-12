import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"order",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    transactionId:{
        type:String,
        required:true,
        unique:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["success","failed"],
        default:"success"
    }
},{timestamps:true});

const paymentModel = mongoose.models.payment || mongoose.model("payment",paymentSchema);
export default paymentModel;