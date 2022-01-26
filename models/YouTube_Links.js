import mongoose from 'mongoose';
const YouTube_Links = mongoose.Schema({
    YouTubeID: { type: String, default: "" },
    YouTube_Link_Name: { type: String, default: "" },
    YouTube_Link: { type: String, default: "" },
    SNo: { type: Number, default: 0 },
    AreaCode_Array: [{ type: Number, default: 0 }],
    ViewCount: { type: Number, default: 0 },
    ViewedData: [{
        _id: false,
        USERID: { type: String, default: "" },
        Name: { type: String, default: "" },
        PhoneNumber: { type: Number, default: null },
        created_at: { type: Date, default: null }
    }],
    Status: { type: Boolean, default: true },
    Description: { type: String, default: "" },
    USERID: {type: String, default: ""},
    User_Type: { type: Number, default: 1 }, //1-Admin 2-User
    Advertisement_Type: { type: Number, default: 0 },  //1: Youtube link 2:Image
    Image_Available: { type: Boolean, default: false },
    Image_Data: {
        ImageID: { type: String, default: "" },
        Image50: { type: String, default: "" },
        Image100: { type: String, default: "" },
        Image250: { type: String, default: "" },
        Image550: { type: String, default: "" },
        Image900: { type: String, default: "" },
        ImageOriginal: { type: String, default: "" }
    },
    Ad_Amount: { type: Number, default: 0 },
    No_of_Views: { type: Number, default: 0 },
    Available_Views: { type: Number, default: 0 },
    Admin_Approve: { type: Number, default: 1 }, //1:Pending 2:Approved 3:Rejected
    Payment_Status: { type: Number, default: 0 }, // 1- initial, 2- fail, 3- Success,
    TransactionID: { type: String, default:"" },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "YouTube_Links" });
export default mongoose.model('YouTube_Links', YouTube_Links);