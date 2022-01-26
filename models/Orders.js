import mongoose from 'mongoose';
const Orders = mongoose.Schema({
    OrderID: { type: String, default: "" },
    USERID: { type: String, default: "" },
    Status: { type: Boolean, default: false },
    Order_Type: { type: Number, default: 0 },   //1 : Subscription Product 2: Not Subscription Product
    Product_Order_Used: { type: Number, default: 0 },  //1.subscription product used 2: General Product
    Subscription_Upgrade : { type: Number, default: 0 },  //1.Upgraded
    SubscriptionID: { type: String, default: "" },

    Order_Status: { type: Number, default: 0 }, //1- started, 2- Accepted, 3- completed 4- Cancelled 
    
    // 4- Tripped 5- Trip Initiated 6- Pickup Start 7- Reached at pickup 8- Order Picked 9- Drop Start 10- Reach at drop
    Order_Report: [{
        _id: false,
        Title: { type: String, default: "" },
        Description: { type: String, default: "" },
        Price: {type: Number, default: 0},
        Time: { type: Date, default: null }
    }],
    Amount_Paid: {
        Amount_Used_From_Wallet: { type: Number, default: 0 },
        Amount_Paid_Online: { type: Number, default: 0 },
        Total_Amount_Paid: { type: Number, default: 0 }
    },
    Payment_Type: { type: Number, default: 0 }, //1- Wallet, 2- RazorPay 3- both 4- Subscription 
    Order_Number: { type: String, default: "" }, // 12 digits random number
    Payment_Status: { type: Number, default: 0 }, // 1- initial, 2- fail, 3- Success,
    TransactionID: { type: String, default: "" },
    Product_Information: {
        _id: false,
        Product_ID: { type: String, default: "" },
        S_NO: { type: Number, default: 0 },
        Product_Name: { type: String, default: "" },
        Product_Price: { type: Number, default: 0 },
        Product_Image_Available: { type: Boolean, default: false },
        Product_Image_Data: {
            ImageID: { type: String, default: "" },
            Image50: { type: String, default: "" },
            Image100: { type: String, default: "" },
            Image250: { type: String, default: "" },
            Image550: { type: String, default: "" },
            Image900: { type: String, default: "" },
            ImageOriginal: { type: String, default: "" }
        },
        Description: { type: String, default: "" },
    },
    Order_Invoice: {
        Order_Total_Price: { type: Number, default: 0 },
        // Order_Delivery_Charge: { type: Number, default: 0 },
        // Order_Total_Final_Price: { type: Number, default: 0 },
    },
    Delivery_Address_Information: {

        Address_ID: { type: String, default: "" },
        USERID: { type: String, default: "" },
        SNo: { type: Number, default: 0 },
        Name: { type: String, default: "" },
        Type: { type: Number, default: 0 },
        CountryCode: { type: String, default: "" },
        PhoneNumber: { type: String, default: "" },
        Flat_Details: { type: String, default: "" },
        Address: { type: String, default: "" },
        Landmark: { type: String, default: "" },
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
        Postal_Code: { type: Number, default: 0 },
        State: { type: String, default: "" },
        City: { type: String, default: "" },
        Land_Mark: { type: String, default: "" },

    },
    // From_Information: {
    //     BranchID: { type: String, default: "" },
    //     Branch_Name: { type: String, default: "" },
    //     Branch_PhoneNumber: { type: String, default: "" },
    //     Latitude: Number,
    //     Longitude: Number,
    //     Point: {
    //         type: [Number],
    //         index: '2d'
    //     },
    //     Address: { type: String, default: "" },
    // },
    // Driver_Information: {},
    // Driver_Logs: [{
    //     _id: false,
    //     LogID: { type: String, default: "" },
    //     TripID: { type: String, default: "" },
    //     DriverID: { type: String, default: "" },
    //     Order_Status: { type: Number, default: 1 },
    //     Time: { type: Date, default: null },
    // }],
    // Event_Logs: [{
    //     _id: false,
    //     LogID: { type: String, default: "" },
    //     DriverID: { type: String, default: "" },
    //     Order_Status: { type: Number, default: 1 },
    //     Comments: { type: String, default: "" },
    //     Address: { type: String, default: "" },
    //     lat: { type: Number, default: 0 },
    //     lng: { type: Number, default: 0 },
    //     Time: { type: Date, default: null },
    // }],
    // OTP: { type: Number, default: 0 },
    WebHookData: {},
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "Orders" });
Orders.index({ 'Branch_Information.Point': '2dsphere' });
Orders.index({ 'Delivery_Address_Information.Point': '2dsphere' });
Orders.index({ Point: '2dsphere' });
export default mongoose.model('Orders', Orders);