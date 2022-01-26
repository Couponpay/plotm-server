import mongoose from 'mongoose';
const App_Image_Resources = mongoose.Schema({
    ResourceID: { type: String, default: "" },
    ResourceType: { type: Number, default: 1 },//1.Small Banner 2. Small Icon 3. Big Banner
    SNo:{ type: Number, default: 0 },
    ImageData: {
        ImageID: { type: String, default: "" },
        Image50: { type: String, default: "" },
        Image100: { type: String, default: "" },
        Image250: { type: String, default: "" },
        Image550: { type: String, default: "" },
        Image900: { type: String, default: "" },
        ImageOriginal: { type: String, default: "" },
        contentType: { type: String, default: "" }
    },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
}, { collection: 'App_Image_Resources' });
export default mongoose.model('App_Image_Resources', App_Image_Resources);