import jwt from "jsonwebtoken"
import { UserService } from "../user/user.service"
import { JWT_EXPIRES, JWT_SECRET } from "../../config/envs"
import { JWTPayload } from "../../types/global"

export class AuthService {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async login(address: string): Promise<string> {
    const user = await this.userService.findByAddress(address)

    if (user) {
      return await this.generateToken(user.id)
    }

    const newUser = await this.userService.create(address)
    return await this.generateToken(newUser.id)
  }

  private async generateToken(id: string) {
    const tokenVersion = await this.userService.incrementAuthTokenVersion(id)

    const payload: Pick<JWTPayload, "sub" | "version"> = {
      sub: id,
      version: tokenVersion,
    }

    return jwt.sign(payload, JWT_SECRET!, {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRES! as jwt.SignOptions["expiresIn"],
    })
  }
}
