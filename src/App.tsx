import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import type { CurrentGame } from './types/CurrentGame';
import Config from './features/Config';

function App() {
	const [currentGame, setCurrentGame] = useState<CurrentGame>();

	useEffect(() => {
		invoke<void>('initialize');
		const interval = setInterval(async () => {
			try {
				const result = await invoke<CurrentGame>('get_game_state');
				setCurrentGame(result);
			} catch (e) {
				// game not running
				console.error(e);
			}
		}, 5 * 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<Config />
		</main>
	);
}

export default App;
