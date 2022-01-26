import mongoose from 'mongoose';
const User_Shop_Pins = mongoose.Schema({
    USERID: { type: String, default: "" },
    USER_PIN_CODE: { type: String, default: "" },
    Whether_Code_Used: { type: Boolean, default: false },
    PIN_APPLIED_DETAILS: {
        USERID: { type: String, default: "" },
        Name: { type: String, default: "" },
        CountryCode: { type: String, default: "" },
        PhoneNumber: { type: String, default: "" },
        Shop_Name: { type: String, default: "" },
        Shop_Address: { type: String, default: "" },
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
        Point: { type: [Number], index: '2d' }
    },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "User_Shop_Pins" });
User_Shop_Pins.index({ Point: '2dsphere' });
export default mongoose.model('User_Shop_Pins', User_Shop_Pins);