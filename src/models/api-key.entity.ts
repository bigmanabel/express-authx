import mongoose from 'mongoose';

const ApiKeySchema = new mongoose.Schema({
    key: { type: String, required: true },
    uuid: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const ApiKey = mongoose.model('ApiKey', ApiKeySchema);
