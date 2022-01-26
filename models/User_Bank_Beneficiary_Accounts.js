import mongoose from 'mongoose';
const User_Bank_Beneficiary_Accounts = mongoose.Schema({
    BeneficiaryID: { type: String, default: "" },
    RazorpayX_BeneficiaryID: { type: String, default: "" },
    USERID: { type: String, default: "" },
    RazorpayX_ContactID: { type: String, default: "" },
    BeneficiaryType: { type: Number, default: 1 },//1. Bank Account 2.UPI 
    Name: { type: String, default: "" },
    Account_Number: { type: String, default: "" },
    IFSC: { type: String, default: "" },
    Bank_Details: {
        BANK: { type: String, default: "" },
        BANKCODE: { type: String, default: "" },
        IFSC: { type: String, default: "" },
        CONTACT: { type: String, default: "" },
        BRANCH: { type: String, default: "" },
        ADDRESS: { type: String, default: "" },
        CITY: { type: String, default: "" },
        DISTRICT: { type: String, default: "" },
        STATE: { type: String, default: "" }
    },
    UPI: { type: String, default: "" },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "User_Bank_Beneficiary_Accounts" });
export default mongoose.model('User_Bank_Beneficiary_Accounts', User_Bank_Beneficiary_Accounts);