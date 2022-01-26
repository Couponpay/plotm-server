import mongoose from 'mongoose';
const GuideLines = mongoose.Schema({
    GuideLineID: { type: String, default: "" },
    Title: { type: String, default: "" },
    Description: { type: String, default: "" },
    SNo:{ type: Number, default: 0 },
    All_Images_Data: [
        {
            _id: false,
            ImageID: { type: String, default: "" },
            Image50: { type: String, default: "" },
            Image100: { type: String, default: "" },
            Image250: { type: String, default: "" },
            Image550: { type: String, default: "" },
            Image900: { type: String, default: "" },
            ImageOriginal: { type: String, default: "" },
            contentType: { type: String, default: "" }
        }
    ],
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
}, { collection: "GuideLines" });
export default mongoose.model('GuideLines', GuideLines);