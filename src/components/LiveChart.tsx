import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MarketData } from '../types';

interface Props {
  marketData: MarketData[];
}

interface ChartDataPoint {
  time: string;
  SOL?: number;
  JUP?: number;
  BONK?: number;
  RAY?: number;
  [key: string]: number | string | undefined;
}

export const LiveChart: React.FC<Props> = ({ marketData }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>('SOL');

  useEffect(() => {
    if (marketData.length > 0) {
      const timestamp = new Date().toLocaleTimeString();
      const newDataPoint: ChartDataPoint = {
        time: timestamp,
      };

      marketData.forEach(data => {
        newDataPoint[data.token] = data.price;
      });

      setChartData(prev => {
        const updated = [...prev, newDataPoint];
        // Keep last 20 data points
        return updated.slice(-20);
      });
    }
  }, [marketData]);

  const selectedTokenData = marketData.find(d => d.token === selectedToken);

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Live Price Action</h2>
          {selectedTokenData && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-400">
                ${selectedTokenData.price.toFixed(selectedToken === 'BONK' ? 8 : 4)}
              </span>
              <div className={`text-sm font-semibold px-2 py-0.5 rounded ${selectedTokenData.change24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {selectedTokenData.change24h >= 0 ? '+' : ''}{selectedTokenData.change24h.toFixed(2)}%
              </div>
            </div>
          )}
        </div>

        {/* 👇 UPDATED: Dynamic Button List with Scrolling for many coins */}
        <div className="flex gap-2 overflow-x-auto pb-2 max-w-[50%] custom-scrollbar">
          {marketData.map((data) => (
            <button
              key={data.token}
              onClick={() => setSelectedToken(data.token)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                selectedToken === data.token
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'bg-dark-bg text-gray-400 hover:text-white hover:bg-dark-hover'
              }`}
            >
              {data.token}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2337" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${value}`}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#131835', 
                border: '1px solid #1e2337',
                borderRadius: '8px',
                color: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ color: '#60a5fa' }}
              formatter={(value: number) => [`$${value}`, 'Price']}
            />
            <Line 
              type="monotone" 
              dataKey={selectedToken} 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};