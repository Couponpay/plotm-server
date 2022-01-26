import mongoose from 'mongoose';
const User_Pin_Purchase = mongoose.Schema({
    USERID: { type: String, default: "" },
    SubscriptionID: { type: String, default: "" },
    Version: { type: Number, default: 0 },
    Quantity: { type: Number, default: 0 },
    Total_Amount: { type: Number, default: 0 },
    Use_From_Wallet: { type: Boolean, default: false },
    Amount_Used_From_Wallet: { type: Number, default: 0 },
    Callback: { type: Boolean, default: false },
    Amount_Online: { type: Number, default: 0 },
    TransactionID: {type: String, default: ""},
    Status: { type: Number, default: 0 }, // 1- initial, 2- fail, 3- Success,
    WebHookData:{},
    Subscription_Name:{ type: String, default: "" },
    Subscription_Amount:{ type: String, default: "" },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "User_Pin_Purchase" });
export default mongoose.model('User_Pin_Purchase', User_Pin_Purchase);