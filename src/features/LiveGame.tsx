import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useGameStore from '@/stores/Game';
import { useEffect, useState } from 'react';
import PlayerChampion from './PlayerChampion';

const LiveGame = () => {
	const { currentGame } = useGameStore();

	const [currentUser, setCurrentUser] = useState('');

	useEffect(() => {
		if (currentGame) {
			setCurrentUser(currentGame.opponentRiotId);
		}
	}, [currentGame]);

	return currentGame ? (
		<>
			<Tabs value={currentUser} onValueChange={setCurrentUser} className="w-full flex flex-col">
				<div className="flex items-center bg-blue-200 dark:bg-blue-950 rounded-lg p-3 mb-3 w-full">
					<TabsList className="w-full flex-1 justify-between bg-transparent">
						{currentGame.teams.blue.map((b) => (
							<TabsTrigger
								value={b.riotId}
								key={`trigger-${b.riotId}`}
								className="overflow-hidden rounded-s transition-all p-0 data-[state=active]:border-4 data-[state=active]:border-blue-600"
							>
								<img src={b.championData.portraitImg} alt={`${b.championData.id}`} width={'45px'} height={'auto'} />
							</TabsTrigger>
						))}
					</TabsList>
				</div>
				<div className="flex items-center bg-red-200 dark:bg-red-950 rounded-lg p-3 w-full ">
					<TabsList className="w-full flex-1 justify-between bg-transparent">
						{currentGame.teams.red.map((r) => (
							<TabsTrigger
								value={r.riotId}
								key={`trigger-${r.riotId}`}
								className="overflow-hidden rounded-s transition-all p-0 data-[state=active]:border-4 data-[state=active]:border-red-600"
							>
								<img src={r.championData.portraitImg} alt={`${r.championData.id}`} width={'45px'} height={'auto'} />
							</TabsTrigger>
						))}
					</TabsList>
				</div>
				{currentGame.teams.blue.map((b) => (
					<TabsContent value={b.riotId} key={`content-${b.riotId}`}>
						<PlayerChampion champion={b.championData} />
					</TabsContent>
				))}
				{currentGame.teams.red.map((r) => (
					<TabsContent value={r.riotId} key={`content-${r.riotId}`}>
						<PlayerChampion champion={r.championData} />
					</TabsContent>
				))}
			</Tabs>
		</>
	) : (
		<p>Game not running</p>
	);
};

export default LiveGame;
