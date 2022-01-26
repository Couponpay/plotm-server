import mongoose from 'mongoose';
const Images = mongoose.Schema({
    ImageID: { type: String, default: "" },
    Image50: { type: String, default: "" },
    Image100: { type: String, default: "" },
    Image250: { type: String, default: "" },
    Image550: { type: String, default: "" },
    Image900: { type: String, default: "" },
    ImageOriginal: { type: String, default: "" },
    contentType: { type: String, default: "" },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
}, { collection: 'Images' });
export default mongoose.model('Images', Images);