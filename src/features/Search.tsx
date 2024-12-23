import { AutoComplete } from '@/components/auto-complete';
import useChampionsStore from '@/stores/Champions';
import { useCallback, useState } from 'react';
import PlayerChampion from './PlayerChampion';
import { invoke } from '@tauri-apps/api/core';
import type { ChampionData } from '@/types/CurrentGame';
import { Label } from '@/components/ui/label';

const Search = () => {
	const [searchText, setSearchText] = useState('');
	const [selectedText, setSelectedText] = useState('');
	const [selectedChampion, setSelectedChampion] = useState<ChampionData>();

	const champions = useChampionsStore((state) => state.champions);
	const championLabels = champions.map((c) => ({ value: c.id, label: c.name }));

	const onSelectValue = useCallback(
		async (value: string) => {
			const championKeyStr = champions.find((c) => c.id === value)?.key;
			if (!championKeyStr) return;
			const championKey = Number.parseInt(championKeyStr);
			const championData = await invoke<ChampionData>('get_champion', { championKey });
			setSelectedChampion(championData);
		},
		[champions],
	);

	const handleSelectValue = async (value: string) => {
		setSelectedText(value);
		await onSelectValue(value);
	};

	const filterFunction = useCallback((item: { value: string; label: string }, inputText: string) => {
		return (
			item.value.toLowerCase().includes(inputText.toLowerCase()) ||
			item.label.toLowerCase().includes(inputText.toLowerCase())
		);
	}, []);

	return (
		<div className="w-full">
			<Label htmlFor="search-champion-input" className="text-lg">
				Champion search
			</Label>
			<AutoComplete
				selectedValue={selectedText}
				onSelectedValueChange={handleSelectValue}
				searchValue={searchText}
				onSearchValueChange={setSearchText}
				items={championLabels || []}
				isLoading={champions.length === 0}
				emptyMessage="No champion found."
				filterFunction={filterFunction}
				id="search-champion-input"
			/>
			{selectedChampion && <PlayerChampion champion={selectedChampion} />}
		</div>
	);
};

export default Search;

// TODO
// emit lang change event from rust and listen to it in this component
// so that we can lively update the lore language
