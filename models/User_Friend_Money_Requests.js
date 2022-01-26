import mongoose from 'mongoose';
const User_Friend_Money_Requests = mongoose.Schema({
    USERID: { type: String, default: "" },
    Amount: { type: Number, default: 0 },
    After_Commissioned_Amount: { type: Number, default: 0 },
    REQUEST_DETAILS: {
        USERID: { type: String, default: "" },
        Name: { type: String, default: "" },
        CountryCode: { type: String, default: "" },
        PhoneNumber: { type: String, default: "" }
    },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "User_Friend_Money_Requests" });
export default mongoose.model('User_Friend_Money_Requests', User_Friend_Money_Requests);