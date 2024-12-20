import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import type { CurrentGame } from './types/CurrentGame';
import ConfigModal from './features/ConfigModal';
import { Radio, Search, Settings } from 'lucide-react';
import { Button } from './components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import useGameStore from './stores/Game';
import LiveGame from './features/LiveGame';

function App() {
	const { setCurrentGame, clearCurrentGame } = useGameStore((state) => state);

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
			<Tabs defaultValue="live" className="flex flex-col h-full w-full">
				<div className="flex-grow p-4 overflow-y-scroll w-full">
					<TabsContent value="live" className="flex mt-0 w-full">
						<LiveGame />
					</TabsContent>
					<TabsContent value="search" className="flex mt-0">
						<p>Search Content</p>
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
							<Search className="h-5 w-5" />
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
