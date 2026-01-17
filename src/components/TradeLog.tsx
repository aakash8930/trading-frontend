import React from 'react';
import { ShoppingCart, TrendingDown, Brain, Clock } from 'lucide-react';
import { TradeLogEntry } from '../types';

interface Props {
  tradeLogs: TradeLogEntry[];
}

export const TradeLog: React.FC<Props> = ({ tradeLogs }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">AI Trade Log</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Real-time</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        {tradeLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No trades yet. AI is analyzing the market...
          </div>
        ) : (
          tradeLogs.map((entry, index) => {
            const isBuy = entry.trade?.action === 'BUY';
            const trade = entry.trade;
            const signal = entry.signal;

            if (!trade) return null;

            return (
              <div
                key={trade.id || index}
                className="border border-dark-border rounded-lg p-4 hover:bg-dark-hover transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${isBuy ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                      {isBuy ? (
                        <ShoppingCart className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isBuy ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.action}
                        </span>
                        <span className="text-white font-semibold">{trade.token}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(trade.timestamp)} • {formatDate(trade.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-mono text-sm">
                      ${trade.total.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Fee: ${trade.fee.toFixed(3)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-dark-border/50">
                  <div>
                    <div className="text-xs text-gray-500">Amount</div>
                    <div className="text-sm text-white font-mono">
                      {trade.amount.toFixed(4)} {trade.token}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Price</div>
                    <div className="text-sm text-white font-mono">
                      ${trade.price.toFixed(trade.token === 'BONK' ? 8 : 4)}
                    </div>
                  </div>
                </div>

                {signal && (
                  <div className="mt-3 pt-3 border-t border-dark-border/50">
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-purple-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400">AI Confidence:</span>
                          <span className="text-xs font-semibold text-purple-400">
                            {signal.confidence.toFixed(0)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-300 italic">
                          "{signal.reason}"
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0e27;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e2337;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2a3150;
        }
      `}</style>
    </div>
  );
};
