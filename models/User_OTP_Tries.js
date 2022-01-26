import mongoose from 'mongoose';
const User_OTP_Tries = mongoose.Schema({
    CountryCode: { type: String, default: "" },
    PhoneNumber: { type: String, default: "" },
    Time: { type: Date, default: null }
}, { collection: "User_OTP_Tries" })
export default mongoose.model('User_OTP_Tries', User_OTP_Tries);