import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activityType: {
        type: String,
        required: true,
        enum: [
            "REGISTER", "LOGIN", "LOGOUT", "GET_PROFILE", "UPDATE_PROFILE",
            "CHANGE_PASSWORD", "REQUEST_PASSWORD_RESET", "UPDATE_USER", "DELETE_USER", "UPDATE_SECURITY_SETTINGS",
            "GET_USERS", "GET_SECURITY_SETTINGS", "GRANT_PERMISSION", "REVOKE_PERMISSION", "GET_PERMISSION"
        ],
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);
export default ActivityLog;