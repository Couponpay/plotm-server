import mongoose from 'mongoose';
const Company_Wallet = mongoose.Schema({
    Available_Amount: { type: Number, default: 0 },
    Withdrawn_Amount: { type: Number, default: 0 },
    Total_Amount: { type: Number, default: 0 },
}, { collection: "Company_Wallet" });
export default mongoose.model('Company_Wallet', Company_Wallet);