import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Portfolio, MarketData, TradeLogEntry } from '../types';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalEquity: 0,
    cashBalance: 0,
    totalPnL: 0,
    totalPnLPercentage: 0,
    positions: [],
  });
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [tradeLogs, setTradeLogs] = useState<TradeLogEntry[]>([]);
  const [botState, setBotState] = useState<{ isTrading: boolean; mode: 'PAPER' | 'LIVE' } | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      upgrade: true,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to trading server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from trading server');
      setIsConnected(false);
    });

    socketInstance.on('portfolio_update', (data: Portfolio) => {
      setPortfolio(data);
    });

    socketInstance.on('market_update', (data: MarketData[]) => {
      setMarketData(data);
    });

    socketInstance.on('trade_log', (data: TradeLogEntry | TradeLogEntry[]) => {
      if (Array.isArray(data)) {
        // Initial trade history
        setTradeLogs(data.map(entry => ({
          trade: entry.trade || entry,
          signal: entry.signal || { token: '', action: 'HOLD', confidence: 0, reason: '' },
          portfolio: entry.portfolio || portfolio,
        })));
      } else {
        // New trade
        setTradeLogs(prev => [data, ...prev].slice(0, 50));
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socketInstance.on('bot_state', (state: { isTrading: boolean; mode: 'PAPER' | 'LIVE' }) => {
      setBotState(state);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, []);

  return {
    socket,
    isConnected,
    portfolio,
    marketData,
    tradeLogs,
    botState,
    setBotState,
  };
};
