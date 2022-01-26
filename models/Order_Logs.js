import mongoose from 'mongoose';
const Order_Logs = mongoose.Schema({
    LogID: { type: String, default: "" },
    USERID: {type: String, default: ""},
    TransactionID: {type: String, default: ""},
    OrderID: { type: String, default: "" },
    Type: { type: Number, default: 0 }, //1.Credited 2.Debited
    Amount: { type: Number, default: 0 },
    UserData: {},
    ProductData: {},
    Address_Data: {},
    Order_Type: {type: Number, default:0}, //1 : Subscription Product 2: Not Subscription Product
    Time: { type: Date, default: null },
    WebHookData: {},
    Payment_Type: { type: Number, default: 0 }, //1- Wallet, 2- RazorPay 3- both 4- Subscription 
    Order_Number: { type: String, default: "" }, // 12 digits random number
    Payment_Status: { type: Number, default: 0 }, // 1- initial, 2- fail, 3- Success,
    Online_Amount: {type: Number, default:0},
    CallBack: {type:Boolean, default: false},
    Used_Wallet_Amount: {type: Number, default:0},
    Product_Order_Used: {type: Number, default:0}, //1.subscription product used 2: General Product

    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null },

}, { collection: "Order_Logs" });
export default mongoose.model('Order_Logs', Order_Logs);