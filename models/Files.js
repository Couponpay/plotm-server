import mongoose from 'mongoose';
const Files = mongoose.Schema({
    FileID: { type: String, default: "" },
    File_Path: { type: String, default: "" },
    contentType: { type: String, default: "" },
    contentSize: { type: String, default: "" },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: 'Files' });
export default mongoose.model('Files', Files);