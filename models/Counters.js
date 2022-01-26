import mongoose from 'mongoose';
const Counters = mongoose.Schema({
    _id: { type: String, default: "" },
    seq: { type: Number, default: 0 }
}, { collection: 'Counters' });
export default mongoose.model('Counters', Counters);