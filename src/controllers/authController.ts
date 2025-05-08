import { Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const login: RequestHandler = async (req: Request, res: Response) => {
    const { address } = req.params;
    let newbie = false;
    try {
        const user = await User.findOne({ address });

        if(!user){
            newbie = true;
            const newUser = new User({ address });
            await newUser.save();
        }

        const token = jwt.sign({ address }, 'jwtsecret' , {
            expiresIn: '1d',
        });

        res.status(200).json({ token, message: 'User login successfull', newbie });
    } catch (error) {
        console.log('Error during login:', error);
        res.status(500).json({ error: 'Server error (login)' });
    }
};


export { login};
