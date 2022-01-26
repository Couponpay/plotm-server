import mongoose from 'mongoose';
const User_Address = mongoose.Schema({
    Address_ID : {type: String, default: ""},
    USERID: {type: String, default: ""},
    SNo: {type: Number, default: 0},
    Name: { type: String, default: "" },
    Type: {type: Number, default: 0}, //0 default Address 1: Home Address 2:Work Address 3: Others
    CountryCode: { type: String, default: "" },
    PhoneNumber: { type: String, default: "" },
    Flat_Details: { type: String, default: "" },
    Address: { type: String, default: "" },
    // Landmark: { type: String, default: "" },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    Postal_Code: { type: Number, default: 0 },
    State: { type: String, default: "" },
    City: { type: String, default: "" },
    Land_Mark: { type: String, default: "" },

    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "User_Address" });
export default mongoose.model('User_Address', User_Address);