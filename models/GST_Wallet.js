import mongoose from 'mongoose';
const GST_Wallet = mongoose.Schema({
    Available_Amount: { type: Number, default: 0 },
    Withdrawn_Amount: { type: Number, default: 0 },
    Total_Amount: { type: Number, default: 0 },
}, { collection: "GST_Wallet" });
export default mongoose.model('GST_Wallet', GST_Wallet);