import mongoose from 'mongoose';
import { Role } from '../enums/role.enum';

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(Role), default: Role.Regular },
    apiKeys: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ApiKey' }],
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
