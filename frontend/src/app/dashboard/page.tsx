'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getWallet, createTransaction, logout } from '@/services/api';
import { Wallet, Send, LogOut, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [wallet, setWallet] = useState<any>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const fetchWallet = async () => {
    try {
      const data = await getWallet();
      setWallet(data);
    } catch (error) {
      router.push('/');
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await createTransaction(recipient, Number(amount));
      setMessage('Transaction sent to pending pool!');
      setRecipient('');
      setAmount('');
      fetchWallet(); // Refresh balance (though it won't update until mined)
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!wallet) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="flex space-x-4">
             <button
              onClick={() => router.push('/mining')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go to Mining
            </button>
            <button
              onClick={() => router.push('/explorer')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Explorer
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Wallet Info */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <Wallet className="w-6 h-6 mr-2 text-blue-400" /> Your Wallet
              </h2>
              <button onClick={fetchWallet} className="text-gray-400 hover:text-white">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-700/50 p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Balance</p>
                <p className="text-3xl font-bold text-green-400">{wallet.balance} KCoin</p>
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">Wallet Address</p>
                <p className="text-xs font-mono break-all text-gray-300">{wallet.walletAddress}</p>
              </div>
            </div>
          </div>

          {/* Send Transaction */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Send className="w-6 h-6 mr-2 text-purple-400" /> Send KCoin
            </h2>
            
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Recipient Address</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter wallet address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-purple-500"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              {message && (
                <div className={`text-sm text-center py-2 rounded-lg ${message.includes('failed') ? 'bg-red-900/20 text-red-400' : 'bg-green-900/20 text-green-400'}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Transaction'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
