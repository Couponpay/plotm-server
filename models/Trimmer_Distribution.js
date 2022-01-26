import mongoose from 'mongoose';
const Trimmer_Distribution = mongoose.Schema({
    Trimmer_DateID: { type: String, default: "" },
    Date: { type: Date, default: null }, //IST format Date
    Distributed_Amount: { type: Number, default: 0 },
    UnDistributed_Amount: { type: Number, default: 0 },
    Trimmer_Amount: { type: Number, default: 0 }
}, { collection: "Trimmer_Distribution" });
export default mongoose.model('Trimmer_Distribution', Trimmer_Distribution);