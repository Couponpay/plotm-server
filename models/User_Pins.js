import mongoose from 'mongoose';
const User_Pins = mongoose.Schema({
    USERID: { type: String, default: "" },
    USER_PIN_CODE: { type: String, default: "" },
    Whether_Code_Used: { type: Boolean, default: false },
    PIN_APPLIED_DETAILS: {
        USERID: { type: String, default: "" },
        Name: { type: String, default: "" },
        CountryCode: { type: String, default: "" },
        PhoneNumber: { type: String, default: "" }
    },
    SubscriptionID: { type: String, default: "" },
    Subscription_Amount: { type: String, default: "" },
    Subscription_Type: { type: String, default: "" },
    Version: { type: Number, default: 0 },
    TransactionID: {type: String, default: ""},
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "User_Pins" });
export default mongoose.model('User_Pins', User_Pins);