import mongoose from 'mongoose';
const Subscription_Log = mongoose.Schema({
    Subscription_LogID: { type: String, default: "" },
    SNo:{ type: Number, default: 0 },
    Version: { type: Number, default: 0 },
    SubscriptionID: { type: String, default: "" },
    Subscription_Amount: { type: Number, default: 0 },
    Subscription_Name: { type: String, default: ""}, 
    Description: {type: String, default: ""},
    Subscription_Type: {
        User_Subscription_Share: {type: Number, default: 0},
        Company_Subscription_Share: {type: Number, default: 0},
        Trimmer_Subscription_Share: {type: Number, default: 0},
        Max_Receivers: {type: Number, default: 0},
        DF_Ref: {type: Number, default: 0},
        Max_Reward: {type: Number, default: 0},        
        Max_Wallet_Limit: {type: Number, default: 0},

        //new keys added raj
        Gift_Share: {type: Number, default: 0},
        Level_One_Share: {type: Number, default: 0},
        Level_Two_Share: {type: Number, default: 0}
    },
    Duration: {type: Number, default: 0},
    //keys Added raj
    New_Pin: {type: Boolean, default: false},
    Delivery_Compulsory: {type: Boolean, default: false},
    Product_ID: {type: String, default: ""},
    Product_Data: {},
    Product_Logs: [
        { }
    ],

    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
}, { collection: "Subscription_Log" });
export default mongoose.model('Subscription_Log', Subscription_Log);