import axios from 'axios';
import { COINGECKO_API_KEY } from '../../config/envs';
import { InternalServerError } from '../../utils/AppError';

export class StatsService {
  constructor() {}

  async getSuiStats() {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=sui',
        {
          headers: {
            Accept: 'application/json',
            'x-cg-demo-api-key': COINGECKO_API_KEY,
          },
          timeout: 30000, // 30 seconds
        },
      );

      return { price: response.data.sui.usd, timestamp: Date.now() };
    } catch (error) {
      throw new InternalServerError('Failed to get SUI stats', {
        error,
      });
    }
  }
}
