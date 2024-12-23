import { AutoComplete } from '@/components/auto-complete';
import useChampionsStore from '@/stores/Champions';
import { useCallback, useEffect, useState } from 'react';
import PlayerChampion from './PlayerChampion';
import { invoke } from '@tauri-apps/api/core';
import type { ChampionData } from '@/types/CurrentGame';

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
		console.log('handleSelectValue', value);
		setSelectedText(value);
		await onSelectValue(value);
	};

	useEffect(() => {
		console.log(selectedChampion);
	}, [selectedChampion]);

	const filterFunction = useCallback((item: { value: string; label: string }, inputText: string) => {
		return (
			item.value.toLowerCase().includes(inputText.toLowerCase()) ||
			item.label.toLowerCase().includes(inputText.toLowerCase())
		);
	}, []);

	return (
		<div className="w-full">
			<AutoComplete
				selectedValue={selectedText}
				onSelectedValueChange={handleSelectValue}
				searchValue={searchText}
				onSearchValueChange={setSearchText}
				items={championLabels || []}
				isLoading={champions.length === 0}
				emptyMessage="No champion found."
				filterFunction={filterFunction}
			/>
			{selectedChampion && <PlayerChampion champion={selectedChampion} />}
		</div>
	);
};

export default Search;
