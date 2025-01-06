import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import './App.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Radio, Search as SearchIcon, Settings } from 'lucide-react';
import { Button } from './components/ui/button';
import ConfigModal from './features/ConfigModal';
import LiveGame from './features/LiveGame';
import Search from './features/Search';
import useGameStore from './stores/Game';
import type { CurrentGame } from './types/CurrentGame';

function App() {
	const { setCurrentGame, clearCurrentGame } = useGameStore((state) => state);

	const [tab, setTab] = useState<'live' | 'search'>('live');

	useEffect(() => {
		invoke<void>('initialize');
		const interval = setInterval(async () => {
			try {
				const result = await invoke<CurrentGame>('get_game_state');
				setCurrentGame(result);
			} catch (e) {
				// game not running
				clearCurrentGame();
			}
		}, 5 * 1000);

		return () => {
			clearInterval(interval);
		};
	}, [setCurrentGame, clearCurrentGame]);

	return (
		<main className="flex h-screen w-full items-center justify-center bg-background">
			<Tabs
				value={tab}
				onValueChange={(val) => setTab(val as 'live' | 'search')}
				className="flex flex-col h-full w-full"
			>
				<div className="flex-grow p-4 overflow-y-scroll w-full">
					<TabsContent
						forceMount
						hidden={tab !== 'live'}
						value="live"
						className={`${tab !== 'live' ? 'hidden' : 'flex'} mt-0 w-full`}
					>
						<LiveGame />
					</TabsContent>
					<TabsContent
						forceMount
						hidden={tab !== 'search'}
						value="search"
						className={`${tab !== 'search' ? 'hidden' : 'flex'} mt-0 w-full`}
					>
						<Search />
					</TabsContent>
				</div>
				<div className="border-t flex items-center bg-muted w-full">
					<TabsList className="h-16 flex-1 bg-transparent">
						<TabsTrigger
							value="live"
							className="flex-1 flex flex-col items-center space-y-1 h-full data-[state=active]:bg-background"
						>
							<Radio className="h-5 w-5" />
							<span>Live</span>
						</TabsTrigger>
						<TabsTrigger
							value="search"
							className="flex-1 flex flex-col items-center space-y-1 h-full data-[state=active]:bg-background"
						>
							<SearchIcon className="h-5 w-5" />
							<span>Search</span>
						</TabsTrigger>
					</TabsList>
					<ConfigModal>
						{({ onClick }) => (
							<Button variant="outline" size="icon" onClick={onClick} className="m-1">
								<Settings className="h-4 w-4" />
							</Button>
						)}
					</ConfigModal>
				</div>
			</Tabs>
		</main>
	);
}

export default App;
