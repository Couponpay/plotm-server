import mongoose from 'mongoose';
const Users_Referrals = mongoose.Schema({
    USERID: { type: String, default: "" },
    Name: { type: String, default: "" },
    CountryCode: { type: String, default: "" },
    PhoneNumber: { type: String, default: "" },
    Whether_Company_Account: { type: Boolean, default: false },
    Referral_USERID_Array: { type: [String], default: [] },
    Referral_Information: [{
        _id: false,
        USERID: { type: String, default: "" },
        Name: { type: String, default: "" },
        CountryCode: { type: String, default: "" },
        PhoneNumber: { type: String, default: "" }
    }],
    Whether_Subscribed: { type: Boolean, default: false },
    No_of_Referrals: { type: Number, default: 0 },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "Users_Referrals" });
export default mongoose.model('Users_Referrals', Users_Referrals);