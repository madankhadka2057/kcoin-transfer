import { PrismaClient, Block as PrismaBlock, Transaction as PrismaTransaction } from '@prisma/client';
import { Block } from '../models/Block';
import { Transaction } from '../models/Transaction';

const prisma = new PrismaClient();

export class Blockchain {
    public difficulty: number;
    public miningReward: number;

    constructor() {
        this.difficulty = 2;
        this.miningReward = 10;
        this.initializeChain();
    }

    async initializeChain() {
        const count = await prisma.block.count();
        if (count === 0) {
            await this.createGenesisBlock();
        }
    }

    async createGenesisBlock() {
        const genesisBlock = new Block(0, Date.now(), [], '0');
        await prisma.block.create({
            data: {
                index: genesisBlock.index,
                timestamp: genesisBlock.timestamp,
                previousHash: genesisBlock.previousHash,
                hash: genesisBlock.hash,
                nonce: genesisBlock.nonce,
            },
        });
    }

    async getLatestBlock(): Promise<PrismaBlock> {
        const block = await prisma.block.findFirst({
            orderBy: { index: 'desc' },
        });
        if (!block) {
            // Should not happen if initialized, but handle gracefully
            throw new Error('Blockchain not initialized');
        }
        return block;
    }

    async minePendingTransactions(miningRewardAddress: string): Promise<PrismaBlock> {
        const pendingTxns = await prisma.transaction.findMany({
            where: { blockId: null },
        });

        const rewardTx = {
            senderAddress: '00',
            recipientAddress: miningRewardAddress,
            amount: this.miningReward,
            timestamp: Date.now(),
        };

        // Create reward transaction in DB
        const rewardDbTx = await prisma.transaction.create({
            data: rewardTx,
        });

        const allTxns = [...pendingTxns, rewardDbTx];
        const latestBlock = await this.getLatestBlock();

        const newBlock = new Block(
            latestBlock.index + 1,
            Date.now(),
            allTxns.map(t => new Transaction(t.id, t.senderAddress, t.recipientAddress, t.amount, t.timestamp)),
            latestBlock.hash
        );

        newBlock.nonce = 0;
        while (newBlock.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
            newBlock.nonce++;
            newBlock.hash = newBlock.calculateHash();
        }

        // Save block and update transactions
        const savedBlock = await prisma.block.create({
            data: {
                index: newBlock.index,
                timestamp: newBlock.timestamp,
                previousHash: newBlock.previousHash,
                hash: newBlock.hash,
                nonce: newBlock.nonce,
            },
        });

        // Link transactions to the new block
        await prisma.transaction.updateMany({
            where: {
                id: { in: allTxns.map(t => t.id) },
            },
            data: {
                blockId: savedBlock.id,
            },
        });

        return savedBlock;
    }

    async addTransaction(transaction: Transaction): Promise<void> {
        if (!transaction.senderAddress || !transaction.recipientAddress) {
            throw new Error('Transaction must include sender and recipient');
        }

        if (transaction.amount <= 0) {
            throw new Error('Transaction amount must be higher than 0');
        }

        if (transaction.senderAddress !== '00') {
            const senderBalance = await this.getBalanceOfAddress(transaction.senderAddress);
            if (senderBalance < transaction.amount) {
                throw new Error('Not enough balance');
            }
        }

        await prisma.transaction.create({
            data: {
                senderAddress: transaction.senderAddress,
                recipientAddress: transaction.recipientAddress,
                amount: transaction.amount,
                timestamp: transaction.timestamp,
            },
        });
    }

    async getBalanceOfAddress(address: string): Promise<number> {
        // Get all transactions where address is sender or recipient
        const transactions = await prisma.transaction.findMany({
            where: {
                OR: [
                    { senderAddress: address },
                    { recipientAddress: address },
                ],
            },
        });

        let balance = 0;
        for (const trans of transactions) {
            if (trans.senderAddress === address) {
                balance -= trans.amount;
            }
            if (trans.recipientAddress === address) {
                balance += trans.amount;
            }
        }

        return balance;
    }

    async getChain(): Promise<any[]> {
        return prisma.block.findMany({
            orderBy: { index: 'asc' },
            include: { transactions: true },
        });
    }

    async getPendingTransactions(): Promise<PrismaTransaction[]> {
        return prisma.transaction.findMany({
            where: { blockId: null },
        });
    }

    async isChainValid(): Promise<boolean> {
        const chain = await this.getChain();

        for (let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const previousBlock = chain[i - 1];

            // Reconstruct block to calculate hash
            const blockObj = new Block(
                currentBlock.index,
                currentBlock.timestamp,
                currentBlock.transactions.map((t: any) => new Transaction(t.id, t.senderAddress, t.recipientAddress, t.amount, t.timestamp)),
                currentBlock.previousHash
            );
            blockObj.nonce = currentBlock.nonce;

            if (currentBlock.hash !== blockObj.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

export const blockchain = new Blockchain();
