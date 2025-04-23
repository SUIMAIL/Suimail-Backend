import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    address: string;
    suiNs: string;
}

const UserSchema: Schema = new Schema({
    address: { type: String, required: true, unique: true },
    suiNs: { type: String, unique: true },
});

export default mongoose.model<IUser>('User', UserSchema);
