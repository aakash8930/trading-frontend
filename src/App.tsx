import React from 'react';
import { Activity } from 'lucide-react';
import { useSocket } from './hooks/useSocket';
import Header from './components/Header';
import { PortfolioCard } from './components/PortfolioCard';
import { LiveChart } from './components/LiveChart';
import { ActivePositions } from './components/ActivePositions';
import { TradeLog } from './components/TradeLog';

function App() {
  const { isConnected, portfolio, marketData, tradeLogs } = useSocket();
  const [botState, setBotState] = React.useState<{ isTradingActive: boolean; tradingMode: 'PAPER' | 'LIVE' } | null>(null);

  React.useEffect(() => {
    // Fetch current bot state
    fetch('/api/status').then(r => r.json()).then(s => setBotState(s)).catch(() => null);
  }, []);

  const toggleStatus = async () => {
    const res = await fetch('/api/toggle-status', { method: 'POST' });
    if (res.ok) setBotState(await res.json());
  };

  const toggleMode = async () => {
    const res = await fetch('/api/toggle-mode', { method: 'POST' });
    if (res.ok) setBotState(await res.json());
    else {
      const err = await res.json().catch(() => ({ error: 'Failed' }));
      alert('Could not switch mode: ' + (err.error || JSON.stringify(err)));
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  AI Solana Paper Trading Bot
                </h1>
                <p className="text-sm text-gray-400">Real-time AI-powered trading simulation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Header />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Portfolio Cards */}
          <PortfolioCard portfolio={portfolio} />

          {/* Charts and Positions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LiveChart marketData={marketData} />
            </div>
            {/* Market Overview */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Market Overview</h2>
                <Activity className="w-5 h-5 text-blue-400" />
              </div>

              {/* 👇 UPDATED CONTAINER: Fixed height + Scroll + Padding */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {marketData.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading market data...
                  </div>
                ) : (
                  marketData.map((data) => (
                    <div key={data.token} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border hover:border-blue-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${data.change24h >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <div className="font-bold text-white">{data.token}</div>
                          <div className="text-xs text-gray-500">
                            ${data.price.toFixed(data.token === 'BONK' ? 8 : 4)}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Active Positions */}
          <ActivePositions positions={portfolio.positions} />

          {/* Trade Log */}
          <TradeLog tradeLogs={tradeLogs} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>⚠️ Paper Trading Only - No Real Money Involved</p>
            <p className="mt-1">This is a simulation using real market data for educational purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
