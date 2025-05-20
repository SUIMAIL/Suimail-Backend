import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  firstName?: string
  lastName?: string
  address: string
  suimailNs: string
  mailFee?: number
  whitelist: string[]
  blacklist: string[]
  authTokenVersion: number
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
      description: "First name of the user",
    },
    lastName: {
      type: String,
      required: false,
      description: "Last name of the user",
    },
    address: {
      type: String,
      required: true,
      unique: true,
      description: "Wallet address of the user",
    },
    suimailNs: {
      type: String,
      required: true,
      unique: true,
      description: "Suimail namespace of the user",
    },
    mailFee: {
      type: Number,
      required: false,
      default: 0,
      description: "Mail fee of the user in SUI",
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
