import mongoose from 'mongoose';
const News = mongoose.Schema({
    NewsID: { type: String, default: "" },
    Title: { type: String, default: "" },
    SNo:{ type: Number, default: 0 },
    Description: { type: String, default: "" },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
}, { collection: "News" });
export default mongoose.model('News', News);