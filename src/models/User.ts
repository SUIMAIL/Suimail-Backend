import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    address: string;
    suimailNs: string;
    mailFee?: number;
}

const generateRandomSuiNs = (): string => {
    const randomString = Math.random().toString(36).substring(2, 7); // Generate a random 5-letter string
    return `${randomString}@suimail`;
};


const UserSchema: Schema = new Schema({
    address: { type: String, required: true, unique: true },
    suimailNs: { type: String, required: true, unique: true, default: generateRandomSuiNs },
    mailFee: { type: Number, required: false, default: 0 },
});


export default mongoose.model<IUser>('User', UserSchema);
