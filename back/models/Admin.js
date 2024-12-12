import { Schema, model } from 'mongoose';

const AdminSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    permissions: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

AdminSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Admin = model("Admin", AdminSchema);
export default Admin;