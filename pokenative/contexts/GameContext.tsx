import React, { createContext, useContext, useMemo, useState } from 'react';
import type { GameId } from '../constants/pokedex';

type GameContextValue = {
  game: GameId;
  setGame: (g: GameId) => void;
};

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<GameId>('scarlet');
  const value = useMemo(() => ({ game, setGame }), [game]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
