import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const session = await getSession();
    // @ts-ignore
    const token = session?.apiToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
};

export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const logout = () => {
    // NextAuth handles logout, but we might want to clear local state if any
};

export const getWallet = async () => {
    const response = await api.get('/wallet');
    return response.data;
};

export const createTransaction = async (recipientAddress: string, amount: number) => {
    const response = await api.post('/transactions', { recipientAddress, amount });
    return response.data;
};

export const getPendingTransactions = async () => {
    const response = await api.get('/transactions/pending');
    return response.data;
};

export const mineBlock = async () => {
    const response = await api.post('/mine');
    return response.data;
};

export const getChain = async () => {
    const response = await api.get('/chain');
    return response.data;
};

export { api };
