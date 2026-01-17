import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { Portfolio } from '../types';

interface Props {
  portfolio: Portfolio;
}

export const PortfolioCard: React.FC<Props> = ({ portfolio }) => {
  const isProfitable = portfolio.totalPnL >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Equity */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-blue-500/50 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm font-medium">Total Equity</span>
          <DollarSign className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-2xl font-bold text-white">
          ${portfolio.totalEquity.toFixed(2)}
        </div>
      </div>

      {/* Cash Balance */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-green-500/50 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm font-medium">Cash Balance</span>
          <Wallet className="w-5 h-5 text-green-400" />
        </div>
        <div className="text-2xl font-bold text-white">
          ${portfolio.cashBalance.toFixed(2)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Available SOL
        </div>
      </div>

      {/* Total P&L */}
      <div className={`bg-dark-card border border-dark-border rounded-lg p-6 hover:border-${isProfitable ? 'green' : 'red'}-500/50 transition-colors`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm font-medium">Total P&L</span>
          {isProfitable ? (
            <TrendingUp className="w-5 h-5 text-green-400" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-400" />
          )}
        </div>
        <div className={`text-2xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
          {isProfitable ? '+' : ''}${portfolio.totalPnL.toFixed(2)}
        </div>
      </div>

      {/* P&L Percentage */}
      <div className={`bg-dark-card border border-dark-border rounded-lg p-6 hover:border-${isProfitable ? 'green' : 'red'}-500/50 transition-colors`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm font-medium">Return %</span>
          {isProfitable ? (
            <TrendingUp className="w-5 h-5 text-green-400" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-400" />
          )}
        </div>
        <div className={`text-2xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
          {isProfitable ? '+' : ''}{portfolio.totalPnLPercentage.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};
