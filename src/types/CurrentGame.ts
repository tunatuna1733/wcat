type Lane = 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY' | '';

export type PlayerData = {
	riotId: string;
	position: Lane;
	championId: string;
	championName: string;
};

export type CurrentGame = {
	myRiotId: string;
	teams: {
		blue: PlayerData[];
		red: PlayerData[];
	};
};
