import { Request, Response } from 'express';
import { blockchain } from '../services/Blockchain';
import { userService } from '../services/UserService';
import { socketService } from '../services/SocketService';

export const mineBlock = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user = req.user;
        const dbUser = await userService.findById(user.id);

        if (!dbUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const newBlock = await blockchain.minePendingTransactions(dbUser.walletAddress);

        socketService.emit('block:mined', newBlock);

        res.json(newBlock);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getChain = async (req: Request, res: Response) => {
    const chain = await blockchain.getChain();
    res.json(chain);
};
