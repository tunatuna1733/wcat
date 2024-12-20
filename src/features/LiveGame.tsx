import useGameStore from '@/stores/Game';
import PlayerChampion from './PlayerChampion';

const LiveGame = () => {
	const { currentGame } = useGameStore();

	return currentGame ? (
		<div>
			<PlayerChampion player={currentGame.teams.blue[0]} />
		</div>
	) : (
		<p>Game not running</p>
	);
};

export default LiveGame;
