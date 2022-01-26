import mongoose from 'mongoose';
const GST_Wallet_Logs = mongoose.Schema({
    LogID: { type: String, default: "" },
    Type: { type: Number, default: 1 }, //1.Credited
    Amount: { type: Number, default: 0 },
    Data: {},
    Time: { type: Date, default: null }
}, { collection: "GST_Wallet_Logs" });
export default mongoose.model('GST_Wallet_Logs', GST_Wallet_Logs);

/**********

//Type 1



 */