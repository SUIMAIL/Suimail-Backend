import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  address: string
  suimailNs: string
  mailFee?: number
  imageUrl?: string
  whitelist: string[]
  blacklist: string[]
  authTokenVersion: number
}

const UserSchema: Schema = new Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      description: "Wallet address of the user",
    },
    suimailNs: {
      type: String,
      required: false,
      description: "Suimail namespace of the user",
    },
    mailFee: {
      type: Number,
      required: true,
      default: 0,
      description: "Mail fee of the user in SUI",
    },
    imageUrl: {
      type: String,
      required: false,
      description: "Image URL of the user",
    },
    whitelist: {
      type: [String],
      default: [],
      description:
        "List of addresses that are whitelisted to send mail to this user",
    },
    blacklist: {
      type: [String],
      default: [],
      description:
        "List of addresses that are blacklisted from sending mail to this user",
    },
    authTokenVersion: {
      type: Number,
      default: 0,
      description: "Version of the auth token",
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IUser>("User", UserSchema)
