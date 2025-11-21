import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
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
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
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

export default api;
