import mongoose from 'mongoose';
const Transfer_OTP_Tries = mongoose.Schema({
    CountryCode: { type: String, default: "" },
    PhoneNumber: { type: String, default: "" },
    Time: { type: Date, default: null }
}, { collection: "Transfer_OTP_Tries" })
export default mongoose.model('Transfer_OTP_Tries', Transfer_OTP_Tries);