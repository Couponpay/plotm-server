import mongoose from 'mongoose';
const Users = mongoose.Schema({
    USERID: { type: String, default: "" },
    Whether_RazorpayX_Customer_Register: { type: Boolean, default: false },
    RazorpayX_ContactID: { type: String, default: "" },
    USER_SESSIONS: {
        SessionID: { type: String, default: "" }
    },
    DeviceID: { type: String, default: "" },
    Name: { type: String, default: "" },
    CountryCode: { type: String, default: "" },
    PhoneNumber: { type: String, default: "" },
    EmailID: { type: String, default: "" },
    Password_Available: { type: Boolean, default: false },
    PasswordHash: { type: String, default: "" },
    PasswordSalt: { type: String, default: "" },
    Whether_Company_Account: { type: Boolean, default: false },
    Whether_Referral_Signup: { type: Boolean, default: true },
    Referral_USERID: { type: String, default: "" },
    Zip_Code: { type: String, default: "" },
    State: { type: String, default: "" },
    Area: { type: String, default: "" },
    City: { type: String, default: "" },
    User_Basic_Information_Available: { type: Boolean, default: false },
    User_Image_Available: { type: Boolean, default: false },
    User_Image_Data: {
        ImageID: { type: String, default: "" },
        Image50: { type: String, default: "" },
        Image100: { type: String, default: "" },
        Image250: { type: String, default: "" },
        Image550: { type: String, default: "" },
        Image900: { type: String, default: "" },
        ImageOriginal: { type: String, default: "" }
    },
    Whether_Subscribed: { type: Boolean, default: false },
    USER_PIN_CODE: { type: String, default: "" },
    Subscription_Type: { type: Number, default: 1 }, //1. Pin  2.Purchase 3.Comapny Trimming 4. Free Pin
    Subscription_Expiry_Date: { type: Date, default: null },
    Subscription_Data: {
        _id: false,
        SubscriptionID: { type: String, default: "" },
        Subscription_Name: { type: String, default: "" },
        Version: { type: Number, default: 1 },
        Subscription_Amount: { type: Number, default: 0 },
        Delivery_Product_Used: {type:Number, default:0}, //0: Product Not Available 1: Product available 2:Product Used
        Subscription_Limits: {
            User_Subscription_Share: { type: Number, default: 0 },
            Company_Subscription_Share: { type: Number, default: 0 },
            Trimmer_Subscription_Share: { type: Number, default: 0 },
            Max_Receivers: { type: Number, default: 0 },
            DF_Ref: { type: Number, default: 0 },
            Max_Reward: { type: Number, default: 0 },
            Max_Wallet_Limit: { type: Number, default: 0 },
            Gift_Share: { type: Number, default: 0 },
            Level_One_Share: { type: Number, default: 0 },
            Level_Two_Share: { type: Number, default: 0 },
        },
        Subscription_Expiry_Date: { type: Date, default: null },
        //Time: { type: Date, default: null }
    },
    Subscription_Logs: [
        {
            // _id: false,
            // SubscriptionID: { type: String, default: "" },
            // Version: {type: Number, default: 1 },
            // Subscription_Amount: { type: Number, default: 0 },
            // Subscription_Limits: { 
            //     User_Subscription_Share: {type: Number, default: 0},
            //     Company_Subscription_Share: {type: Number, default: 0},
            //     Trimmer_Subscription_Share: {type: Number, default: 0},
            //     Max_Receivers: {type: Number, default: 0},
            //     Max_Reward: {type: Number, default: 0}, 
            // },
            // Subscription_Expiry_Date: { type: Date, default: null },
            //Time: { type: Date, default: null }
        }
    ],
    User_Amounts: {
        //Major Amount
        Available_Amount: { type: Number, default: 0 },
        Withdrawn_Amount: { type: Number, default: 0 },
        Total_Amount: { type: Number, default: 0 },
        //Minor Amounts
        Trimming_Amount: { type: Number, default: 0 },
        Royalty_Amount: { type: Number, default: 0 },
        Referral_Amount: { type: Number, default: 0 },
        Service_Fee_and_Taxes_Amount: { type: Number, default: 0 },
        Expired_Amount: { type: Number, default: 0 },

        //new Keys Added
        New_Pin: { type: Boolean, default: false },
        Level_One_Amount: { type: Number, default: 0 },
        Level_Two_Amount: { type: Number, default: 0 },
        Gift_Amount: { type: Number, default: 0 },
        Available_Withdrawn_Gift_Amount: { type: Number, default: 0 },
        Available_Withdrawn_Trimming_Amount: { type: Number, default: 0 },
        //
    },
    User_Account_Status: { type: Number, default: 1 },//1. Red 2.Yellow 3.Blue 4.Green 5.Purple 6.Black 7.Company Account
    User_Account_Status_Logs: [{
        _id: false,
        User_Account_Status: { type: Number, default: 1 },//1. Red 2.Yellow 3.Blue 4.Green 5.Purple 6.Black 7.Company Account
        Comment: { type: String, default: "" },
        Time: { type: Date, default: null }
    }],
    User_Account_Registered_Date: { type: Date, default: null },
    Whether_Shop: { type: Boolean, default: false },
    Whether_Shop_Subscription_Shared: { type: Boolean, default: false },
    Whether_Shop_Subscription_Shared_Amount: { type: Number, default: 0 },
    Shop_Information: {
        Shop_Name: { type: String, default: "" },
        Shop_Address: { type: String, default: "" },
        Shop_Expiry_Date: { type: Date, default: null },
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
        Point: { type: [Number], index: '2d' }
    },
    Whether_Shop_Details_Available: { type: Boolean, default: false },
    Point: { type: [Number], index: '2d' },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "Users" });
Users.index({ Point: '2dsphere' });
export default mongoose.model('Users', Users);