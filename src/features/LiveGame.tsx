import useGameStore from '@/stores/Game';
import PlayerChampion from './PlayerChampion';

const LiveGame = () => {
	const { currentGame } = useGameStore();

	return currentGame ? (
		<div>
			<PlayerChampion champion={currentGame.teams.blue[0].championData} />
		</div>
	) : (
		<p>Game not running</p>
	);
};

export default LiveGame;
