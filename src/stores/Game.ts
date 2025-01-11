import type { CurrentGame } from '@/types/CurrentGame';
import { isEqual } from 'lodash';
import { create } from 'zustand';

interface GameState {
	currentGame: CurrentGame | null;
	setCurrentGame: (game: CurrentGame) => void;
	clearCurrentGame: () => void;
}

const useGameStore = create<GameState>()((set, get) => ({
	currentGame: null,
	setCurrentGame: (game) => {
		const prevState = get();
		if (isEqual(prevState.currentGame, game)) return;
		set({ currentGame: game });
	},
	clearCurrentGame: () => set({ currentGame: null }),
}));

export default useGameStore;
