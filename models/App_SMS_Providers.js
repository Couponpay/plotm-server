import mongoose from 'mongoose';
const App_SMS_Providers = mongoose.Schema({
    ProviderID: { type: String, default: "" },
    ProviderName: { type: String, default: "" },
    ProviderSMSBalances: { type: Number, default: 0 },
    Selected_Provider: { type: Boolean, default: false },
    Service_Type: { type: Number, default: 1 },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: 'App_SMS_Providers' });
export default mongoose.model('App_SMS_Providers', App_SMS_Providers);