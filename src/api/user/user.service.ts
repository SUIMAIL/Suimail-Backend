import User, { IUser } from "../../models/user.model"
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

    return await User.create({ address })
  }

  async findByAddress(address: string): Promise<IUser | null> {
    return await User.findOne({ address })
  }

  async incrementAuthTokenVersion(id: string): Promise<number> {
    const user = await User.findByIdAndUpdate(
      id,
      {
        $inc: { authTokenVersion: 0.5 },
      },
      { new: true }
    )
    if (!user) throw new NotFoundError("User not found")
    return user.authTokenVersion
  }

  async getUserWalletAddressById(id: string): Promise<string> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundError("User not found")
    return user.address
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id)
  }

  async findBySuimailNs(suimailNs: string): Promise<IUser | null> {
    return await User.findOne({ suimailNs })
  }

  async getUserSuimailNs(id: string): Promise<string | null> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundError("User not found")

    if (!user.suimailNs) return null

    return user.suimailNs
  }

  async getUserSuimailNsByAddress(address: string): Promise<string> {
    const user = await this.findByAddress(address)
    if (!user) throw new NotFoundError("User not found")

    if (!user.suimailNs) throw new NotFoundError("Suimail namespace not set")

    return user.suimailNs
  }
  async updateUserSuimailNs(id: string, suimailNs: string): Promise<void> {
    const user = await this.findById(id)

    if (!user) throw new NotFoundError("User not found")

    if (await this.findBySuimailNs(suimailNs))
      throw new ConflictError("Suimail namespace already exists")

    user.suimailNs = suimailNs
    await user.save()
    return
  }

  async getMailFee(id: string): Promise<number> {
    const user = await this.findById(id)

    if (!user) throw new NotFoundError("User not found")

    if (user.mailFee === undefined) throw new NotFoundError("Mail fee not set")

    return user.mailFee
  }

  async getMailFeeByAddress(address: string): Promise<number> {
    const user = await this.findByAddress(address)

    if (!user) throw new NotFoundError("User not found")

    if (user.mailFee === undefined) throw new NotFoundError("Mail fee not set")
    return user.mailFee
  }

  async updateMailFee(id: string, fee: number): Promise<void> {
    if (isNaN(fee)) throw new BadRequestError("Invalid fee value")
    if (fee < 0) throw new BadRequestError("Fee must be positive")

    const user = await this.findById(id)

    if (!user) throw new NotFoundError("User not found")

    user.mailFee = fee
    await user.save()
  }

  async updateUserWhitelist(
    id: string,
    whitelistAddresses: string[]
  ): Promise<void> {
    const user = await this.findById(id)

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
    return
  }

  async updateUserBlacklist(
    id: string,
    blacklistAddresses: string[]
  ): Promise<void> {
    const user = await this.findById(id)

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
    return
  }
}
