import mongoose from 'mongoose';
const Trimmer_Distribution_Logs = mongoose.Schema({
    LogID: { type: String, default: "" },
    Trimmer_DateID: { type: String, default: "" },
    Type: { type: Number, default: 1 },
    Amount: { type: Number, default: 0 },
    Data: {},
    Time: { type: Date, default: null }
}, { collection: "Trimmer_Distribution_Logs" });
export default mongoose.model('Trimmer_Distribution_Logs', Trimmer_Distribution_Logs);