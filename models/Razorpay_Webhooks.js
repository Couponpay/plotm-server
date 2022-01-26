import mongoose from 'mongoose';
const Razorpay_Webhooks = mongoose.Schema({
    WebookID: { type: String, default: "" },
    PaymentID: { type: String, default: "" },
    TranxID: { type: String, default: "" },
    Captured: { type: String, default: "" },
    RequestData: {},
    PaymentData: {
        id: { type: String, default: "" },
        entity: { type: String, default: "" },
        amount: { type: Number, default: 0 },
        currency: { type: String, default: "INR" },
        status: { type: String, default: "" },
        order_id: { type: String, default: "" },
        invoice_id: { type: String, default: "" },
        card_id: { type: String, default: "" },
        international: { type: Boolean, default: false },
        method: { type: String, default: "" },
        amount_refunded: { type: Number, default: 0 },
        refund_status: { type: String, default: "" },
        captured: { type: Boolean, default: false },
        description: { type: String, default: "" },
        bank: { type: String, default: "" },
        wallet: { type: String, default: "" },
        vpa: { type: String, default: "" },
        email: { type: String, default: "" },
        contact: { type: String, default: "" },
        fees: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        error_code: { type: String, default: "" },
        error_description: { type: String, default: "" },
        created_at: { type: Date, default: null }
    },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "Razorpay_Webhooks" });
export default mongoose.model('Razorpay_Webhooks', Razorpay_Webhooks);