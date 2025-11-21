# KCoin Ecosystem - Frontend 

The frontend interface for the KCoin Blockchain Ecosystem. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### 1. Dashboard & Wallet
- **View Balance:** Real-time updates of your KCoin balance.
- **Wallet Address:** Copy your unique wallet address.
- **User Identity:** Displays your logged-in email.

### 2. Smart Transactions
- **Send KCoin:** Transfer coins to other users.
- **Email Resolution:** Send coins using a **Recipient Email Address** (e.g., `friend@kcoin.com`) instead of a long wallet address. The system automatically resolves it.
- **Real-time Updates:** Balances update instantly via WebSockets (Socket.IO) when transactions occur.

### 3. Mining Station
- **Proof-of-Work:** Mine new blocks to earn rewards (10 KCoin/block).
- **Visual Feedback:** See mining progress and success messages.

### 4. Blockchain Explorer
- **Live Chain View:** Visualize the entire blockchain.
- **Block Details:** Inspect hashes, nonces, and timestamps.
- **Transaction History:** View all transactions included in each block.
- **Live Updates:** The explorer refreshes automatically when new blocks are mined.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js (Credentials Provider)
- **Real-time:** Socket.IO Client
- **HTTP Client:** Axios

## 📦 Getting Started

### Prerequisites
- Node.js installed.
- **Backend Server** running on port `3001`.

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file (if not exists):
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=supersecretkey
   ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

- **Register:** Create a new account with an email and password.
- **Login:** Access your wallet using your credentials.
- **Session:** Managed via NextAuth.js with JWT strategies.
