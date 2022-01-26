import mongoose from 'mongoose';
const States = mongoose.Schema({
    StateID: { type: String, default: "" },
    State_Name: { type: String, default: "" },
    SNo:{ type: Number, default: 0 },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
}, { collection: "States" });
export default mongoose.model('States', States);