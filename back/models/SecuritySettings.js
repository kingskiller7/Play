import mongoose from 'mongoose';

const SecuritySettingsSchema = new mongoose.Schema({
    passwordMinLength: {
        type: Number,
        default: 8
    },
    requireSpecialChars: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

const SecuritySettings = mongoose.model('SecuritySettings', SecuritySettingsSchema);
export default SecuritySettings;