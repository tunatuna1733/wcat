import type { PlayerData } from '@/types/CurrentGame';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCallback, useEffect, useState } from 'react';

type Props = {
	player: PlayerData;
};

const PlayerChampion = ({ player }: Props) => {
	const champion = player.championData;
	const abilities = [
		{ key: 'P', data: champion.passive },
		{ key: 'Q', data: champion.spells[0] },
		{ key: 'W', data: champion.spells[1] },
		{ key: 'E', data: champion.spells[2] },
		{ key: 'R', data: champion.spells[3] },
	];

	const [tab, setTab] = useState<'P' | 'Q' | 'W' | 'E' | 'R'>('P');

	const keyPress = useCallback((e: KeyboardEvent) => {
		console.log(e.key);
		if (e.key === 'p') setTab('P');
		else if (e.key === 'q') setTab('Q');
		else if (e.key === 'w') setTab('W');
		else if (e.key === 'e') setTab('E');
		else if (e.key === 'r') setTab('R');
	}, []);

	useEffect(() => {
		document.addEventListener('keydown', keyPress, false);
		return () => {
			document.removeEventListener('keydown', keyPress, false);
		};
	}, [keyPress]);

	return (
		<div className="max-w-full max-h-full min-w-full min-h-full">
			<div className="flex items-center gap-2 p-4">
				<img src={champion.portraitImg} alt={player.championName} className="rounded-full w-[48px] h-[48px]" />
				<div>
					<h1 className="text-2xl font-bold">{player.championName}</h1>
				</div>
			</div>
			<Tabs
				value={tab}
				onValueChange={(val) => setTab(val as 'P' | 'Q' | 'W' | 'E' | 'R')}
				className="flex flex-col flex-1"
			>
				<TabsList className="flex gap-2 pb-4 max-w-full min-w-full justify-start h-auto bg-transparent">
					{abilities.map((ability) => (
						<TabsTrigger
							value={ability.key}
							key={ability.key}
							className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all p-0 data-[state=active]:border-yellow-400 ${ability.key === 'P' ? 'mr-4' : ''}`}
						>
							<div>
								<img
									src={ability.key === 'P' ? ability.data.iconImg : ability.data.iconImg}
									alt={ability.key === 'P' ? ability.data.name : ability.data.name}
									className="h-full w-full"
								/>
								<div className="absolute bottom-0 left-0 w-full bg-black/60 px-1 text-center text-sm text-white">
									{ability.key}
								</div>
							</div>
						</TabsTrigger>
					))}
				</TabsList>
				<div className="mt-4">
					{abilities.map((ability) => (
						<TabsContent value={ability.key} key={ability.key}>
							<div className="animate-fade-left">
								<h3 className="text-xl font-bold">{ability.data.name}</h3>
								<div className="flex">
									<video className="mt-4 w-2/5 rounded-lg" src={ability.data.videoUrl} controls loop muted autoPlay />
									<p className="mt-4 ml-4">{ability.data.description}</p>
								</div>
							</div>
						</TabsContent>
					))}
				</div>
			</Tabs>
		</div>
	);
};

export default PlayerChampion;
