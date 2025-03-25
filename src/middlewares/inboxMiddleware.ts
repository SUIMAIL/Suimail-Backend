import { Request, Response, NextFunction } from 'express';

const inboxMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(!req.params.to) {
        res.status(400).send('Recipient is required');
        return;
    }
    const userAddress = req.user?.address;
    const { to: toAddress } = req.params;
    console.log('User address:', userAddress);
    console.log('To address:', toAddress);
    
    if (userAddress !== toAddress) {
        res.status(403).json({ error: 'Access denied: Address mismatch' });
        return;
    }
    
    next(); 
};

export default inboxMiddleware;

