import { Request, RequestHandler, Response } from 'express';
import User from '../models/User';

const getMailFeeController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { address } = req.params; // Assuming you want to use the address from the request params
    const user = await User.findOne({ address });
    console.log(address)
    
    if (user) {
        res.status(200).json({ mailFee: user.mailFee });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
}

const mailFeeController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { address } = req.params; // Assuming you want to use the address from the request body
    const { fee } = req.body; // Assuming you want to use the address from the request body
    const feeValue = parseFloat(fee);

    const user = await User.findOne({ address });

    if (user && !isNaN(feeValue)) {
        try {
            user.mailFee = feeValue; // Assuming you want to set the mail fee for the user
            await user.save();
            res.status(200).json({ message: 'Mail Fee updated successfully', fee: feeValue });
        } catch (error) {
            res.status(500).json({ error: `Failed to update mail fee: ${error}` });
        }
    } else {
        res.status(404).json({ error: 'Error updating mail fee' });
    }

}

const getSuimailNsController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { address } = req.params; // Assuming you want to use the address from the request params
    const user = await User.findOne({ address });
    if (user) {
        res.status(200).json({ suimailNs: user.suimailNs });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
}


const suimailNsController: RequestHandler = async (req: Request, res: Response) => {
    const { address } = req.params;
    const { suimailNs } = req.body; // Assuming you want to use the address from the request body

    try {
        const user = await User.findOne({ address });

        if (user) {
            user.suimailNs = suimailNs;
            await user.save();
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

export {
    getMailFeeController,
    mailFeeController,
    getSuimailNsController,
    suimailNsController
}