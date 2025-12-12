import walletModel from "../models/WalletModel.js";
export const walletInfo = async(req,res)=>{
    try {
        const  userId = req.user.id;
        const wallet = await walletModel.findOne({ userId }).populate("userId");
        if(!wallet){
            return res.status(404).json({message:"Account not found create one"});
        }
        return res.status(201).json(wallet);
    } catch (error) {
        return res.status(500).json({message:"failed to fetch wallet info!"});
    }
}