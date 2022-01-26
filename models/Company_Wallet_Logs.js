import mongoose from 'mongoose';
const Company_Wallet_Logs = mongoose.Schema({
    LogID: { type: String, default: "" },
    Type: { type: Number, default: 1 }, //1.Credited 2.Debited
    Amount: { type: Number, default: 0 },
    Data: {},
    Time: { type: Date, default: null }
}, { collection: "Company_Wallet_Logs" });
export default mongoose.model('Company_Wallet_Logs', Company_Wallet_Logs);

/**********

//Type 1



 */