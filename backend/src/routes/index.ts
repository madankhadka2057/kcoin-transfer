import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as walletController from '../controllers/walletController';
import * as transactionController from '../controllers/transactionController';
import * as miningController from '../controllers/miningController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Auth
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Wallet
router.get('/wallet', authenticateToken, walletController.getWallet);

// Transactions
router.post('/transactions', authenticateToken, transactionController.createTransaction);
router.get('/transactions/pending', authenticateToken, transactionController.getPendingTransactions);

// Mining & Chain
router.post('/mine', authenticateToken, miningController.mineBlock);
router.get('/chain', miningController.getChain); // Publicly accessible

export default router;
