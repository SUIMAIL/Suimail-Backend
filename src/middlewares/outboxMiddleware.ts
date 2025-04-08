import { Request, Response, NextFunction } from 'express';

const outboxMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userAddress = req.user?.address;
    const { from: fromAddress } = req.params;

    if (!req.params.from) {
        res.status(400).send('Sender is required');
        return;
    }
    // else if (userAddress !== fromAddress) {
    //     res.status(403).json({ error: 'Access denied: Address mismatch' });
    //     return;
    // }
    
    next();
};

export default outboxMiddleware;