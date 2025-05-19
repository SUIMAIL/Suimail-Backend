import User, { IUser } from "../../models/user.model"
import { generateRandomSuiNs } from "../../utils/helpers"
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/AppError"

export class UserService {
  async create(address: string): Promise<IUser> {
    if (await this.findByAddress(address)) {
      throw new ConflictError("User already exists", { address })
    }

    const suimailNs = await generateRandomSuiNs()
    return await User.create({ address, suimailNs })
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id)
  }

  async findByAddress(address: string): Promise<IUser | null> {
    return await User.findOne({ address }, {})
  }

  async findBySuimailNs(suimailNs: string): Promise<IUser | null> {
    return await User.findOne({ suimailNs })
  }

  async getUserSuimailNs(address: string): Promise<string> {
    const user = await this.findByAddress(address)
    if (!user) throw new NotFoundError("User not found")

    if (!user.suimailNs) throw new NotFoundError("Suimail namespace not set")

    return user.suimailNs
  }

  async updateUserSuimailNs(
    address: string,
    suimailNs: string
  ): Promise<IUser> {
    const user = await this.findByAddress(address)

    if (!user) throw new NotFoundError("User not found")

    if (suimailNs.length > 10)
      throw new BadRequestError("Suimail namespace too long")

    if (await this.findBySuimailNs(suimailNs))
      throw new ConflictError("Suimail namespace already exists")

    user.suimailNs = suimailNs
    await user.save()
    return user
  }

  async getMailFee(address: string): Promise<number> {
    const user = await this.findByAddress(address)

    if (!user) throw new NotFoundError("User not found")

    if (user.mailFee === undefined) throw new NotFoundError("Mail fee not set")

    return user.mailFee as number
  }

  async updateMailFee(address: string, fee: number): Promise<number> {
    if (isNaN(fee)) throw new BadRequestError("Invalid fee value")
    if (fee < 0) throw new BadRequestError("Fee must be positive")

    const user = await this.findByAddress(address)

    if (!user) throw new NotFoundError("User not found")

    user.mailFee = fee
    await user.save()
    return fee
  }

  async updateUserWhitelist(
    address: string,
    whitelistAddresses: string[]
  ): Promise<IUser> {
    const user = await this.findByAddress(address)

    if (!user) throw new NotFoundError("User not found")

    if (whitelistAddresses.some((address) => address === user.address))
      throw new BadRequestError("Cannot whitelist self")

    const filteredWhitelist = whitelistAddresses.filter(
      (address) => !user.whitelist.includes(address)
    )

    if (filteredWhitelist.length > 0) {
      user.whitelist = [...user.whitelist, ...filteredWhitelist]
      await user.save()
    }

    return user
  }

  async updateUserBlacklist(
    address: string,
    blacklistAddresses: string[]
  ): Promise<IUser> {
    const user = await this.findByAddress(address)

    if (!user) throw new NotFoundError("User not found")

    if (blacklistAddresses.some((address) => address === user.address))
      throw new BadRequestError("Cannot blacklist self")

    const filteredBlacklist = blacklistAddresses.filter(
      (address) => !user.blacklist.includes(address)
    )

    if (filteredBlacklist.length > 0) {
      user.blacklist = [...user.blacklist, ...filteredBlacklist]
      await user.save()
    }

    return user
  }
}
