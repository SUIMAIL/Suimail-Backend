import { Request, RequestHandler, Response } from "express"
import { UserService } from "./user.service"

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  getUserSuimailNs: RequestHandler = async (req: Request, res: Response) => {
    const { address } = req.user!
    const suimailNs = await this.userService.getUserSuimailNs(address)
    res.status(200).json({ suimailNs })
  }

  updateUserSuimailNs: RequestHandler = async (req: Request, res: Response) => {
    const { address } = req.user!
    const { suimailNs } = req.body
    const user = await this.userService.updateUserSuimailNs(address, suimailNs)
    res.status(200).json({ user })
  }

  getUserMailFee: RequestHandler = async (req: Request, res: Response) => {
    const { address } = req.user!
    const mailFee = await this.userService.getMailFee(address)
    res.status(200).json({ mailFee })
  }

  updateUserMailFee: RequestHandler = async (req: Request, res: Response) => {
    const { address } = req.user!
    const { mailFee } = req.body
    const updatedMailFee = await this.userService.updateMailFee(
      address,
      mailFee
    )
    res.status(200).json({ mailFee: updatedMailFee })
  }
}
