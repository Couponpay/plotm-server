import mongoose from 'mongoose';
const Gift_Meter = mongoose.Schema({
    Gift_Meter_ID: { type: String, default: "" },
    S_NO: { type: Number, default: 0 },
    Gift_Meter_Image_Available: { type: Boolean, default: false },
    Gift_Meter_Image_Data: {
        ImageID: { type: String, default: "" },
        Image50: { type: String, default: "" },
        Image100: { type: String, default: "" },
        Image250: { type: String, default: "" },
        Image550: { type: String, default: "" },
        Image900: { type: String, default: "" },
        ImageOriginal: { type: String, default: "" }
    },
    Amount: { type: Number, default: 0 },
    Is_Root: { type: Boolean, default: false },
    Gift_Meter_Level_ID: { type: String, default: "" },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "Gift_Meter" });
export default mongoose.model('Gift_Meter', Gift_Meter);