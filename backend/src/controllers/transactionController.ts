import { Request, Response } from 'express';
import { blockchain } from '../services/Blockchain';
import { Transaction } from '../models/Transaction';
import { userService } from '../services/UserService';
import { v4 as uuidv4 } from 'uuid';

import { socketService } from '../services/SocketService';

export const createTransaction = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user = req.user;
        const { recipientAddress, amount } = req.body;

        const dbUser = await userService.findById(user.id);
        if (!dbUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        let finalRecipientAddress = recipientAddress;

        // Check if recipient is an email
        if (recipientAddress.includes('@')) {
            const recipientUser = await userService.findByEmail(recipientAddress);
            if (!recipientUser) {
                res.status(404).json({ error: 'Recipient email not found' });
                return;
            }
            finalRecipientAddress = recipientUser.walletAddress;
        }

        const transaction = new Transaction(
            Date.now().toString(), // Temporary ID, will be replaced by DB ID
            dbUser.walletAddress,
            finalRecipientAddress,
            Number(amount)
        );

        await blockchain.addTransaction(transaction);

        socketService.emit('transaction:new', transaction);

        res.status(201).json(transaction);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getPendingTransactions = async (req: Request, res: Response) => {
    const transactions = await blockchain.getPendingTransactions();
    res.json(transactions);
};
