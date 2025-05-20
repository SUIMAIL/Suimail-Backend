import { Request, Response, RequestHandler, NextFunction } from "express"
import { AuthService } from "./auth.service"

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  login: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { address } = req.params
      const token = await this.authService.login(address)
      res.status(200).json({ access_token: token })
    } catch (error) {
      next(error)
    }
  }
}
