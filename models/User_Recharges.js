import mongoose from 'mongoose';
const User_Recharges = mongoose.Schema({
    RechargeTransactionID: { type: String, default: "" },
    USERID: { type: String, default: "" },
    ReferenceTransactionID: { type: String, default: "" },
    TransactionStatus: { type: Number, default: 0 },//0.Pending/Request Accepted 1.Success 2. Operator Failed 3. System Failed 4. On Hold 5. Refunded 6. In Process
    TransactionStatusDescription: { type: String, default: "" },
    Amount: { type: Number, default: 0 },
    ServiceType: { type: Number, default: 0 },
    RechargePhoneNumber: { type: String, default: "" },
    ServiceCode: { type: String, default: "" },
    OPRID: { type: String, default: "" },
    DP: { type: Number, default: 0 },
    DR: { type: Number, default: 0 },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "User_Recharges" });
export default mongoose.model('User_Recharges', User_Recharges);