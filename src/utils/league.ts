export const getFallbackVideoUrl = (ability: string, key: number) => {
	let keyStr = key.toString();
	while (keyStr.length !== 4) {
		keyStr = `0${keyStr}`;
	}
	return `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${keyStr}/ability_${keyStr}_${ability}1.webm`;
};
