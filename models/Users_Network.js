import mongoose from 'mongoose';
const Users_Network = mongoose.Schema({
    USERID: { type: String, default: "" },
    Network_Number: { type: Number, default: 0 },
    Parent_USERID: { type: String, default: "root" },
    Name: { type: String, default: "" },
    CountryCode: { type: String, default: "" },
    PhoneNumber: { type: String, default: "" },
    Network_USERID_Array: { type: [String], default: [] },
    Whether_Company_Account: { type: Boolean, default: false },
    Network_Information: [{
        _id: false,
        USERID: { type: String, default: "" },
        Name: { type: String, default: "" },
        CountryCode: { type: String, default: "" },
        PhoneNumber: { type: String, default: "" }
    }],
    No_of_Network: { type: Number, default: 0 },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "Users_Network" });
export default mongoose.model('Users_Network', Users_Network);