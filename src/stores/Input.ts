import { create } from 'zustand';

interface InputState {
	isInput: boolean;
	setIsInput: (value: boolean) => void;
}

const useInputStore = create<InputState>()((set) => ({
	isInput: false,
	setIsInput: (value) => set({ isInput: value }),
}));

export default useInputStore;
