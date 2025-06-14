import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getActiveUserSuimailNs: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.user!;
      const suimailNs = await this.userService.getUserSuimailNs(id);
      res.status(200).json({ suimailNs });
    } catch (error) {
      next(error);
    }
  };

  getAddressBySuimailNs: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { suimailns } = req.params;
      const address = await this.userService.getAddressBySuimailNs(suimailns);
      res.status(200).json({ address });
    } catch (error) {
      next(error);
    }
  };

  setUserSuimailNs: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user!;
      const { suimailNs } = req.body;
      await this.userService.setUserSuimailNs(id, suimailNs);
      res.status(200).json({ message: 'Suimail namespace set' });
    } catch (error) {
      next(error);
    }
  };

  getUserMailFee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user!;
      const mailFee = await this.userService.getMailFee(id);
      res.status(200).json({ mailFee });
    } catch (error) {
      next(error);
    }
  };

  getMailFeeBySuimailNs: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { suimailns } = req.params;
      const mailFee = await this.userService.getMailFeeBySuimailNs(suimailns);
      res.status(200).json({ mailFee });
    } catch (error) {
      next(error);
    }
  };

  updateUserMailFee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user!;
      const { mailFee } = req.body;
      await this.userService.updateMailFee(id, mailFee);
      res.status(200).json({ message: 'Mail fee updated' });
    } catch (error) {
      next(error);
    }
  };

  updateUserWhitelist: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user!;
      const { suimailNs } = req.body;
      await this.userService.updateUserWhitelist(id, suimailNs);
      res.status(200).json({ message: 'Whitelist updated' });
    } catch (error) {
      next(error);
    }
  };

  updateUserBlacklist: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user!;
      const { suimailNs } = req.body;
      await this.userService.updateUserBlacklist(id, suimailNs);
      res.status(200).json({ message: 'Blacklist updated' });
    } catch (error) {
      next(error);
    }
  };

  getUserWhitelist: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user!;
      const whitelist = await this.userService.getUserWhitelist(id);
      res.status(200).json({ whitelist });
    } catch (error) {
      next(error);
    }
  };

  getUserBlacklist: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user!;
      const blacklist = await this.userService.getUserBlacklist(id);
      res.status(200).json({ blacklist });
    } catch (error) {
      next(error);
    }
  };

  removeUserWhitelist: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user!;
      const { suimailNs } = req.body;
      await this.userService.removeUserWhitelist(id, suimailNs);
      res.status(200).json({ message: 'Whitelist removed' });
    } catch (error) {
      next(error);
    }
  };

  removeUserBlacklist: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user!;
      const { suimailNs } = req.body;
      await this.userService.removeUserBlacklist(id, suimailNs);
      res.status(200).json({ message: 'Blacklist removed' });
    } catch (error) {
      next(error);
    }
  };

  getListedStatus: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { suimailns } = req.params;

      const listedStatus = await this.userService.getAddressListFeatures(suimailns, req.user!.id);
      res.status(200).json({ listedStatus });
    } catch (error) {
      next(error);
    }
  };

  setUserImageUrl: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user!;
      const { imageUrl } = req.body;
      await this.userService.setUserImageUrl(id, imageUrl);
      res.status(200).json({ message: 'Image URL set' });
    } catch (error) {
      next(error);
    }
  };

  getUserImageUrl: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user!;
      const imageUrl = await this.userService.getUserImageUrl(id);
      res.status(200).json({ imageUrl });
    } catch (error) {
      next(error);
    }
  };
}
