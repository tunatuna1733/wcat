import type { languages } from '@/utils/langs';
import { create } from 'zustand';

// dark mode is managed in components/theme-provider
interface ConfigState {
	language: (typeof languages)[number];
	setLang: (lang: (typeof languages)[number]) => void;
}

const useConfigStore = create<ConfigState>()((set) => ({
	language: { lang: '日本語', code: 'ja_JP' },
	setLang: (lang) => set((state) => ({ ...state, language: lang })),
}));

export default useConfigStore;
