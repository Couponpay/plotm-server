import mongoose from 'mongoose';
const User_Subscription_Log = mongoose.Schema({
    USERID: { type: String, default: "" },
    SubscriptionID: { type: String, default: "" },
    Version: { type: Number, default: 0 },    
    Total_Amount: { type: Number, default: 0 },
    TransactionID: {type: String, default: ""},
    With_PIN:{ type: Boolean, default: false},
    User_PIN_Code: { type: String, default: ""},
    Status: { type: Number, default: 0 }, // 1- initial, 2- fail, 3- Success,
    WebHookData:{},
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "User_Subscription_Log" });
export default mongoose.model('User_Subscription_Log', User_Subscription_Log);