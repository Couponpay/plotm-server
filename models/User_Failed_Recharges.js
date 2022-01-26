import mongoose from 'mongoose';
const User_Failed_Recharges = mongoose.Schema({
    ReferenceID: { type: String, default: "" },
    USERID: { type: String, default: "" },
    Available_Amount: { type: Number, default: 0 },
    Recharge_Amount: { type: Number, default: 0 },
    ServiceType: { type: Number, default: 0 },
    RechargePhoneNumber: { type: String, default: "" },
    ServiceCode: { type: String, default: "" },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "User_Failed_Recharges" });
export default mongoose.model('User_Failed_Recharges', User_Failed_Recharges);