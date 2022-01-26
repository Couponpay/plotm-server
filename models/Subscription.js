import mongoose from 'mongoose';
const Subscription = mongoose.Schema({
    SubscriptionID: { type: String, default: "" },
    SNo: { type: Number, default: 0 },
    Subscription_Amount: { type: Number, default: 0 },
    Subscription_Name: { type: String, default: "" },
    Description: { type: String, default: "" },
    Subscription_Type: {
        User_Subscription_Share: { type: Number, default: 0 },
        Company_Subscription_Share: { type: Number, default: 0 },
        Trimmer_Subscription_Share: { type: Number, default: 0 },
        Max_Receivers: { type: Number, default: 0 },
        DF_Ref: { type: Number, default: 0 },
        Max_Reward: { type: Number, default: 0 },
        Max_Wallet_Limit: { type: Number, default: 0 },

        //new keys added raj
        Gift_Share: { type: Number, default: 0 },
        Level_One_Share: { type: Number, default: 0 },
        Level_Two_Share: { type: Number, default: 0 }
    },
    Duration: { type: Number, default: 0 },
    Status: { type: Boolean, default: true },
    Current_Version: { type: Number, default: 0 },

    //keys Added raj
    New_Pin: { type: Boolean, default: false },
    Delivery_Compulsory: { type: Boolean, default: false },
    Product_ID: {type: String, default: ""},
    Product_Data: {},
    Product_Logs: [
        { }
    ],

    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "Subscription" });
export default mongoose.model('Subscription', Subscription);