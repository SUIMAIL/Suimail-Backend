import { Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const register: RequestHandler = async (req: Request, res: Response) => {
    const { address, email } = await req.body;

    try {
        const userAddress = await User.findOne({ address });
        const userEmail = await User.findOne({ email });

        if(!userAddress && !userEmail) {
            const user = new User({ address, email });
            await user.save();
            res.status(201).json({ message: 'User registered successfully' });
        }else{
            res.status(400).json({ error: 'User already exists' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server error' });
    }
};

const login: RequestHandler = async (req: Request, res: Response) => {
    const { address } = req.body;
    try {
        const user = await User.findOne({ address });
        if (!user) res.status(404).json({ error: 'User not found' });

        const token = jwt.sign({ address }, process.env.JWT_SECRET || 'jwtsecret', {
            expiresIn: '1d',
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export { register, login };
