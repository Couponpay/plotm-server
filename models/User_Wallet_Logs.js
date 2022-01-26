import mongoose from 'mongoose';
const User_Wallet_Logs = mongoose.Schema({
    LogID: { type: String, default: "" },
    USERID: { type: String, default: "" },
    Type: { type: Number, default: 1 }, //1. Credited from Razorpay 2. Debited for Subscription
    Amount: { type: Number, default: 0 },
    Data: {},
    Time: { type: Date, default: null }
}, { collection: "User_Wallet_Logs" });
export default mongoose.model('User_Wallet_Logs', User_Wallet_Logs);

/*********
 *
 *
 *







 */