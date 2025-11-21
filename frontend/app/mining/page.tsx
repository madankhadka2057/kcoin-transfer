'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mineBlock } from '@/services/api';
import { Pickaxe, ArrowLeft, CheckCircle } from 'lucide-react';

export default function Mining() {
  const [mining, setMining] = useState(false);
  const [lastBlock, setLastBlock] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleMine = async () => {
    setMining(true);
    setError('');
    setLastBlock(null);
    try {
      const block = await mineBlock();
      setLastBlock(block);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Mining failed');
    } finally {
      setMining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
        </button>

        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pickaxe className={`w-10 h-10 text-yellow-500 ${mining ? 'animate-bounce' : ''}`} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Mining Station</h1>
            <p className="text-gray-400">Solve the proof-of-work puzzle to earn KCoin rewards.</p>
          </div>

          <button
            onClick={handleMine}
            disabled={mining}
            className={`
              w-full py-4 rounded-xl text-xl font-bold transition-all transform
              ${mining 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-yellow-500/25'
              }
            `}
          >
            {mining ? 'Mining in progress...' : 'Start Mining'}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 text-red-400 rounded-xl">
              {error}
            </div>
          )}

          {lastBlock && (
            <div className="mt-8 p-6 bg-green-900/20 border border-green-500/30 rounded-xl text-left animate-fade-in">
              <div className="flex items-center mb-4 text-green-400">
                <CheckCircle className="w-6 h-6 mr-2" />
                <h3 className="text-lg font-bold">Block Mined Successfully!</h3>
              </div>
              <div className="space-y-2 text-sm font-mono text-gray-300">
                <p><span className="text-gray-500">Block Index:</span> {lastBlock.index}</p>
                <p><span className="text-gray-500">Hash:</span> <span className="break-all">{lastBlock.hash}</span></p>
                <p><span className="text-gray-500">Nonce:</span> {lastBlock.nonce}</p>
                <p><span className="text-gray-500">Reward:</span> 10 KCoin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
