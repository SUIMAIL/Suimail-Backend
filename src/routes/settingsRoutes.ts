import express from 'express';
import { getMailFeeController, getSuimailNsController, mailFeeController, suimailNsController } from '../controllers/settingsController';
import authMiddleware from '../middlewares/authMiddleware';


const settingsRouter = express.Router();

settingsRouter.get('/mailFee/:address',
    getMailFeeController
)

settingsRouter.post('/mailFee/:address',
    authMiddleware,
    mailFeeController
)

settingsRouter.get('/suimailNs/:address',
    getSuimailNsController
)

settingsRouter.post('/suimailNs/update',
    authMiddleware,
    suimailNsController
)


export default settingsRouter;