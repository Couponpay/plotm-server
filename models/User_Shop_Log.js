import mongoose from 'mongoose';
const User_Shop_Log = mongoose.Schema({
    USERID: { type: String, default: "" },
    Total_Amount: { type: Number, default: 0 },
    TransactionID: {type: String, default: ""},
    Status: { type: Number, default: 0 }, // 1- initial, 2- fail, 3- Success,
    WebHookData:{},
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "User_Shop_Log" });
export default mongoose.model('User_Shop_Log', User_Shop_Log);