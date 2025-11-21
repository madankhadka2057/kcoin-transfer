# KCoin Ecosystem

A simplified blockchain ecosystem built with **Node.js (Backend)** and **Next.js (Frontend)**.
This project demonstrates a Proof-of-Work blockchain, wallet management, real-time transactions, and a block explorer.

**Note for Reviewers:** Environment variables (`.env`) are included in this repository for ease of setup and testing.

## 🚀 Features

- **Blockchain Core:** Custom implementation of a blockchain with Proof-of-Work mining.
- **Smart Transactions:** Send coins via Wallet Address or **Email** (auto-resolution).
- **Real-time Updates:** Powered by **Socket.IO**. Balances and blocks update instantly.
- **Mining:** Visual mining interface to earn KCoin rewards.
- **Explorer:** Inspect blocks and transactions in real-time.
- **Authentication:** Secure login/register using NextAuth.js.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, TypeScript, Prisma (MongoDB), Socket.IO
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, NextAuth.js, Socket.IO Client

## 📦 Getting Started

### Prerequisites
- Node.js installed.
- MongoDB Database (URL is provided in `backend/.env`).

### 1. Backend Setup

Navigate to the backend folder and start the server:

```bash
cd backend
npm install
npm run dev
```
*Server runs on `http://localhost:3001`*

### 2. Frontend Setup

Open a new terminal, navigate to the frontend folder, and start the app:

```bash
cd frontend
npm install
npm run dev
```
*App runs on `http://localhost:3000`*

## 🧪 Testing the App

1. **Register:** Open `http://localhost:3000` and create an account.
2. **Mine:** Go to "Mining Station" and mine a block to get 10 KCoin.
3. **Transact:** Open an incognito window, create a second account, and send coins from the first account using the second account's **Email**.
4. **Verify:** Watch the balance update instantly on both screens!
