import jwt from "jsonwebtoken"
import { UserService } from "../user/user.service"
import { JWT_SECRET } from "../../config/envs"

export class AuthService {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async login(address: string): Promise<string> {
    const user = await this.userService.findByAddress(address)

    if (user) {
      return this.generateToken(address)
    }

    await this.userService.create(address)
    return this.generateToken(address)
  }

  private generateToken(address: string) {
    return jwt.sign({ address }, JWT_SECRET!, {
      expiresIn: "1d",
    })
  }
}
