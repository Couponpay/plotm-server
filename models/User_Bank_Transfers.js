import mongoose from 'mongoose';
const User_Bank_Transfers = mongoose.Schema({
    TransactionID: { type: String, default: "" },
    RazorpayX_TransactionID: { type: String, default: "" },
    Whether_Shop_Subscription_Shared: { type: Boolean, default: false },
    Transaction_Number: { type: String, default: "" },
    BeneficiaryID: { type: String, default: "" },
    RazorpayX_BeneficiaryID: { type: String, default: "" },
    USERID: { type: String, default: "" },
    RazorpayX_ContactID: { type: String, default: "" },
    BeneficiaryType: { type: Number, default: 1 },//1. Bank Account 2.UPI
    Amount: { type: Number, default: "" },//Rupees
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
    //Old or Admin Functionality
    Transaction_Status: { type: Number, default: 1 }, //1. queued 2. processed 3. issued 4. initiated 5. reversed 6.created 7.cancelled
    Transaction_Reference_ID: { type: String, default: "" },
    Transaction_Completion_Remarks: { type: String, default: "" },
    Transaction_Status_Logs: [{
        _id: false,
        LogID: { type: String, default: "" },
        Transaction_Status: { type: Number, default: 1 }, //1. queued 2. processed 3. issued 4. initiated 5. reversed 6.created 7.cancelled
        Comment: { type: String, default: "" },
        Time: { type: Date, default: null }
    }],
    //New Functionality
    RazorpayXPayoutData: {
        id: { type: String, default: "" },
        amount: { type: Number, default: 0 },
        currency: { type: String, default: "INR" },
        fees: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        status: { type: String, default: "" },
        utr: { type: String, default: "" },
        mode: { type: String, default: "" },
        reference_id: { type: String, default: "" },
        failure_reason: { type: String, default: "" }
    },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "User_Bank_Transfers" });
export default mongoose.model('User_Bank_Transfers', User_Bank_Transfers);