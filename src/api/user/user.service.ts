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

  async getAddressBySuimailNs(suimailNs: string): Promise<string> {
    const user = await this.findBySuimailNs(suimailNs)
    if (!user) throw new NotFoundError("User not found")

    return user.address
  }

  async setUserSuimailNs(id: string, suimailNs: string): Promise<void> {
    const user = await this.findById(id)

    if (!user) throw new NotFoundError("User not found")

    if (user.suimailNs) throw new ConflictError("Suimail namespace already set")

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

  async getMailFeeBySuimailNs(suimailNs: string): Promise<number> {
    const user = await this.findBySuimailNs(suimailNs)

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

  async updateUserWhitelist(id: string, suimailNs: string): Promise<void> {
    const user = await this.findById(id)

    if (!user) throw new NotFoundError("User not found")

    if (suimailNs === user.suimailNs)
      throw new BadRequestError("Cannot whitelist self")

    if (!(await this.findBySuimailNs(suimailNs))) {
      throw new NotFoundError("Suimail namespace not found")
    }

    if (user.whitelist.includes(suimailNs)) {
      throw new ConflictError("Suimail namespace already in whitelist")
    }

    if (user.blacklist.includes(suimailNs)) {
      user.blacklist = user.blacklist.filter((ns) => ns !== suimailNs)
    }

    user.whitelist = [...user.whitelist, suimailNs]
    await user.save()
    return
  }

  async updateUserBlacklist(id: string, suimailNs: string): Promise<void> {
    const user = await this.findById(id)

    if (!user) throw new NotFoundError("User not found")

    if (suimailNs === user.suimailNs)
      throw new BadRequestError("Cannot blacklist self")

    if (!(await this.findBySuimailNs(suimailNs))) {
      throw new NotFoundError("Suimail namespace not found")
    }

    if (user.whitelist.includes(suimailNs)) {
      user.whitelist = user.whitelist.filter((ns) => ns !== suimailNs)
    }

    user.blacklist = [...user.blacklist, suimailNs]
    await user.save()
    return
  }

  async getUserWhitelist(id: string): Promise<string[]> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundError("User not found")
    return user.whitelist
  }

  async getUserBlacklist(id: string): Promise<string[]> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundError("User not found")
    return user.blacklist
  }

  async removeUserWhitelist(id: string, suimailNs: string): Promise<void> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundError("User not found")
    user.whitelist = user.whitelist.filter((ns) => ns !== suimailNs)
    await user.save()
    return
  }

  async removeUserBlacklist(id: string, suimailNs: string): Promise<void> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundError("User not found")
    user.blacklist = user.blacklist.filter((ns) => ns !== suimailNs)
    await user.save()
    return
  }

  async getAddressListFeatures(recipientSuimailNs: string, senderId: string) {
    const recipientUser = await this.findBySuimailNs(recipientSuimailNs)
    if (!recipientUser) throw new NotFoundError("User not found")

    const senderSuimailNs = await this.getUserSuimailNs(senderId)

    const recipientUserWhitelist = recipientUser.whitelist
    const recipientUserBlacklist = recipientUser.blacklist

    let senderIsWhitelisted = false
    let senderIsBlacklisted = false

    if (
      recipientUserWhitelist.some((suimailNs) => suimailNs === senderSuimailNs)
    ) {
      senderIsWhitelisted = true
    }

    if (
      recipientUserBlacklist.some((suimailNs) => suimailNs === senderSuimailNs)
    ) {
      senderIsBlacklisted = true
    }

    return { senderIsWhitelisted, senderIsBlacklisted }
  }

  async setUserImageUrl(id: string, imageUrl: string): Promise<void> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundError("User not found")
    user.imageUrl = imageUrl
    await user.save()
    return
  }

  async getUserImageUrl(id: string): Promise<string | null> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundError("User not found")
    return user.imageUrl ?? null
  }
}
