import { Request, RequestHandler, Response, NextFunction } from "express"
import { UserService } from "./user.service"

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  getUserSuimailNs: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.user!
      const suimailNs = await this.userService.getUserSuimailNs(address)
      res.status(200).json({ suimailNs })
    } catch (error) {
      next(error)
    }
  }

  updateUserSuimailNs: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.user!
      const { suimailNs } = req.body
      const user = await this.userService.updateUserSuimailNs(address, suimailNs)
      res.status(200).json({ user })
    } catch (error) {
      next(error)
    }
  }

  getUserMailFee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.user!
      const mailFee = await this.userService.getMailFee(address)
      res.status(200).json({ mailFee })
    } catch (error) {
      next(error)
    }
  }

  updateUserMailFee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.user!
      const { mailFee } = req.body
      const updatedMailFee = await this.userService.updateMailFee(
        address,
        mailFee
      )
      res.status(200).json({ mailFee: updatedMailFee })
    } catch (error) {
      next(error)
    }
  }

  updateUserWhitelist: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.user!
      const { addresses } = req.body
      const user = await this.userService.updateUserWhitelist(address, addresses)
      res.status(200).json({ user })
    } catch (error) {
      next(error)
    }
  }

  updateUserBlacklist: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.user!
      const { addresses } = req.body
      const user = await this.userService.updateUserBlacklist(address, addresses)
      res.status(200).json({ user })
    } catch (error) {
      next(error)
    }
  }
}
