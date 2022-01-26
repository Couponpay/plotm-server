import mongoose from 'mongoose';
const Trimmer_Wallet = mongoose.Schema({
    Available_Amount: { type: Number, default: 0 },
    Withdrawn_Amount: { type: Number, default: 0 },
    Total_Amount: { type: Number, default: 0 },
}, { collection: "Trimmer_Wallet" });
export default mongoose.model('Trimmer_Wallet', Trimmer_Wallet);