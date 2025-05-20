import { Request, RequestHandler, Response, NextFunction } from "express"
import { UserService } from "./user.service"

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  getUserSuimailNs: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.user!
      const suimailNs = await this.userService.getUserSuimailNs(id)
      res.status(200).json({ suimailNs })
    } catch (error) {
      next(error)
    }
  }

  updateUserSuimailNs: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.user!
      const { suimailNs } = req.body
      await this.userService.updateUserSuimailNs(id, suimailNs)
      res.status(200).json({ message: "Suimail namespace updated" })
    } catch (error) {
      next(error)
    }
  }

  getUserMailFee: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.user!
      const mailFee = await this.userService.getMailFee(id)
      res.status(200).json({ mailFee })
    } catch (error) {
      next(error)
    }
  }

  updateUserMailFee: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.user!
      const { mailFee } = req.body
      await this.userService.updateMailFee(id, mailFee)
      res.status(200).json({ message: "Mail fee updated" })
    } catch (error) {
      next(error)
    }
  }

  updateUserWhitelist: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.user!
      const { addresses } = req.body
      await this.userService.updateUserWhitelist(id, addresses)
      res.status(200).json({ message: "Whitelist updated" })
    } catch (error) {
      next(error)
    }
  }

  updateUserBlacklist: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.user!
      const { addresses } = req.body
      await this.userService.updateUserBlacklist(id, addresses)
      res.status(200).json({ message: "Blacklist updated" })
    } catch (error) {
      next(error)
    }
  }
}
