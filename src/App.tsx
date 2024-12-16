import { useCallback, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import type { CurrentGame } from './types/CurrentGame';

function App() {
	const [currentGame, setCurrentGame] = useState<CurrentGame>();
	const [lang, setLang] = useState('');

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

	const handleSetLangClick = useCallback(async () => {
		try {
			await invoke<void>('set_language', { lang });
		} catch (e) {
			console.error(e);
		}
	}, [lang]);

	return (
		<main className="container">
			<input
				value={lang}
				onChange={(e) => {
					setLang(e.target.value);
				}}
			/>
			<button onClick={handleSetLangClick} type="button">
				Set Lang
			</button>
			<p>{JSON.stringify(currentGame, null, 4)}</p>
		</main>
	);
}

export default App;
