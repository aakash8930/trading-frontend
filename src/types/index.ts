export interface Trade {
  id: string;
  timestamp: number;
  token: string;
  action: 'BUY' | 'SELL';
  amount: number;
  price: number;
  fee: number;
  total: number;
}

export interface Position {
  token: string;
  amount: number;
  avgBuyPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
}

export interface Portfolio {
  totalEquity: number;
  cashBalance: number;
  totalPnL: number;
  totalPnLPercentage: number;
  positions: Position[];
}

export interface MarketData {
  token: string;
  price: number;
  change24h: number;
  timestamp: number;
}

export interface AISignal {
  token: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reason: string;
}

export interface TradeLogEntry {
  trade: Trade;
  signal: AISignal;
  portfolio: Portfolio;
}
