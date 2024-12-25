import type { ChampionData } from '@/types/CurrentGame';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCallback, useEffect, useState } from 'react';
import { getFallbackVideoUrl } from '@/utils/league';
import useInputStore from '@/stores/Input';

type Props = {
	champion: ChampionData;
};

const PlayerChampion = ({ champion }: Props) => {
	const abilities = [
		{ key: 'Q', data: champion.spells[0] },
		{ key: 'W', data: champion.spells[1] },
		{ key: 'E', data: champion.spells[2] },
		{ key: 'R', data: champion.spells[3] },
	];

	const [tab, setTab] = useState<'P' | 'Q' | 'W' | 'E' | 'R'>('P');
	const isInput = useInputStore((state) => state.isInput);

	const keyPress = useCallback(
		(e: KeyboardEvent) => {
			if (!isInput) {
				if (e.key === 'p') setTab('P');
				else if (e.key === 'q') setTab('Q');
				else if (e.key === 'w') setTab('W');
				else if (e.key === 'e') setTab('E');
				else if (e.key === 'r') setTab('R');
			}
		},
		[isInput],
	);

	useEffect(() => {
		document.addEventListener('keydown', keyPress, false);
		return () => {
			document.removeEventListener('keydown', keyPress, false);
		};
	}, [keyPress]);

	return (
		<div className="max-w-full max-h-full min-w-full min-h-full">
			<Tabs
				value={tab}
				onValueChange={(val) => setTab(val as 'P' | 'Q' | 'W' | 'E' | 'R')}
				className="flex flex-col flex-1"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 p-1">
						<img src={champion.portraitImg} alt={champion.name} className="rounded-full w-[48px] h-[48px]" />
						<div>
							<h1 className="text-2xl font-bold">{champion.name}</h1>
						</div>
					</div>
					<TabsList className="flex gap-2 pb-2 justify-start h-auto bg-transparent">
						<TabsTrigger
							value="P"
							className={
								'relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all p-0 data-[state=active]:border-yellow-400 mr-4'
							}
						>
							<div>
								<img src={champion.passive.iconImg} alt={champion.passive.name} className="h-full w-full" />
								<div className="absolute bottom-0 left-0 w-full bg-black/60 px-1 text-center text-sm text-white">P</div>
							</div>
						</TabsTrigger>
						{abilities.map((ability) => (
							<TabsTrigger
								value={ability.key}
								key={ability.key}
								className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all p-0 data-[state=active]:border-yellow-400 ${ability.key === 'P' ? 'mr-4' : ''}`}
							>
								<div>
									<img src={ability.data.iconImg} alt={ability.data.name} className="h-full w-full" />
									<div className="absolute bottom-0 left-0 w-full bg-black/60 px-1 text-center text-sm text-white">
										{ability.key}
									</div>
								</div>
							</TabsTrigger>
						))}
					</TabsList>
				</div>
				<div>
					<TabsContent value="P">
						<div className="animate-fade-left">
							<h3 className="text-2xl font-bold">{champion.passive.name}</h3>
							<div className="flex">
								<video
									className="mt-4 w-2/5 rounded-lg"
									src={
										champion.passive.videoUrl === 'https://d28xe8vt774jo5.cloudfront.net/'
											? getFallbackVideoUrl('P', champion.key)
											: champion.passive.videoUrl
									}
									controls
									loop
									muted
									autoPlay
								/>
								<div>
									{champion.passive.description
										.split('<br>')
										.filter((desc) => desc !== '')
										.map((desc, i, arr) => (
											<>
												<p className="mt-4 ml-4" key={`desc-${champion.id}-${i}`}>
													{desc.replace(/<\/?[\w\s="'#]+>/g, '')}
												</p>
												{arr.length !== i && <br />}
											</>
										))}
								</div>
							</div>
						</div>
					</TabsContent>
					{abilities.map((ability) => (
						<TabsContent value={ability.key} key={ability.key}>
							<div className="animate-fade-left">
								<h3 className="text-2xl font-bold">{ability.data.name}</h3>
								<p className="text-xl">
									CD:{' '}
									{ability.data.cooldowns.every((c) => c === ability.data.cooldowns[0])
										? `${ability.data.cooldowns[0]} s`
										: `${ability.data.cooldowns.slice(0, ability.key === 'R' ? 3 : 5).join(' / ')} s`}
								</p>
								<p className="text-xl">
									Cost:{' '}
									{ability.data.costs.every((c) => c === ability.data.costs[0])
										? `${ability.data.costs[0]}`
										: `${ability.data.costs.slice(0, ability.key === 'R' ? 3 : 5).join(' / ')}`}
								</p>
								<div className="flex items-start">
									<video
										className="mt-4 w-2/5 rounded-lg"
										src={
											ability.data.videoUrl === 'https://d28xe8vt774jo5.cloudfront.net/'
												? getFallbackVideoUrl(ability.key, champion.key)
												: ability.data.videoUrl
										}
										controls
										loop
										muted
										autoPlay
									/>
									<div>
										{ability.data.description
											.split('<br>')
											.filter((desc) => desc !== '')
											.map((desc, i, arr) => (
												<>
													<p className="mt-4 ml-4" key={`desc-${champion.id}-${i}`}>
														{desc.replace(/<\/?[\w\s="'#]+>/g, '')}
													</p>
													{arr.length !== i && <br />}
												</>
											))}
									</div>
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
