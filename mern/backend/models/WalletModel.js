import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique:true
    },
    balance:{
        type:Number,
        default:0
    },
    transactions:[
        {
            type:{
                type:String,
                enum:[
                    "deposit",
                    "withdrawal",
                    "purchase"
                ],
                required:true,
            },
            amount:{
                type:Number,
                required:true
            },
            date:{
                type:Date,
                default:Date.now
            },
            status:{
                type:String,
                enum:[
                    "pending",
                    "successful",
                    "Failed"
                ],
                default: "successful"
            },
        },
    ],
},{timestamps:true});

const walletModel= mongoose.models.wallet || mongoose.model("wallet",walletSchema);
export default walletModel;