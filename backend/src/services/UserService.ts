import { PrismaClient, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import SHA256 from 'crypto-js/sha256';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class UserService {
    private secretKey = 'secret-key-should-be-in-env'; // simplified for this project

    async register(email: string, password: string): Promise<User> {
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordHash = SHA256(password).toString();
        const walletAddress = uuidv4(); // Simple wallet address generation

        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash,
                walletAddress,
            },
        });

        return newUser;
    }

    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const passwordHash = SHA256(password).toString();
        if (user.passwordHash !== passwordHash) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, this.secretKey, { expiresIn: '1h' });
        return { user, token };
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }
}

export const userService = new UserService();
