import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './schemas/auth-response.dto';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { address } = req.params;
      const token = await this.authService.login(address);
      res.status(200).json({ access_token: token });
    } catch (error) {
      next(error);
    }
  };

  getMe: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user!;
      const user = await this.authService.getMe(id);

      res.status(200).json(AuthResponseDto.fromEntity(user));
    } catch (error) {
      next(error);
    }
  };
}
