import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    address: string;
}

const UserSchema: Schema = new Schema({
    address: { type: String, required: true, unique: true }
});

export default mongoose.model<IUser>('User', UserSchema);
