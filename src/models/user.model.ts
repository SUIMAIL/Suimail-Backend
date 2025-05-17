import mongoose, { Schema, Document } from "mongoose"
import { generateRandomSuiNs } from "../utils/helpers"

export interface IUser extends Document {
  address: string
  suimailNs: string
  mailFee?: number
}

const UserSchema: Schema = new Schema(
  {
    address: { type: String, required: true, unique: true },
    suimailNs: {
      type: String,
      required: true,
      unique: true,
    },
    mailFee: { type: Number, required: false, default: 0 },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IUser>("User", UserSchema)
