import { Request, Response } from 'express';
import { userService } from '../services/UserService';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await userService.register(email, password);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await userService.login(email, password);
        res.json({ user, token });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};
