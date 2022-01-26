import mongoose from 'mongoose';
const Admins = mongoose.Schema({
    AdminID: { type: String, default: "" },
    SessionID: { type: String, default: "" },
    Name: { type: String, default: "" },
    EmailID: { type: String, default: "" },
    PasswordHash: { type: String, default: "" },
    PasswordSalt: { type: String, default: "" },
    Whether_God: { type: Boolean, default: false },
    Permissions: {
        Admin_Section_Permision: { type: Boolean, default: false },
    },
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: 'Admins' });
export default mongoose.model('Admins', Admins);