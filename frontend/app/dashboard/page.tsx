'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getWallet, createTransaction, logout } from '@/services/api';
import { socket } from '@/services/socket';
import { Wallet, Send, LogOut, RefreshCw, User, Zap, Box } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();
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
      // router.push('/'); // Let middleware or session handle redirect
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    if (!wallet?.address) return;

    const handleTransaction = (transaction: any) => {
        console.log('New transaction:', transaction);
        // If we are the sender or recipient, refresh balance
        if (transaction.senderAddress === wallet.address || transaction.recipientAddress === wallet.address) {
            fetchWallet();
        }
    };

    const handleBlock = () => {
        console.log('Block mined');
        fetchWallet();
    };

    // Listen for real-time updates
    socket.on('transaction:new', handleTransaction);
    socket.on('block:mined', handleBlock);

    return () => {
        socket.off('transaction:new', handleTransaction);
        socket.off('block:mined', handleBlock);
    };
  }, [wallet?.address]); // Only re-bind if address changes (stable)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await createTransaction(recipient, Number(amount));
      setMessage('Transaction sent to pending pool!');
      setRecipient('');
      setAmount('');
      fetchWallet(); 
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

  if (!wallet) return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400">Loading your wallet...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              KCoin Dashboard
            </h1>
            <div className="flex items-center text-slate-400 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-sm">
              <User className="w-4 h-4 mr-2 text-blue-400" />
              <span className="text-sm font-medium">{session?.user?.email || 'Miner'}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
             <button
              onClick={() => router.push('/mining')}
              className="bg-slate-800/80 hover:bg-slate-700 text-white px-6 py-3 rounded-xl transition-all border border-slate-700 hover:border-yellow-500/50 flex items-center group"
            >
              <Zap className="w-4 h-4 mr-2 text-yellow-500 group-hover:text-yellow-400" /> 
              Mining Station
            </button>
            <button
              onClick={() => router.push('/explorer')}
              className="bg-slate-800/80 hover:bg-slate-700 text-white px-6 py-3 rounded-xl transition-all border border-slate-700 hover:border-indigo-500/50 flex items-center group"
            >
              <Box className="w-4 h-4 mr-2 text-indigo-500 group-hover:text-indigo-400" />
              Explorer
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-6 py-3 rounded-xl transition-all border border-red-500/20 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wallet Info Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 h-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center">
                  <Wallet className="w-8 h-8 mr-3 text-blue-500" /> 
                  Wallet Overview
                </h2>
                <button 
                  onClick={fetchWallet} 
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Refresh Balance"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50">
                  <p className="text-sm text-slate-400 mb-2 uppercase tracking-wider font-medium">Total Balance</p>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-white tracking-tight">{wallet.balance}</span>
                    <span className="ml-2 text-xl text-blue-400 font-medium">KCN</span>
                  </div>
                </div>
                
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50">
                  <p className="text-sm text-slate-400 mb-2 uppercase tracking-wider font-medium">Wallet Address</p>
                  <div className="font-mono text-xs md:text-sm text-slate-300 break-all bg-slate-900 p-3 rounded-lg border border-slate-800 select-all">
                    {wallet.address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Send Transaction Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 h-full">
              <h2 className="text-2xl font-bold mb-8 flex items-center">
                <Send className="w-8 h-8 mr-3 text-purple-500" /> 
                Transfer Assets
              </h2>
              
              <form onSubmit={handleSend} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Recipient</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder-slate-600"
                    placeholder="Wallet Address or Email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Amount (KCN)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder-slate-600"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>

                {message && (
                  <div className={`p-4 rounded-xl text-sm font-medium text-center animate-fade-in ${
                    message.includes('failed') 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                      : 'bg-green-500/10 text-green-400 border border-green-500/20'
                  }`}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
                >
                  {loading ? 'Processing Transaction...' : 'Send KCoin'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
