import { Request, Response } from 'express';
import { blockchain } from '../services/Blockchain';
import { userService } from '../services/UserService';

export const getWallet = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const dbUser = await userService.findById(user.id);
        if (!dbUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const balance = await blockchain.getBalanceOfAddress(dbUser.walletAddress);

        res.json({
            address: dbUser.walletAddress,
            balance: balance
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
