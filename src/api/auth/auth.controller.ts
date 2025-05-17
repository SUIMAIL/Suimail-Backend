import { Request, Response, RequestHandler } from "express"
import { AuthService } from "./auth.service"

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  login: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { address } = req.params
    const token = await this.authService.login(address)
    res.status(200).json({ access_token: token })
  }
}
