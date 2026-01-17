import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Position } from '../types';

interface Props {
  positions: Position[];
}

export const ActivePositions: React.FC<Props> = ({ positions }) => {
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Active Positions</h2>
      
      {positions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No active positions. Waiting for AI to open trades...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Token</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Amount</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Avg Buy</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Current</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">P&L</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">P&L %</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => {
                const isProfitable = position.pnl >= 0;
                return (
                  <tr 
                    key={position.token} 
                    className="border-b border-dark-border/50 hover:bg-dark-hover transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-blue-400 font-bold text-sm">{position.token[0]}</span>
                        </div>
                        <span className="font-semibold text-white">{position.token}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-white font-mono">
                      {position.amount.toFixed(4)}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-300 font-mono">
                      ${position.avgBuyPrice.toFixed(position.token === 'BONK' ? 8 : 4)}
                    </td>
                    <td className="py-4 px-4 text-right text-white font-mono">
                      ${position.currentPrice.toFixed(position.token === 'BONK' ? 8 : 4)}
                    </td>
                    <td className={`py-4 px-4 text-right font-semibold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {isProfitable ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {isProfitable ? '+' : ''}${position.pnl.toFixed(2)}
                      </div>
                    </td>
                    <td className={`py-4 px-4 text-right font-semibold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                      {isProfitable ? '+' : ''}{position.pnlPercentage.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
