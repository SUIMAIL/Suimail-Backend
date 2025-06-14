import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatsService } from './stats.service';

export class StatsController {
  private statsService: StatsService;

  constructor() {
    this.statsService = new StatsService();
  }

  getSuiStats: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const suiStats = await this.statsService.getSuiStats();
      res.status(200).json({ stats: suiStats });
    } catch (error) {
      next(error);
    }
  };
}
