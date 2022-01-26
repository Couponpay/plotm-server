import mongoose from 'mongoose';
const Gift_Wallet = mongoose.Schema({
    Available_Amount: { type: Number, default: 0 },
    Withdrawn_Amount: { type: Number, default: 0 },
    Total_Amount: { type: Number, default: 0 },
}, { collection: "Gift_Wallet" });
export default mongoose.model('Gift_Wallet', Gift_Wallet);