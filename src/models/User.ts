import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    address: string;
    email: string;
}

const UserSchema: Schema = new Schema({
    address: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
});

export default mongoose.model<IUser>('User', UserSchema);
