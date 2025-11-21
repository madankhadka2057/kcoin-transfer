'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getChain } from '@/services/api';
import { ArrowLeft, Box, Clock, Hash } from 'lucide-react';

export default function Explorer() {
  const [chain, setChain] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChain = async () => {
      try {
        const data = await getChain();
        setChain(data);
      } catch (error) {
        console.error('Failed to fetch chain', error);
      }
    };
    fetchChain();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Blockchain Explorer
          </h1>
        </div>

        <div className="space-y-6">
          {chain.map((block) => (
            <div key={block.hash} className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-indigo-500/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-700">
                <div className="flex items-center mb-2 md:mb-0">
                  <Box className="w-6 h-6 text-indigo-400 mr-2" />
                  <span className="text-xl font-bold">Block #{block.index}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(block.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider">Hash</span>
                    <span className="font-mono text-gray-300 break-all">{block.hash}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider">Previous Hash</span>
                    <span className="font-mono text-gray-400 break-all">{block.previousHash}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase tracking-wider">Nonce</span>
                    <span className="font-mono text-gray-400">{block.nonce}</span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 block text-xs uppercase tracking-wider mb-2">Transactions ({block.transactions.length})</span>
                  <div className="bg-gray-900/50 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                    {block.transactions.length === 0 ? (
                      <p className="text-gray-500 italic text-sm">No transactions</p>
                    ) : (
                      block.transactions.map((tx: any) => (
                        <div key={tx.id} className="text-xs border-b border-gray-800 last:border-0 pb-2 last:pb-0">
                          <div className="flex justify-between text-gray-300">
                            <span>{tx.amount} KCoin</span>
                            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <div className="flex justify-between text-gray-500 mt-1">
                            <span className="truncate w-1/3" title={tx.senderAddress}>From: {tx.senderAddress === '00' ? 'System (Reward)' : tx.senderAddress}</span>
                            <span className="truncate w-1/3 text-right" title={tx.recipientAddress}>To: {tx.recipientAddress}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
