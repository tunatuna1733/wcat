import type { Champion } from '@/types/Champion';
import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

interface ChampionsState {
	champions: Champion[];
	fetch: () => Promise<void>;
}

type ChampionsResponse = {
	data: {
		[index in string]: Champion;
	};
};

const useChampionsStore = create<ChampionsState>()((set) => ({
	champions: [],
	fetch: async () => {
		const versions: string[] = await (await fetch('https://ddragon.leagueoflegends.com/api/versions.json')).json();
		const latestVersion = versions[0];
		const langCode = await invoke<string>('get_language');
		const championsRes: ChampionsResponse = await (
			await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/${langCode}/champion.json`)
		).json();
		set({ champions: Object.values(championsRes.data) });
	},
}));

useChampionsStore.getState().fetch();

export default useChampionsStore;
