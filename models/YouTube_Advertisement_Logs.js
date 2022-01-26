import mongoose from 'mongoose';
const YouTube_Advertisement_Logs = mongoose.Schema({
    LogID: { type: String, default: "" },
    USERID: {type: String, default: ""},
    TransactionID: {type: String, default: ""},
    Amount: { type: Number, default: 0 },
    Data: {},
    WebHookData: {},
    Payment_Type: { type: Number, default: 0 }, //1- Wallet, 2- RazorPay 3- both 4- Subscription
    Payment_Status: { type: Number, default: 0 }, // 1- initial, 2- fail, 3- Success,
    Online_Amount: {type: Number, default:0},
    CallBack: {type:Boolean, default: false},
    Used_Wallet_Amount: {type: Number, default:0},

    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null },
}, { collection: "YouTube_Advertisement_Logs" });
export default mongoose.model('YouTube_Advertisement_Logs', YouTube_Advertisement_Logs);