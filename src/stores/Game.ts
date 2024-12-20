import { create } from 'zustand';
import type { CurrentGame } from '@/types/CurrentGame';

type GameState = {
	currentGame: CurrentGame | null;
	setCurrentGame: (game: CurrentGame) => void;
	clearCurrentGame: () => void;
};

const useGameStore = create<GameState>()((set) => ({
	currentGame: null,
	setCurrentGame: (game) => set({ currentGame: game }),
	clearCurrentGame: () => set({ currentGame: null }),
}));

export default useGameStore;
