import { Request, RequestHandler, Response, NextFunction } from "express"
import { UserService } from "./user.service"
import { ConflictError } from "../../utils/AppError"

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  getActiveUserSuimailNs: RequestHandler = async (
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

  getAddressBySuimailNs: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { suimailns } = req.params
      const address = await this.userService.getAddressBySuimailNs(suimailns)
      res.status(200).json({ address })
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
      const currentSuimailNS = await this.userService.getUserSuimailNs(id)

      if (currentSuimailNS)
        throw new ConflictError("Suimail namespace already set")

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

  getMailFeeBySuimailNs: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { suimailns } = req.params
      const mailFee = await this.userService.getMailFeeBySuimailNs(suimailns)
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
