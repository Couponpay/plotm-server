import mongoose from 'mongoose';
const Transfer_OTP = mongoose.Schema({
    CountryCode: { type: String, default: "" },
    PhoneNumber: { type: String, default: "" },
    OTP: { type: Number, default: 0 },
    Latest: { type: Boolean, default: true },
    Time: { type: Date, default: null }
}, { collection: "Transfer_OTP" });
export default mongoose.model('Transfer_OTP', Transfer_OTP);