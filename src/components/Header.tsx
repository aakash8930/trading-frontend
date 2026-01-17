import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

export const Header: React.FC = () => {
  const { isConnected, botState, setBotState } = useSocket();

  // DEBUG: Log whenever botState updates
  React.useEffect(() => {
    console.log('🔄 [HEADER] Bot State Updated:', botState);
  }, [botState]);

  const toggleStatus = async () => {
    if (!botState) {
      console.error('❌ [HEADER] Cannot toggle: Bot state is null');
      return;
    }
    
    console.log('🖱️ [CLICK] Toggle Status button pressed');
    const newState = !botState.isTrading;

    try {
      console.log(`🚀 [FETCH] POST /api/status with { active: ${newState} }`);
      
      const res = await fetch('/api/status', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ active: newState }) 
      });

      console.log('📥 [FETCH] Response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('✅ [FETCH] Success. New Data:', data);
        setBotState?.(data);
      } else {
        console.error('❌ [FETCH] Server returned error:', res.statusText);
      }
    } catch (error) {
      console.error('🔥 [FETCH] Network Error:', error);
    }
  };

  const toggleMode = async () => {
    if (!botState) return;
    console.log('🖱️ [CLICK] Toggle Mode button pressed');
    
    const newMode = botState.mode === 'PAPER' ? 'LIVE' : 'PAPER';

    try {
      const res = await fetch('/api/mode', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ mode: newMode }) 
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('✅ [MODE] Switched to:', data.mode);
        setBotState?.(data);
      }
    } catch (e) {
      console.error('🔥 [MODE] Error switching mode:', e);
    }
  };

  return (
    <header className="bg-dark-card border-b border-dark-border py-4 px-6 mb-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Solana <span className="text-blue-400">AI Trader</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400 font-medium">Disconnected</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleStatus} 
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                botState?.isTrading 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)]'
              }`}
            >
              {botState?.isTrading ? 'STOP SYSTEM' : 'START SYSTEM'}
            </button>

            <button 
              onClick={toggleMode} 
              disabled={botState?.isTrading}
              className={`px-3 py-2 rounded-lg font-mono text-sm border ${
                botState?.mode === 'LIVE'
                  ? 'bg-red-900/20 border-red-500 text-red-400'
                  : 'bg-blue-900/20 border-blue-500 text-blue-400'
              }`}
            >
              {botState?.mode === 'LIVE' ? '🔴 LIVE EXECUTION' : 'PAPER TRADING'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;