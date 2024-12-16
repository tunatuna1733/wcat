type Lane = 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY' | '';

export type PlayerData = {
	riotId: string;
	position: Lane;
	championId: string;
	championName: string;
	championData: ChampionData;
};

export type CurrentGame = {
	myRiotId: string;
	teams: {
		blue: PlayerData[];
		red: PlayerData[];
	};
};

export type ChampionData = {
	id: string;
	key: number;
	portrait_img: string;
	passive: Passive;
	spells: Spell[];
};

type Passive = {
	name: string;
	iconImg: string;
	videoUrl: string;
	description: string;
};

type Spell = {
	spellKey: string;
	name: string;
	iconImg: string;
	videoUrl: string;
	costs: number[];
	cooldowns: number[];
	description: string;
	dynamicDescription: string;
};
