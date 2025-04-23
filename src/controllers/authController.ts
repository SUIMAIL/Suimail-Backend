import { Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const login: RequestHandler = async (req: Request, res: Response) => {
    const { address, suiNs } = req.body;
    let newbie = false;
    try {
        const user = await User.findOne({ address });

        if(!user){
            newbie = true;
            const newUser = new User({ address, suiNs });
            await newUser.save();
        }

        const token = jwt.sign({ address }, 'jwtsecret' , {
            expiresIn: '1d',
        });

        res.status(200).json({ token, message: 'User login successfull', newbie });
    } catch (error) {
        res.status(500).json({ error: 'Server error (login)' });
    }
};

const registerNS: RequestHandler = async (req: Request, res: Response) => {
    const { address, suiNs } = req.body;

    try {
        const user = await User.findOne({ address });

        if (user) {
            user.suiNs = suiNs;
            await user.save();
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

export { login, registerNS };
