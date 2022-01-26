import mongoose from 'mongoose';
const RazorpayX_Webhooks = mongoose.Schema({
    WebookID: { type: String, default: "" },
    RequestData: {},
    PayoutData: {
        id: { type: String, default: "" },
        amount: { type: Number, default: 0 },
        currency: { type: String, default: "INR" },
        fees: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        status: { type: String, default: "" },
        utr: { type: String, default: "" },
        mode: { type: String, default: "" },
        reference_id: { type: String, default: "" },
        failure_reason: { type: String, default: "" }
    },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "RazorpayX_Webhooks" });
export default mongoose.model('RazorpayX_Webhooks', RazorpayX_Webhooks);