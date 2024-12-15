import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import type { CurrentGame } from './types/CurrentGame';

function App() {
	const [currentGame, setCurrentGame] = useState<CurrentGame>();

	useEffect(() => {
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
		<main className="container">
			<p>{JSON.stringify(currentGame, null, 4)}</p>
		</main>
	);
}

export default App;
